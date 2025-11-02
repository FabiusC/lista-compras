import { useState } from 'react';
import type { ItemCompra, CategoriaId, LugarId } from '../types';
import { categoriaService } from '../services/categoriaService';
import { lugarService } from '../services/lugarService';
import { formatearInputPrecio, parsearPrecio, formatearPrecio } from '../utils/formatoPrecio';

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
  const [lugares, setLugares] = useState<LugarId[]>(item?.lugares || []);
  const [precio, setPrecio] = useState(
    item?.precio ? formatearPrecio(item.precio) : ''
  );
  const [categoria, setCategoria] = useState<CategoriaId>(item?.categoria || 'otros');
  const [falta, setFalta] = useState(item?.falta ?? true);

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormateado = formatearInputPrecio(e.target.value);
    setPrecio(valorFormateado);
  };

  const handleLugarChange = (lugarId: LugarId, checked: boolean) => {
    if (checked) {
      setLugares([...lugares, lugarId]);
    } else {
      setLugares(lugares.filter(id => id !== lugarId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const itemData = {
      ...(item ? { id: item.id } : {}),
      nombre: nombre.trim(),
      lugares,
      precio: parsearPrecio(precio),
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
            <label>Lugares (puede seleccionar múltiples)</label>
            <div className="checkbox-list">
              {lugarService.getAll().map((lugar) => (
                <label key={lugar.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={lugares.includes(lugar.id as LugarId)}
                    onChange={(e) => handleLugarChange(lugar.id as LugarId, e.target.checked)}
                  />
                  <span>{lugar.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input
              type="text"
              inputMode="numeric"
              value={precio}
              onChange={handlePrecioChange}
              placeholder="0"
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

