import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    try {
      // Solo enviamos los campos que coinciden con el modelo
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await axios.post('http://localhost:3000/api/auth/register', userData);

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Ya puedes iniciar sesión'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: error.response?.data?.message || 'Error al registrar usuario'
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name"><big>Nombre Completo:</big></label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div className="input-group">
            <label htmlFor="username"><big>Nombre de Usuario:</big></label>
            <input
              type="text"
              name="username"
              id="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Elige un nombre de usuario"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email"><big>Correo Electrónico:</big></label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password"><big>Contraseña:</big></label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword"><big>Confirmar Contraseña:</big></label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
            />
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn">
              <strong>Registrarse</strong>
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/login')}
            >
              <strong>Cancelar</strong>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;