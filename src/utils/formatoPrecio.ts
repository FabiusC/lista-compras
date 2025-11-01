/**
 * Formatea un número agregando puntos de mil
 * Ejemplo: 10000 -> "10.000"
 */
export function formatearPrecio(precio: number): string {
  return Math.round(precio).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Convierte un string con formato de precio a número
 * Ejemplo: "10.000" -> 10000
 */
export function parsearPrecio(valor: string): number {
  // Remover todos los puntos y convertir a número
  const numeroLimpio = valor.replace(/\./g, '');
  const numero = parseInt(numeroLimpio, 10);
  return isNaN(numero) ? 0 : numero;
}

/**
 * Formatea el valor mientras el usuario escribe
 * Agrega puntos de mil automáticamente
 */
export function formatearInputPrecio(valor: string): string {
  // Remover caracteres no numéricos (excepto puntos que ya están)
  let numeroLimpio = valor.replace(/[^\d]/g, '');
  
  // Si está vacío, retornar vacío
  if (numeroLimpio === '') {
    return '';
  }

  // Convertir a número y formatear
  const numero = parseInt(numeroLimpio, 10);
  if (isNaN(numero)) {
    return '';
  }

  return formatearPrecio(numero);
}

