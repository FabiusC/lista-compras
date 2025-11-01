import { useState, useEffect, useMemo } from 'react';
import type { ItemCompra, CategoriaId } from './types';
import { compraService } from './services/storageService';
import { FiltrosBar } from './components/FiltrosBar';
import { ItemCard } from './components/ItemCard';
import { FormularioItem } from './components/FormularioItem';
import './App.css';

function App() {
  const [items, setItems] = useState<ItemCompra[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemCompra | undefined>();
  
  // Filtros
  const [lugarFiltro, setLugarFiltro] = useState<string>('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaId | 'todos'>('todos');
  const [faltaFiltro, setFaltaFiltro] = useState<'todos' | 'falta' | 'no-falta'>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Cargar datos iniciales
  useEffect(() => {
    setItems(compraService.getItems());
  }, []);

  // Filtrar items
  const itemsFiltrados = useMemo(() => {
    return items.filter((item) => {
      // Filtro por lugar
      if (lugarFiltro !== 'todos') {
        if (lugarFiltro === 'sin-lugar' && item.lugar !== '') {
          return false;
        }
        if (lugarFiltro !== 'sin-lugar' && item.lugar !== lugarFiltro) {
          return false;
        }
      }

      // Filtro por categoría
      if (categoriaFiltro !== 'todos' && item.categoria !== categoriaFiltro) {
        return false;
      }

      // Filtro por falta/no falta
      if (faltaFiltro === 'falta' && !item.falta) {
        return false;
      }
      if (faltaFiltro === 'no-falta' && item.falta) {
        return false;
      }

      // Filtro por búsqueda
      if (busqueda.trim() && !item.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [items, lugarFiltro, categoriaFiltro, faltaFiltro, busqueda]);

  const handleAgregar = () => {
    setItemEditando(undefined);
    setMostrarFormulario(true);
  };

  const handleEditar = (item: ItemCompra) => {
    setItemEditando(item);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      compraService.eliminarItem(id);
      setItems(compraService.getItems());
    }
  };

  const handleGuardar = (itemData: Omit<ItemCompra, 'id'> | ItemCompra) => {
    if ('id' in itemData) {
      compraService.actualizarItem(itemData.id, itemData);
    } else {
      compraService.agregarItem(itemData);
    }
    setItems(compraService.getItems());
    setMostrarFormulario(false);
    setItemEditando(undefined);
  };

  const handleToggleFalta = (id: string) => {
    compraService.toggleFalta(id);
    setItems(compraService.getItems());
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 Lista de Compras</h1>
        <button className="btn-agregar" onClick={handleAgregar}>
          ➕ Agregar
        </button>
      </header>

      <FiltrosBar
        lugarFiltro={lugarFiltro}
        categoriaFiltro={categoriaFiltro}
        faltaFiltro={faltaFiltro}
        busqueda={busqueda}
        onLugarChange={setLugarFiltro}
        onCategoriaChange={setCategoriaFiltro}
        onFaltaChange={setFaltaFiltro}
        onBusquedaChange={setBusqueda}
      />

      <div className="lista-container">
        {itemsFiltrados.length === 0 ? (
          <div className="lista-vacia">
            <p>No hay items que coincidan con los filtros</p>
          </div>
        ) : (
          itemsFiltrados.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEditar}
              onDelete={handleEliminar}
              onToggleFalta={handleToggleFalta}
            />
          ))
        )}
      </div>

      {mostrarFormulario && (
        <FormularioItem
          item={itemEditando}
          onSave={handleGuardar}
          onCancel={() => {
            setMostrarFormulario(false);
            setItemEditando(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;
