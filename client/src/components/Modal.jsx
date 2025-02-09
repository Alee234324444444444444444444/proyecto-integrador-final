import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Modal.css';

function Modal({ showModal, closeModal, challengeId }) {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para completar desafíos');
      return;
    }

    if (!photo || !description.trim()) {
      setError('Debes completar todos los campos.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('description', description);
      formData.append('challenge_id', challengeId);
      formData.append('user_id', user.id);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        alert('¡Desafío completado! Tu publicación será revisada.');
        setPhoto(null);
        setDescription('');
        closeModal();
      }
    } catch (error) {
      console.error('Error al enviar el post:', error);
      setError(error.response?.data?.message || 'Error al enviar la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 style={{ textAlign: 'center' }}>Vamos a completar el desafío!</h2>
        <p>Sube una foto para demostrarlo.</p>

        {error && <p className="error-message" style={{ color: '#ff6b6b' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
          />
          <textarea
            name="description"
            placeholder="Describe cómo completaste el desafío"
            rows="4"
            maxLength="75"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <div className="modal-buttons">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading || !isAuthenticated}
            >
              {loading ? 'Enviando...' : 'Subir Publicación'}
            </button>
            <button 
              type="button" 
              className="btn-close" 
              onClick={closeModal}
              disabled={loading}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;