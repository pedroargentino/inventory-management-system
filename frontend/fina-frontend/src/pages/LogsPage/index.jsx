import { FiTrash, FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navigation/Sidebar';
import axios from 'axios';

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/api/logs');
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar logs', error);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await axios.delete(`https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/api/logs/${id}`);
      setLogs(prev => prev.filter(log => log.id !== id));
    } catch (error) {
      console.error('Erro ao excluir log', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/api/logs');
      setLogs([]);
    } catch (error) {
      console.error('Erro ao excluir todos os logs', error);
    }
  };

  // Extrai tipos de ação únicos
  const actionTypes = Array.from(new Set(logs.map(log => log.action)));

  const filteredLogs = logs.filter(log => {
    const term = filterText.toLowerCase();
    const matchesText =
      log.action.toLowerCase().includes(term) ||
      log.entityName.toLowerCase().includes(term) ||
      log.performedBy.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term);
    const matchesAction = selectedAction ? log.action === selectedAction : true;
    return matchesText && matchesAction;
  });

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredLogs, totalPages, currentPage]);

  const pagedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="page-container">
      <Sidebar />
      <main className="content">
        <div className="logs-header">
          <h1>Registro de Logs</h1>
          <div className="controls">
            <div className="filter-group">
              <div className="filter-form">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Pesquisar textos..."
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                />
              </div>
              <select
                className="action-select"
                value={selectedAction}
                onChange={e => setSelectedAction(e.target.value)}
              >
                <option value="">Todas as Ações</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-danger"
              onClick={handleDeleteAll}
              disabled={!logs.length}
            >
              <FiTrash /> Limpar Tudo
            </button>
          </div>
        </div>

        <div className="logs-list">
          {pagedLogs.map(log => (
            <div key={log.id} className="log-item">
              <div className="log-info">
                <span className="log-action"><strong>Ação:</strong> {log.action}</span>
                <span className="log-entity"><strong>Entidade:</strong> {log.entityName} (ID: {log.entityId})</span>
                <span className="log-performedBy"><strong>Executado por:</strong> {log.performedBy}</span>
                <span className="log-details"><strong>Detalhes:</strong> {log.details}</span>
                <span className="log-timestamp"><strong>Data:</strong> {new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <div className="log-actions">
                <button
                  className="btn-icon danger"
                  onClick={() => handleDeleteLog(log.id)}
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
          {!filteredLogs.length && (
            <p className="empty-message">Nenhum log encontrado para o filtro.</p>
          )}
        </div>

        {/* Controles de paginação */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="page-info">
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </main>
    </div>
  );
};

export default LogPage;