import React, { useState }from 'react';
import Modal from './Modal';
import '../styles/ChallengesSection.css';

const Challenges = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <li>
                  Desafío 1
                  <button className="challenges-container-btn" onClick={openModal}>
                      Completar
                  </button>
              </li>
              {/* Otros desafíos */}
          </ul>

          {/* Modal con la lógica para abrirlo y cerrarlo */}
          <Modal showModal={isModalOpen} closeModal={closeModal} />
      </div>
  );
};

export default Challenges;