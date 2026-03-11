import { FiUser, FiLock, FiMail, FiPhone, FiHome } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const response = await axios.post('https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/users', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setError(error.response?.data?.message || 'Erro ao criar conta');
    }
  };

  return (
    <div className="login-container">
      {error && (
        <div className="error-popup">
          <div className="popup-content">
            <p>{error}</p>
            <button onClick={() => setError('')}>Fechar</button>
          </div>
        </div>
      )}

      {success && (
        <div className="success-popup">
          <div className="popup-content">
            <p>Conta criada com sucesso! Redirecionando...</p>
          </div>
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <h1>
            Criar conta no <span style={{ color: 'var(--accent)' }}>Fina</span>
          </h1>
          <p>Gerencie seu estoque doméstico de forma inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="name">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Criar conta
          </button>

          <div className="login-links">
            <span>Já tem uma conta?</span>
            <Link to="/login">Faça login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;