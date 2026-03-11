// src/components/Navigation/SidebarWrapper.jsx
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const SidebarWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FiMenu />
      </button>

      {isSidebarOpen && (
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      )}

      <div className="content-area main-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarWrapper;
