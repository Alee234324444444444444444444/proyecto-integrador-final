import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/Modal.css';

const API_URL = 'http://localhost:3000'; // Asegúrate de que esté correcto

function Modal({ showModal, closeModal, userId, challengeId }) {
  const [formData, setFormData] = useState({
    photo: null,
    description: ''
  });
  const [error, setError] = useState('');

  // Verifica si `userId` y `challengeId` están siendo pasados correctamente
  console.log('userId:', userId, 'challengeId:', challengeId);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { photo, description } = formData;

    if (!photo || !description.trim()) {
      setError('Debes completar todos los campos.');
      return;
    }

    const postData = new FormData();
    postData.append('photo', photo);
    postData.append('description', description);
    postData.append('user_id', userId); // Asegúrate de pasar el `userId` correctamente
    postData.append('challenge_id', challengeId); // Asegúrate de pasar el `challengeId` correctamente
    postData.append('created_at', new Date());

    try {
      const response = await axios.post(`${API_URL}/modaldate`, postData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: '¡Desafío completado enviado exitosamente!',
          showConfirmButton: false,
          timer: 1500
        });
        closeModal();
      }
    } catch (err) {
      setError('Error al enviar el desafío. Por favor intenta de nuevo.');
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el desafío. Intenta nuevamente.',
      });
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>¡Felicidades por completar el desafío!</h2>
        <p>Sube una foto para demostrar que has completado el desafío.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Describe cómo completaste el desafío"
            rows="4"
            maxLength="75"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <div className="modal-buttons">
            <button type="submit" className="btn-submit">Subir Publicación</button>
            <button type="button" className="btn-close" onClick={closeModal}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
