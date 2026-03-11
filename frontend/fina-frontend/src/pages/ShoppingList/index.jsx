import { FiPlus, FiCheck, FiEdit, FiTrash, FiShoppingCart, FiArchive } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navigation/Sidebar';
import axios from 'axios';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist'
      );
      const data = response.data;
      // garante que seja sempre um array
      setItems(Array.isArray(data) ? data : data.buylist || []);
    } catch (error) {
      console.error('Erro ao carregar lista de compra', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    try {
      const payload = {
        stockItem: null,
        quantity: 1,
        unit: 'un',
        reason: newItemName.trim(),
        purchased: false
      };
      const response = await axios.post(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist',
        payload
      );
      const created = response.data;
      setItems(prev =>
        Array.isArray(prev) ? [...prev, created] : [created]
      );
      setNewItemName('');
    } catch (error) {
      console.error('Erro ao adicionar item', error);
    }
  };

  const handleTogglePurchased = async (item) => {
    try {
      const updated = {
        ...item,
        purchased: !item.purchased,
        purchasedAt: item.purchased ? null : new Date().toISOString()
      };
      const response = await axios.put(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist',
        updated
      );
      const saved = response.data;
      setItems(prev =>
        Array.isArray(prev)
          ? prev.map(i => (i.id === saved.id ? saved : i))
          : [saved]
      );
    } catch (error) {
      console.error('Erro ao atualizar compra', error);
    }
  };

  const handleEditSave = async (updated) => {
    try {
      const response = await axios.put(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist',
        updated
      );
      const saved = response.data;
      setItems(prev =>
        Array.isArray(prev)
          ? prev.map(i => (i.id === saved.id ? saved : i))
          : [saved]
      );
      setEditItem(null);
    } catch (error) {
      console.error('Erro ao editar item', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist/${id}`
      );
      setItems(prev =>
        Array.isArray(prev) ? prev.filter(i => i.id !== id) : []
      );
    } catch (error) {
      console.error('Erro ao excluir item', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await axios.delete(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist/clear/purchased'
      );
      setItems(prev =>
        Array.isArray(prev) ? prev.filter(i => !i.purchased) : []
      );
    } catch (error) {
      console.error('Erro ao limpar comprados', error);
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="content">
        <div className="shopping-header">
          <h1><FiShoppingCart /> Lista de Compras</h1>
          <div className="controls">
            <button
              className="btn btn-danger"
              onClick={handleClearCompleted}
              disabled={!items.some(i => i.purchased)}
            >
              <FiTrash /> Limpar Comprados
            </button>
          </div>
        </div>

        <div className="add-item-form">
          <input
            type="text"
            placeholder="Adicionar novo item..."
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddItem()}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
          >
            <FiPlus /> Adicionar
          </button>
        </div>

        <div className="shopping-list">
          {Array.isArray(items) &&
            items.map(item => (
              <div key={item.id} className="list-item">
                <button
                  className="check-button"
                  onClick={() => handleTogglePurchased(item)}
                >
                  <FiCheck className={item.purchased ? 'checked' : ''} />
                </button>
                <div className="item-info">
                  <span className="item-name">{item.reason}</span>
                  <span className="item-details">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="item-actions">
                  <button
                    className="btn-icon"
                    onClick={() => setEditItem(item)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {editItem && (
          <EditItemModal
            item={editItem}
            onClose={() => setEditItem(null)}
            onSave={handleEditSave}
          />
        )}
      </main>
    </div>
  );
};

const EditItemModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item);

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item</label>
            <input
              type="text"
              value={formData.reason}
              onChange={e =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={e =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <select
                value={formData.unit}
                onChange={e =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                <option value="un">Unidade</option>
                <option value="kg">Quilograma</option>
                <option value="g">Grama</option>
                <option value="l">Litro</option>
                <option value="ml">Mililitro</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShoppingList;
