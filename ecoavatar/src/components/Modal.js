import React, { useState } from 'react';
import '../styles/Modal.css';

function Modal({ showModal, closeModal }) {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!photo || !description.trim()) {
      alert('Debes completar todos los campos.');
      return;
    }
    alert('Desafío completado enviado exitosamente.');
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 style={{ textAlign: 'center' }}>¡Felicidades por completar el desafío!</h2>
        <p>Sube una foto para demostrar que has completado el desafío.</p>

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
            <button type="submit" className="btn-submit">Subir Publicación</button>
            <button type="button" className="btn-close" onClick={closeModal}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
