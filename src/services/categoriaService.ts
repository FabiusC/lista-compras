import type { CategoriaInfo, CategoriaId } from '../types/categoria';

// Definición de todas las categorías con ID y nombre
const CATEGORIAS_DATA: CategoriaInfo[] = [
  { id: 'lacteos', nombre: 'Lácteos' },
  { id: 'proteinas', nombre: 'Proteínas' },
  { id: 'panaderia', nombre: 'Panadería' },
  { id: 'cereales', nombre: 'Cereales' },
  { id: 'frutas-y-verduras', nombre: 'Frutas y Verduras' },
  { id: 'salsas-y-condimentos', nombre: 'Salsas y Condimentos' },
  { id: 'snacks', nombre: 'Snacks' },
  { id: 'bebidas', nombre: 'Bebidas' },
  { id: 'pasta-y-comidas-rapidas', nombre: 'Pasta y Comidas Rápidas' },
  { id: 'productos-congelados', nombre: 'Productos Congelados' },
  { id: 'aseo-personal', nombre: 'Aseo Personal' },
  { id: 'aseo', nombre: 'Aseo' },
  { id: 'farmacia', nombre: 'Farmacia' },
  { id: 'otros', nombre: 'Otros' }
];

// Servicio para manejar categorías
export const categoriaService = {
  // Obtener todas las categorías
  getAll: (): CategoriaInfo[] => {
    return CATEGORIAS_DATA;
  },

  // Obtener categoría por ID
  getById: (id: CategoriaId): CategoriaInfo | undefined => {
    return CATEGORIAS_DATA.find(cat => cat.id === id);
  },

  // Obtener nombre de categoría por ID
  getNombreById: (id: CategoriaId): string => {
    const categoria = categoriaService.getById(id);
    return categoria?.nombre || id;
  },

  // Verificar si un ID de categoría es válido
  isValidId: (id: string): id is CategoriaId => {
    return CATEGORIAS_DATA.some(cat => cat.id === id);
  },

  // Obtener array de IDs
  getAllIds: (): CategoriaId[] => {
    return CATEGORIAS_DATA.map(cat => cat.id as CategoriaId);
  }
};

