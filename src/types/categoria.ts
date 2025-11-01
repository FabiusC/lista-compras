export interface CategoriaInfo {
  id: string;
  nombre: string;
}

export type CategoriaId = 
  | 'lacteos'
  | 'proteinas'
  | 'panaderia'
  | 'cereales'
  | 'frutas-y-verduras'
  | 'salsas-y-condimentos'
  | 'snacks'
  | 'bebidas'
  | 'pasta-y-comidas-rapidas'
  | 'productos-congelados'
  | 'aseo-personal'
  | 'aseo'
  | 'farmacia'
  | 'otros';

