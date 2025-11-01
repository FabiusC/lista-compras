import type { ItemCompra, LugaresData, CompraData } from '../types';
import { PRODUCTOS_INICIALES } from '../data/productosIniciales';

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
  getItems: (): ItemCompra[] => {
    const data = getDataFromStorage<CompraData>('compras', { items: [] });
    // Si no hay items, inicializar con los productos predefinidos
    if (data.items.length === 0) {
      saveDataToStorage<CompraData>('compras', { items: PRODUCTOS_INICIALES });
      return PRODUCTOS_INICIALES;
    }
    return data.items;
  },

  agregarItem: (item: Omit<ItemCompra, 'id'>): ItemCompra => {
    const items = compraService.getItems();
    const nuevoItem: ItemCompra = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    items.push(nuevoItem);
    saveDataToStorage<CompraData>('compras', { items });
    return nuevoItem;
  },

  actualizarItem: (id: string, itemActualizado: Partial<ItemCompra>): void => {
    const items = compraService.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...itemActualizado };
      saveDataToStorage<CompraData>('compras', { items });
    }
  },

  eliminarItem: (id: string): void => {
    const items = compraService.getItems().filter(item => item.id !== id);
    saveDataToStorage<CompraData>('compras', { items });
  },

  toggleFalta: (id: string): void => {
    const items = compraService.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index].falta = !items[index].falta;
      saveDataToStorage<CompraData>('compras', { items });
    }
  }
};

