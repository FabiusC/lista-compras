import type { ItemCompra, LugaresData, CompraData } from '../types';
import { PRODUCTOS_INICIALES } from '../data/productosIniciales';
import { syncService } from './syncService';

// Lugares predefinidos
const LUGARES_INICIALES = [
  'Supermercado',
  'Farmacia',
  'Mercado Local',
  'Tienda de Verduras',
  'Carnicería',
  'Panadería'
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
    console.error('Error sincronizando datos:', error);
  }
}

// Servicio para manejar lugares
export const lugaresService = {
  getLugares: (): string[] => {
    const data = getDataFromStorage<LugaresData>('lugares', { lugares: LUGARES_INICIALES });
    return data.lugares;
  },

  agregarLugar: (lugar: string): void => {
    const lugares = lugaresService.getLugares();
    if (!lugares.includes(lugar.trim())) {
      lugares.push(lugar.trim());
      saveDataToStorage<LugaresData>('lugares', { lugares });
    }
  },

  eliminarLugar: (lugar: string): void => {
    const lugares = lugaresService.getLugares().filter(l => l !== lugar);
    saveDataToStorage<LugaresData>('lugares', { lugares });
  }
};

// Servicio para manejar items de compra
export const compraService = {
  getItems: async (): Promise<ItemCompra[]> => {
    // Intentar cargar de sync primero
    const syncedItems = await syncService.loadData();
    if (syncedItems && syncedItems.length > 0) {
      saveDataToStorage<CompraData>('compras', { items: syncedItems });
      return syncedItems;
    }

    // Fallback a localStorage
    const data = getDataFromStorage<CompraData>('compras', { items: [] });
    
    // Si no hay items, inicializar con los productos predefinidos
    if (data.items.length === 0) {
      saveDataToStorage<CompraData>('compras', { items: PRODUCTOS_INICIALES });
      await syncItems(PRODUCTOS_INICIALES);
      return PRODUCTOS_INICIALES;
    }

    // Sincronizar los items locales
    await syncItems(data.items);
    return data.items;
  },

  getItemsSync: (): ItemCompra[] => {
    // Versión síncrona para compatibilidad
    const data = getDataFromStorage<CompraData>('compras', { items: [] });
    if (data.items.length === 0) {
      return PRODUCTOS_INICIALES;
    }
    return data.items;
  },

  agregarItem: async (item: Omit<ItemCompra, 'id'>): Promise<ItemCompra> => {
    const items = compraService.getItemsSync();
    const nuevoItem: ItemCompra = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    items.push(nuevoItem);
    saveDataToStorage<CompraData>('compras', { items });
    await syncItems(items);
    return nuevoItem;
  },

  actualizarItem: async (id: string, itemActualizado: Partial<ItemCompra>): Promise<void> => {
    const items = compraService.getItemsSync();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...itemActualizado };
      saveDataToStorage<CompraData>('compras', { items });
      await syncItems(items);
    }
  },

  eliminarItem: async (id: string): Promise<void> => {
    const items = compraService.getItemsSync().filter(item => item.id !== id);
    saveDataToStorage<CompraData>('compras', { items });
    await syncItems(items);
  },

  toggleFalta: async (id: string): Promise<void> => {
    const items = compraService.getItemsSync();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index].falta = !items[index].falta;
      saveDataToStorage<CompraData>('compras', { items });
      await syncItems(items);
    }
  },

  // Suscribirse a cambios en tiempo real
  subscribeToChanges: (callback: (items: ItemCompra[]) => void): (() => void) => {
    return syncService.subscribeToChanges(callback);
  }
};

