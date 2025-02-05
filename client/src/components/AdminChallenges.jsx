import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminChallenges = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'daily', due_date: '' });

  useEffect(() => {
    if (!isAuthenticated || !user?.isSuperuser) {
      navigate('/'); // Redirigir si no es superuser
    }
    fetchChallenges();
  }, [isAuthenticated, user]);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/api/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Error al obtener desafíos', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/challenges/add', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchChallenges(); // Recargar los desafíos
      setFormData({ title: '', description: '', type: 'daily', due_date: '' });
    } catch (error) {
      console.error('Error al crear desafío', error);
      alert('No se pudo crear el desafío');
    }
  };
  

  return (
    <div>
      <h2>Administrar Desafíos</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        <textarea placeholder="Descripción" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
        </select>
        <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
        <button type="submit">Añadir Desafío</button>
      </form>

      <h3>Lista de Desafíos</h3>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>{challenge.title} - {challenge.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminChallenges;
