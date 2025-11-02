import type {
  ItemCompra,
  LugaresData,
  CompraData,
  CategoriaId,
} from "../types";
import { PRODUCTOS_INICIALES } from "../data/productosIniciales";
import { syncService } from "./syncService";

// Lugares predefinidos
const LUGARES_INICIALES = [
  "Supermercado",
  "Farmacia",
  "Mercado Local",
  "Tienda de Verduras",
  "Carnicería",
  "Panadería",
];

// Función para obtener datos del localStorage o inicializar
function getDataFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error al leer ${key} del localStorage:`, error);
  }
  return defaultValue;
}

// Función para guardar datos en localStorage
function saveDataToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage:`, error);
  }
}

// Función para sincronizar items
async function syncItems(items: ItemCompra[]): Promise<void> {
  try {
    await syncService.saveData(items);
  } catch (error) {
    console.error("Error sincronizando datos:", error);
  }
}

// Tipo para items con formato anterior
interface ItemCompraAntiguo {
  id: string;
  nombre: string;
  lugar: string;
  precio: number;
  categoria: string;
  falta: boolean;
}

// Función para migrar datos del formato antiguo al nuevo
function migrateItemsFromOldFormat(
  items: (ItemCompra | ItemCompraAntiguo)[]
): ItemCompra[] {
  return items.map((item) => {
    // Si ya tiene el nuevo formato, devolver tal como está
    if ("lugares" in item && Array.isArray(item.lugares)) {
      return item as ItemCompra;
    }

    // Migrar del formato antiguo (lugar: string) al nuevo (lugares: string[])
    const itemAntiguo = item as ItemCompraAntiguo;
    const lugares: string[] = [];
    if (itemAntiguo.lugar && itemAntiguo.lugar !== "") {
      lugares.push(itemAntiguo.lugar);
    }

    return {
      id: itemAntiguo.id,
      nombre: itemAntiguo.nombre,
      lugares,
      precio: itemAntiguo.precio,
      categoria: itemAntiguo.categoria as CategoriaId,
      falta: itemAntiguo.falta,
    } as ItemCompra;
  });
}

// Servicio para manejar lugares
export const lugaresService = {
  getLugares: (): string[] => {
    const data = getDataFromStorage<LugaresData>("lugares", {
      lugares: LUGARES_INICIALES,
    });
    return data.lugares;
  },

  agregarLugar: (lugar: string): void => {
    const lugares = lugaresService.getLugares();
    if (!lugares.includes(lugar.trim())) {
      lugares.push(lugar.trim());
      saveDataToStorage<LugaresData>("lugares", { lugares });
    }
  },

  eliminarLugar: (lugar: string): void => {
    const lugares = lugaresService.getLugares().filter((l) => l !== lugar);
    saveDataToStorage<LugaresData>("lugares", { lugares });
  },
};

// Array para almacenar los callbacks de suscriptores
let changeSubscribers: ((items: ItemCompra[]) => void)[] = [];

// Función para notificar a todos los suscriptores
function notifySubscribers(items: ItemCompra[]): void {
  changeSubscribers.forEach((callback) => {
    try {
      callback(items);
    } catch (error) {
      console.error("Error notificando suscriptor:", error);
    }
  });
}

// Servicio para manejar items de compra
export const compraService = {
  getItems: async (): Promise<ItemCompra[]> => {
    // Intentar cargar de sync primero
    const syncedItems = await syncService.loadData();
    if (syncedItems && syncedItems.length > 0) {
      const itemsMigrados = migrateItemsFromOldFormat(syncedItems);
      saveDataToStorage<CompraData>("compras", { items: itemsMigrados });
      return itemsMigrados;
    }

    // Fallback a localStorage
    const data = getDataFromStorage<CompraData>("compras", { items: [] });

    // Si no hay items, inicializar con los productos predefinidos
    if (data.items.length === 0) {
      saveDataToStorage<CompraData>("compras", { items: PRODUCTOS_INICIALES });
      await syncItems(PRODUCTOS_INICIALES);
      return PRODUCTOS_INICIALES;
    }

    // Migrar datos si es necesario
    const itemsMigrados = migrateItemsFromOldFormat(data.items);

    // Guardar los datos migrados si hubo cambios
    if (JSON.stringify(itemsMigrados) !== JSON.stringify(data.items)) {
      saveDataToStorage<CompraData>("compras", { items: itemsMigrados });
    }

    // Sincronizar los items locales
    await syncItems(itemsMigrados);
    return itemsMigrados;
  },

  getItemsSync: (): ItemCompra[] => {
    // Versión síncrona para compatibilidad
    const data = getDataFromStorage<CompraData>("compras", { items: [] });
    if (data.items.length === 0) {
      return PRODUCTOS_INICIALES;
    }

    // Migrar datos si es necesario
    const itemsMigrados = migrateItemsFromOldFormat(data.items);

    // Guardar los datos migrados si hubo cambios
    if (JSON.stringify(itemsMigrados) !== JSON.stringify(data.items)) {
      saveDataToStorage<CompraData>("compras", { items: itemsMigrados });
    }

    return itemsMigrados;
  },

  agregarItem: async (item: Omit<ItemCompra, "id">): Promise<ItemCompra> => {
    const items = compraService.getItemsSync();
    const nuevoItem: ItemCompra = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    items.push(nuevoItem);
    saveDataToStorage<CompraData>("compras", { items });

    // Notificar inmediatamente a los suscriptores
    notifySubscribers(items);

    // Sincronizar en segundo plano
    await syncItems(items);
    return nuevoItem;
  },

  actualizarItem: async (
    id: string,
    itemActualizado: Partial<ItemCompra>
  ): Promise<void> => {
    const items = compraService.getItemsSync();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...itemActualizado };
      saveDataToStorage<CompraData>("compras", { items });

      // Notificar inmediatamente a los suscriptores
      notifySubscribers(items);

      // Sincronizar en segundo plano
      await syncItems(items);
    }
  },

  eliminarItem: async (id: string): Promise<void> => {
    const items = compraService.getItemsSync().filter((item) => item.id !== id);
    saveDataToStorage<CompraData>("compras", { items });

    // Notificar inmediatamente a los suscriptores
    notifySubscribers(items);

    // Sincronizar en segundo plano
    await syncItems(items);
  },

  toggleFalta: async (id: string): Promise<void> => {
    const items = compraService.getItemsSync();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index].falta = !items[index].falta;
      saveDataToStorage<CompraData>("compras", { items });

      // Notificar inmediatamente a los suscriptores
      notifySubscribers(items);

      // Sincronizar en segundo plano
      await syncItems(items);
    }
  },

  // Suscribirse a cambios en tiempo real
  subscribeToChanges: (
    callback: (items: ItemCompra[]) => void
  ): (() => void) => {
    // Agregar callback local
    changeSubscribers.push(callback);

    // También suscribirse al servicio de sync para cambios externos
    const syncUnsubscribe = syncService.subscribeToChanges(callback);

    // Retornar función para desuscribirse de ambos
    return () => {
      // Remover del array local
      changeSubscribers = changeSubscribers.filter((cb) => cb !== callback);
      // Desuscribirse del sync service
      syncUnsubscribe();
    };
  },
};
