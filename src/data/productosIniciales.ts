import type { ItemCompra, CategoriaId } from "../types";

// Función para generar ID único
function generarId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Función para crear item
function crearItem(nombre: string, categoria: CategoriaId): ItemCompra {
  return {
    id: generarId(),
    nombre,
    lugares: [],
    precio: 0,
    categoria,
    falta: true,
  };
}

export const PRODUCTOS_INICIALES: ItemCompra[] = [
  // Lácteos y derivados
  crearItem("Leche", "lacteos"),
  crearItem("Yogurt griego", "lacteos"),
  crearItem("Mantequilla", "lacteos"),
  crearItem("Mantequilla para untar", "lacteos"),
  crearItem("Margarina", "lacteos"),
  crearItem("Chocolate", "lacteos"),
  crearItem("Chips de chicolate", "lacteos"),

  // Proteínas
  crearItem("Huevos", "proteinas"),
  crearItem("Salchichas", "proteinas"),
  crearItem("Pechugas de pollo", "proteinas"),
  crearItem("Carne Hamburguesa", "proteinas"),
  crearItem("Atún", "proteinas"),

  // Panadería y productos de harina
  crearItem("Pan tajado", "panaderia"),
  crearItem("Pan hamburguesa", "panaderia"),
  crearItem("Queso tajado", "panaderia"),
  crearItem("Jamon", "panaderia"),
  crearItem("Tocineta", "panaderia"),
  crearItem("Arepas", "panaderia"),
  crearItem("Harina de Pancake", "panaderia"),
  crearItem("Cachapa", "panaderia"),
  crearItem("Rice cake D1", "panaderia"),

  // Cereales y granos
  crearItem("Arroz 2Kg", "cereales"),
  crearItem("Lentejas 1Kg", "cereales"),
  crearItem("Frijoles 1Kg", "cereales"),
  crearItem("Garbanzos", "cereales"),
  crearItem("Arvejas 1lb", "cereales"),
  crearItem("Avena flakes", "cereales"),

  // Frutas y verduras
  crearItem("Banano", "frutas-y-verduras"),
  crearItem("Manzana verde", "frutas-y-verduras"),
  crearItem("Fresas", "frutas-y-verduras"),
  crearItem("Arandanos", "frutas-y-verduras"),
  crearItem("Limon", "frutas-y-verduras"),
  crearItem("Lulo", "frutas-y-verduras"),
  crearItem("Tomate de árbol", "frutas-y-verduras"),
  crearItem("Papa Grande", "frutas-y-verduras"),
  crearItem("Papa pequeña", "frutas-y-verduras"),
  crearItem("Zanahorias", "frutas-y-verduras"),
  crearItem("Tomate", "frutas-y-verduras"),
  crearItem("Cebolla larga", "frutas-y-verduras"),
  crearItem("edamame", "frutas-y-verduras"),
  crearItem("Pepino", "frutas-y-verduras"),
  crearItem("Lechuga", "frutas-y-verduras"),
  crearItem("Pimenton", "frutas-y-verduras"),

  // Salsas y condimentos
  crearItem("Miel", "salsas-y-condimentos"),
  crearItem("Azucar", "salsas-y-condimentos"),
  crearItem("Sal", "salsas-y-condimentos"),
  crearItem("Panela", "salsas-y-condimentos"),
  crearItem("Sirope", "salsas-y-condimentos"),
  crearItem("Mermelada", "salsas-y-condimentos"),
  crearItem("Salsa de piña", "salsas-y-condimentos"),
  crearItem("Salsa de tomate", "salsas-y-condimentos"),
  crearItem("Mayonesa", "salsas-y-condimentos"),
  crearItem("Salsa de soya", "salsas-y-condimentos"),
  crearItem("Teriyaki", "salsas-y-condimentos"),
  crearItem("Salsa negra", "salsas-y-condimentos"),
  crearItem("Ajo en polvo", "salsas-y-condimentos"),
  crearItem("Vinagre de Arroz", "salsas-y-condimentos"),
  crearItem("Vinagre Balsámico", "salsas-y-condimentos"),
  crearItem("Salsa Ranch", "salsas-y-condimentos"),
  crearItem("Vinagreta", "salsas-y-condimentos"),
  crearItem("Chili powder", "salsas-y-condimentos"),
  crearItem("Chili flakes", "salsas-y-condimentos"),
  crearItem("Aceite de ajonjolí", "salsas-y-condimentos"),
  crearItem("Aceite de oliva", "salsas-y-condimentos"),
  crearItem("Aceite vegetal", "salsas-y-condimentos"),
  crearItem("Ajonjoli", "salsas-y-condimentos"),

  // Snacks y untables
  crearItem("Milo", "snacks"),
  crearItem("Cereal", "snacks"),
  crearItem("Nuzart", "snacks"),
  crearItem("Peanut butter", "snacks"),
  crearItem("Chips de chocolate", "snacks"),
  crearItem("Almendra fileteada", "snacks"),

  // Bebidas
  crearItem("Té negro", "bebidas"),
  crearItem("Té de matcha", "bebidas"),
  crearItem("Té", "bebidas"),
  crearItem("Aromática", "bebidas"),
  crearItem("Jugo grande", "bebidas"),
  crearItem("Zumo", "bebidas"),

  // Pasta y comidas rápidas
  crearItem("Pasta", "pasta-y-comidas-rapidas"),
  crearItem("Mac & Cheese", "pasta-y-comidas-rapidas"),
  crearItem("Cup noodles", "pasta-y-comidas-rapidas"),

  // Productos congelados
  crearItem("Nuggets de pollo", "productos-congelados"),
  crearItem("Milanesas", "productos-congelados"),
  crearItem("Pescado apanado", "productos-congelados"),

  // Aseo personal
  crearItem("Crema dental", "aseo-personal"),
  crearItem("Enjuague bucal", "aseo-personal"),
  crearItem("Jabon corporal", "aseo-personal"),
  crearItem("Jabon de manos", "aseo-personal"),
  crearItem("Desodorantes", "aseo-personal"),
  crearItem("Depilacion", "aseo-personal"),
  crearItem("Esponja corporal", "aseo-personal"),
  crearItem("Seda dental", "aseo-personal"),

  // Aseo y hogar
  crearItem("Jabón para ropa", "aseo"),
  crearItem("Aromatizante del piso", "aseo"),
  crearItem("Bolsas blancas", "aseo"),
  crearItem("Bolsas negras", "aseo"),
  crearItem("Papel higiénico", "aseo"),
  crearItem("Papel parafinado", "aseo"),
  crearItem("Toallas de cocina", "aseo"),
  crearItem("Gel azul D1", "aseo"),
  crearItem("Jabon Rey", "aseo"),
  crearItem("Palo de escoba", "aseo"),
  crearItem("Vinagre blanco", "aseo"),
  crearItem("Jabón en polvo de bicarbonato con limon", "aseo"),
  crearItem("Bio varsol en crema", "aseo"),
  crearItem("Guantes baño", "aseo"),
  crearItem("Barsol", "aseo"),
  crearItem("Jabon de loza", "aseo"),
  crearItem("Briket", "aseo"),
  crearItem("Trapitos", "aseo"),

  // Farmacia
  crearItem("Cetiricina", "farmacia"),
  crearItem("Isomeprasol", "farmacia"),
];
