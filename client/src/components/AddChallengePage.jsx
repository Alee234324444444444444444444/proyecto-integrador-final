import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

function AddChallengePage() {
  const { user } = useAuth();
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', type: '', due_date: '' });

  if (!user?.is_superuser) {
    return <h2>Acceso denegado: Solo administradores pueden acceder.</h2>;
  }

  const handleInputChange = (e) => {
    setNewChallenge({
      ...newChallenge,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddChallenge = async (e) => {
    e.preventDefault();
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

      Swal.fire('Desafío agregado', 'El desafío fue agregado correctamente', 'success');
      setNewChallenge({ title: '', description: '', type: '', due_date: '' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear el desafío', 'error');
    }
  };

  return (
    <div>
      <h1>Agregar Nuevo Desafío</h1>
      <form onSubmit={handleAddChallenge}>
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
    </div>
  );
}

export default AddChallengePage;
    