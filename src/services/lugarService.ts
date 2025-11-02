import type { LugarInfo, LugarId } from "../types/lugar";

// Definición de todos los lugares con ID y nombre
const LUGARES_DATA: LugarInfo[] = [
  { id: "d1", nombre: "D1" },
  { id: "exito", nombre: "Exito" },
  { id: "jumbo", nombre: "Jumbo" },
  { id: "fruver", nombre: "Fruver" },
  { id: "otros", nombre: "Otros" },
];

// Servicio para manejar lugares
export const lugarService = {
  // Obtener todos los lugares
  getAll: (): LugarInfo[] => {
    return LUGARES_DATA;
  },

  // Obtener lugar por ID
  getById: (id: LugarId): LugarInfo | undefined => {
    return LUGARES_DATA.find((lugar) => lugar.id === id);
  },

  // Obtener nombre de lugar por ID
  getNombreById: (id: LugarId | string): string => {
    if (id === "") return "";
    const lugar = lugarService.getById(id as LugarId);
    return lugar?.nombre || id;
  },

  // Verificar si un ID de lugar es válido
  isValidId: (id: string): id is LugarId => {
    return LUGARES_DATA.some((lugar) => lugar.id === id);
  },

  // Obtener array de IDs
  getAllIds: (): LugarId[] => {
    return LUGARES_DATA.map((lugar) => lugar.id as LugarId);
  },

  // Obtener array de nombres
  getAllNombres: (): string[] => {
    return LUGARES_DATA.map((lugar) => lugar.nombre);
  },
};
