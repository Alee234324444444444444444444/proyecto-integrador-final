import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import logo from '../assets/logo.jpg';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/publicaciones">Publicaciones</Link></li>
        {isAuthenticated && user?.isSuperuser && (
        <li><Link to="/admin/challenges">Admin Desafíos</Link></li>
        )}
        <li><Link to="/challenges">Desafíos</Link></li>
      </ul>
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <span className="welcome-message">Hola, {user?.username}</span>
            <button onClick={handleLogout} className="login-btn">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;