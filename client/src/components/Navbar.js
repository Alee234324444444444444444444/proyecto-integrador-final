import React from 'react';
import '../styles/Navbar.css'; 
import logo from '../assets/logo.jpg';


function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="#" className="logo">
          <img src={logo} alt="logo" className="logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/publicaciones">Publicaciones</a></li>
        <li><a href="#challenges">Desafíos</a></li>
      </ul>
      <div className="navbar-actions">
        <a className="login-btn" href="/login">Iniciar Sesión</a>
      </div>
    </nav>
  );
}

export default Navbar;
