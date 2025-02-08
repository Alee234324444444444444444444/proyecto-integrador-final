import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import '../styles/ChallengesSection.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  
  // Obtener el usuario desde localStorage correctamente
  const user = JSON.parse(localStorage.getItem('user')); 
  const userId = user ? user.id : null; // Extraer el ID del usuario
  
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Error al obtener desafíos:', error);
    }
  };

  const openModal = (challengeId) => {
    setSelectedChallenge(challengeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <div className="challenges-container">
      <h2>Desafíos</h2>
      <ul>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <li key={challenge.id}>
              {challenge.title} - {challenge.description}
              <button 
                className="challenges-container-btn" 
                onClick={() => openModal(challenge.id)}
              >
                Completar
              </button>
            </li>
          ))
        ) : (
          <p>No hay desafíos disponibles</p>
        )}
      </ul>

      <Modal 
        showModal={isModalOpen} 
        closeModal={closeModal} 
        userId={userId} // Pasar userId correctamente
        challengeId={selectedChallenge}
      />
    </div>
  );
};

export default Challenges;
