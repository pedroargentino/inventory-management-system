import { FiUser, FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/users/login', formData);
     // const token = response.data.token;

      //localStorage.setItem('token', token);
      navigate('/home');
    } catch (err) {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bem-vindo ao <span style={{ color: 'var(--accent)' }}>Fina</span></h1>
          <p>Gerencie seu estoque doméstico de forma inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">
              <FiUser className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block">
            Entrar
          </button>

          <div className="login-links">
            <Link to="/forgot-password">Esqueceu a senha?</Link>
            <span>•</span>
            <Link to="/register">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
