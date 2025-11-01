import type { ItemCompra } from '../types';
import { categoriaService } from '../services/categoriaService';
import { lugarService } from '../services/lugarService';
import { formatearPrecio } from '../utils/formatoPrecio';

interface ItemCardProps {
  item: ItemCompra;
  onEdit: (item: ItemCompra) => void;
  onDelete: (id: string) => void;
  onToggleFalta: (id: string) => void;
}

export function ItemCard({ item, onEdit, onDelete, onToggleFalta }: ItemCardProps) {
  const nombreCategoria = categoriaService.getNombreById(item.categoria);
  const nombreLugar = item.lugar ? lugarService.getNombreById(item.lugar) : '';
  const precioFormateado = formatearPrecio(item.precio);
  
  return (
    <div className={`item-card ${item.falta ? '' : 'comprado'}`}>
      <div className="item-header">
        <h3 className="item-nombre">{item.nombre}</h3>
        <div className="item-acciones">
          <button
            className="btn-toggle"
            onClick={() => onToggleFalta(item.id)}
            aria-label={item.falta ? 'Marcar como comprado' : 'Marcar como falta'}
          >
            {item.falta ? '❌' : '✓'}
          </button>
          <button
            className="btn-edit"
            onClick={() => onEdit(item)}
            aria-label="Editar"
          >
            ✏️
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(item.id)}
            aria-label="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="item-detalles">
        {nombreLugar && <span className="item-lugar">📍 {nombreLugar}</span>}
        <span className="item-categoria">🏷️ {nombreCategoria}</span>
        <span className="item-precio">💰 ${precioFormateado}</span>
      </div>
    </div>
  );
}

