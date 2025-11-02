import type { CategoriaId } from "./types/categoria";
import type { LugarId } from "./types/lugar";

export type { CategoriaId, CategoriaInfo } from "./types/categoria";
export type { LugarId, LugarInfo } from "./types/lugar";

export interface ItemCompra {
  id: string;
  nombre: string;
  lugares: LugarId[];
  precio: number;
  categoria: CategoriaId;
  falta: boolean;
}

export interface LugaresData {
  lugares: string[];
}

export interface CompraData {
  items: ItemCompra[];
}
