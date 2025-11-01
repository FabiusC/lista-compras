import { useState, useEffect } from 'react';
import type { CategoriaId } from '../types';
import { categoriaService } from '../services/categoriaService';
import { lugarService } from '../services/lugarService';

interface FiltrosBarProps {
  lugarFiltro: string;
  categoriaFiltro: CategoriaId | 'todos';
  faltaFiltro: 'todos' | 'falta' | 'no-falta';
  busqueda: string;
  onLugarChange: (lugar: string) => void;
  onCategoriaChange: (categoria: CategoriaId | 'todos') => void;
  onFaltaChange: (falta: 'todos' | 'falta' | 'no-falta') => void;
  onBusquedaChange: (busqueda: string) => void;
}

export function FiltrosBar({
  lugarFiltro,
  categoriaFiltro,
  faltaFiltro,
  busqueda,
  onLugarChange,
  onCategoriaChange,
  onFaltaChange,
  onBusquedaChange
}: FiltrosBarProps) {
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  // Mostrar búsqueda si hay texto
  useEffect(() => {
    if (busqueda.trim()) {
      setMostrarBusqueda(true);
    }
  }, [busqueda]);

  // Enfocar el input cuando se muestra
  useEffect(() => {
    if (mostrarBusqueda && inputElement) {
      inputElement.focus();
    }
  }, [mostrarBusqueda, inputElement]);

  const toggleBusqueda = () => {
    if (mostrarBusqueda) {
      // Si está abierta, cerrar y limpiar
      onBusquedaChange('');
      setMostrarBusqueda(false);
    } else {
      // Si está cerrada, abrir
      setMostrarBusqueda(true);
    }
  };

  const mostrarFiltros = !busqueda.trim();

  return (
    <div className="filtros-bar">
      <div className="filtros-row-main">
        <button
          type="button"
          className="btn-busqueda-toggle"
          onClick={toggleBusqueda}
          aria-label="Buscar"
        >
          🔍
        </button>

        {mostrarBusqueda && (
          <input
            ref={setInputElement}
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="busqueda-input-compact"
            onBlur={() => {
              // Ocultar solo si está vacío
              if (!busqueda.trim()) {
                setMostrarBusqueda(false);
              }
            }}
          />
        )}

        {mostrarFiltros && (
          <>
            <select
              value={lugarFiltro}
              onChange={(e) => onLugarChange(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">📍 Todos</option>
              <option value="sin-lugar">📍 Sin lugar</option>
              {lugarService.getAll().map((lugar) => (
                <option key={lugar.id} value={lugar.id}>
                  {lugar.nombre}
                </option>
              ))}
            </select>

            <select
              value={categoriaFiltro}
              onChange={(e) => onCategoriaChange(e.target.value as CategoriaId | 'todos')}
              className="filtro-select"
            >
              <option value="todos">🏷️ Todas</option>
              {categoriaService.getAll().map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            <select
              value={faltaFiltro}
              onChange={(e) => onFaltaChange(e.target.value as 'todos' | 'falta' | 'no-falta')}
              className="filtro-select"
            >
              <option value="todos">✅ Todos</option>
              <option value="falta">❌ Falta</option>
              <option value="no-falta">✓ Comprado</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
}

