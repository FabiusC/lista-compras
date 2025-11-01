import { useState } from 'react';
import type { ItemCompra, CategoriaId, LugarId } from '../types';
import { categoriaService } from '../services/categoriaService';
import { lugarService } from '../services/lugarService';

interface FormularioItemProps {
  item?: ItemCompra;
  onSave: (item: Omit<ItemCompra, 'id'> | ItemCompra) => void;
  onCancel: () => void;
}

export function FormularioItem({
  item,
  onSave,
  onCancel
}: FormularioItemProps) {
  const [nombre, setNombre] = useState(item?.nombre || '');
  const [lugar, setLugar] = useState<LugarId | ''>(item?.lugar || '');
  const [precio, setPrecio] = useState(item?.precio?.toString() || '0');
  const [categoria, setCategoria] = useState<CategoriaId>(item?.categoria || 'otros');
  const [falta, setFalta] = useState(item?.falta ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const itemData = {
      ...(item ? { id: item.id } : {}),
      nombre: nombre.trim(),
      lugar: lugar || ('' as const),
      precio: parseFloat(precio) || 0,
      categoria,
      falta
    };

    onSave(itemData);
  };

  return (
    <div className="formulario-overlay">
      <div className="formulario-container">
        <h2>{item ? 'Editar Item' : 'Agregar Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Lugar</label>
            <select
              value={lugar}
              onChange={(e) => setLugar(e.target.value as LugarId | '')}
            >
              <option value="">-- Seleccionar lugar --</option>
              {lugarService.getAll().map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaId)}
            >
              {categoriaService.getAll().map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={falta}
                onChange={(e) => setFalta(e.target.checked)}
              />
              Falta por comprar
            </label>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-save">
              {item ? 'Guardar' : 'Agregar'}
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

