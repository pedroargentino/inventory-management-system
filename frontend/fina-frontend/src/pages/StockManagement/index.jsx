import { FiPlus, FiEdit, FiTrash, FiArchive, FiMapPin } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navigation/Sidebar';
import axios from 'axios';

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStock, setEditStock] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/locations'
      );
      // Garante que sempre seja um array
      const data = response.data;
      setStocks(Array.isArray(data) ? data : data.locations || []);
    } catch (error) {
      console.error('Erro ao carregar estoques', error);
    }
  };

  const handleAddStock = async (stock) => {
    try {
      const response = await axios.post(
        'https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/locations',
        stock
      );
      const newStock = response.data;
      setStocks((prev) => Array.isArray(prev) ? [...prev, newStock] : [newStock]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao criar estoque', error);
    }
  };

  const handleEditStock = async (updated) => {
    try {
      const response = await axios.put(
        `https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/locations/${updated.id}`,
        updated
      );
      const updatedStock = response.data;
      setStocks((prev) =>
        Array.isArray(prev)
          ? prev.map((s) => (s.id === updatedStock.id ? updatedStock : s))
          : [updatedStock]
      );
      setEditStock(null);
    } catch (error) {
      console.error('Erro ao atualizar estoque', error);
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(
        `https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/locations/${id}`
      );
      setStocks((prev) =>
        Array.isArray(prev) ? prev.filter((s) => s.id !== id) : []
      );
    } catch (error) {
      console.error('Erro ao excluir estoque', error);
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="content">
        <div className="stock-header">
          <h1>
            <FiArchive /> Gerenciamento de Estoques
          </h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus /> Criar Novo Estoque
          </button>
        </div>

        <div className="stocks-grid">
          {Array.isArray(stocks) &&
            stocks.map((stock) => (
              <div key={stock.id} className="stock-card">
                <div className="card-header">
                  <h3>{stock.stockName}</h3>
                  <div className="card-actions">
                    <button
                      className="btn-icon"
                      onClick={() => setEditStock(stock)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() =>
                        window.confirm('Excluir?') && handleDeleteStock(stock.id)
                      }
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="stock-info">
                    <div className="info-item">
                      <FiMapPin />
                      <span>{stock.location}</span>
                    </div>
                    <div className="info-item">
                      <strong>Capacidade:</strong> {stock.totalCapacity}
                    </div>
                  </div>
                  <p className="stock-description">{stock.description}</p>
                </div>
              </div>
            ))}
        </div>

        {(showAddModal || editStock) && (
          <StockModal
            stock={editStock}
            onClose={() => {
              setShowAddModal(false);
              setEditStock(null);
            }}
            onSave={showAddModal ? handleAddStock : handleEditStock}
          />
        )}
      </main>
    </div>
  );
};

const StockModal = ({ stock, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    stock || { stockName: '', location: '', totalCapacity: '', description: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: stock ? stock.id : undefined });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{stock ? 'Editar Estoque' : 'Novo Estoque'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Estoque</label>
            <input
              type="text"
              value={formData.stockName}
              onChange={(e) =>
                setFormData({ ...formData, stockName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Localização</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Capacidade Total</label>
            <input
              type="number"
              value={formData.totalCapacity}
              onChange={(e) =>
                setFormData({ ...formData, totalCapacity: e.target.value })
              }
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
            />
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
              {stock ? 'Salvar Alterações' : 'Criar Estoque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockManagement;
