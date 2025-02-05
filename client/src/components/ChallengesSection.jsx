import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import '../styles/ChallengesSection.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);  // Estado para almacenar los desafíos
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/challenges'); // Solicitud al backend
      setChallenges(response.data); // Guardar los desafíos en el estado
    } catch (error) {
      console.error('Error al obtener desafíos:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="challenges-container">
      <h2>Desafíos</h2>
      <ul>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <li key={challenge.id}>
              {challenge.title} - {challenge.type}
              <button className="challenges-container-btn" onClick={openModal}>
                Completar
              </button>
            </li>
          ))
        ) : (
          <p>No hay desafíos disponibles</p>
        )}
      </ul>

      {/* Modal con la lógica para abrirlo y cerrarlo */}
      <Modal showModal={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default Challenges;
