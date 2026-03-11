import { FiUser, FiSettings, FiBell, FiLock, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import Sidebar from '../components/Navigation/Sidebar';

const Settings = () => {
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    avatar: ''
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'pt-BR',
    notifications: {
      email: true,
      app: true,
      reminders: false
    }
  });

  const handleSave = (section) => {
    alert(`Configurações de ${section} salvas!`);
  };

  const handleDeleteAccount = () => {
    alert('Conta excluída com sucesso!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({...userData, avatar: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="content">
        <h1 className="page-title"><FiSettings /> Configurações</h1>

        {/* Perfil do Usio */}
        <div className="settings-section">
          <div className="section-header">
            <h2><FiUser /> Perfil</h2>
            <button
              className="btn btn-primary"
              onClick={() => handleSave('perfil')}
            >
              Salvar Alterações
            </button>
          </div>

          <div className="settings-content">
            <div className="avatar-upload">
              <div className="avatar-preview">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {userData.name[0]}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarUpload}
                hidden
              />
              <label htmlFor="avatar" className="btn btn-outline">
                Alterar Foto
              </label>
            </div>

            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {}
        <div className="settings-section">
          <div className="section-header">
            <h2><FiSettings /> Preferências</h2>
            <button
              className="btn btn-primary"
              onClick={() => handleSave('preferências')}
            >
              Salvar
            </button>
          </div>

          <div className="settings-content grid-col-2">
            <div className="form-group">
              <label>Tema</label>
              <div className="theme-switch">
                <button
                  type="button" // Adicionado type para prevenir submit
                  className={`theme-option ${!preferences.darkMode ? 'active' : ''}`}
                  onClick={() => setPreferences({...preferences, darkMode: false})}
                >
                  Claro
                </button>
                <button
                  type="button" // Adicionado type para prevenir submit
                  className={`theme-option ${preferences.darkMode ? 'active' : ''}`}
                  onClick={() => setPreferences({...preferences, darkMode: true})}
                >
                  Escuro
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Idioma</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (EUA)</option>
                <option value="es-ES">Español (España)</option>
              </select>
            </div>

            <div className="form-group">
              <label><FiBell /> Notificações</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, email: e.target.checked}
                    })}
                  />
                  Notificações por Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.app}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, app: e.target.checked}
                    })}
                  />
                  Notificações no App
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.reminders}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, reminders: e.target.checked}
                    })}
                  />
                  Lembretes Automáticos
                </label>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <h2><FiLock /> Segurança</h2>
          </div>

          <div className="settings-content">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => alert('Funcionalidade em desenvolvimento')}
            >
              <FiLock /> Alterar Senha
            </button>

            <div className="danger-actions">
              <h3><FiTrash2 /> Zona de Perigo</h3>
              <div className="danger-content">
                <p>Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e todos os dados associados.</p>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    if(window.confirm('Tem certeza que deseja excluir sua conta permanentemente?')) {
                      handleDeleteAccount();
                    }
                  }}
                >
                  Excluir Conta Permanentemente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;