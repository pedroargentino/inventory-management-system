// src/components/Navigation/Sidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiBook,
  FiSettings,
  FiLogOut,
  FiPlusCircle,
  FiList,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useState } from 'react';
import RegisterModal from './RegisterModal';

const Sidebar = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          backgroundColor: '#1a202c',
          color: 'white',
          border: 'none',
          fontSize: '1.5rem',
          zIndex: 110,
          padding: '8px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <FiMenu />
      </button>

      <div style={{ display: 'flex' }}>
        <nav
          className="sidebar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: isSidebarOpen ? '240px' : '0',
            height: '100vh',
            backgroundColor: '#1a202c',
            color: 'white',
            overflowX: 'hidden',
            transition: 'width 0.3s ease',
            zIndex: 100,
            padding: isSidebarOpen ? '1rem' : '0'
          }}
        >
          {isSidebarOpen && (
            <>
              <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  className="close-sidebar"
                  onClick={() => setIsSidebarOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <FiX />
                </button>
              </div>

              <ul className="sidebar-menu" style={{ listStyle: 'none', padding: 0, marginTop: '2rem' }}>
                <li style={{ marginBottom: '1rem' }}><Link to="/home" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><FiHome /> Visão Geral</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/inventory" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><FiPackage /> Produtos no Estoque</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/shopping-list" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><FiShoppingCart /> Lista de Compras</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/stock-management" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><FiPackage /> Gerenciar Estoques</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/logs" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}><FiList /> Logs</Link></li>
              </ul>

              <div className="sidebar-footer" style={{ position: 'absolute', bottom: '1rem', width: '80%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn-register"
                  onClick={() => setShowRegisterModal(true)}
                  style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <FiPlusCircle /> Registrar Baixa
                </button>

                <button
                  className="btn-logout"
                  onClick={handleLogout}
                  style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <FiLogOut /> Sair
                </button>
              </div>
            </>
          )}
        </nav>

        <div
          className="main-content"
          style={{
            marginLeft: isSidebarOpen ? '240px' : '0',
            width: '100%',
            transition: 'margin-left 0.3s ease'
          }}
        >
          {showRegisterModal && (
            <RegisterModal onClose={() => setShowRegisterModal(false)} />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
