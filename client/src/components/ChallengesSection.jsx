import React, { useState, useEffect } from 'react';
import '../styles/ChallengesSection.css';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

function ChallengesSection() {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', type: '', due_date: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/challenges')
      .then((res) => res.json())
      .then(setChallenges)
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    setNewChallenge({
      ...newChallenge,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddChallenge = async (e) => {
    e.preventDefault();
    if (!user?.is_superuser) {
      Swal.fire('Permiso denegado', 'Solo administradores pueden agregar desafíos', 'error');
      return;
    }
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newChallenge),
      });
      if (!response.ok) throw new Error('Error al crear desafío');
      const newChallengeData = await response.json();
      setChallenges([...challenges, newChallengeData]);
      Swal.fire('Desafío agregado', 'El desafío fue agregado correctamente', 'success');
      setNewChallenge({ title: '', description: '', type: '', due_date: '' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear el desafío', 'error');
    }
  };

  return (
    <div className="challenges-section">
      <h2>Desafíos</h2>
      <ul className="challenge-list">
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <span>Tipo: {challenge.type} - Fecha límite: {challenge.due_date}</span>
          </li>
        ))}
      </ul>
      {user?.is_superuser && (
        <form onSubmit={handleAddChallenge}>
          <h3>Agregar Desafío</h3>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={newChallenge.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={newChallenge.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <input
            type="text"
            name="type"
            placeholder="Tipo (daily/weekly)"
            value={newChallenge.type}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="due_date"
            value={newChallenge.due_date}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Agregar Desafío</button>
        </form>
      )}
    </div>
  );
}

export default ChallengesSection;
