import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/perfil.css';

function Perfil() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [user, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay token disponible. Inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      console.log("Token enviado desde el frontend:", token);

      const response = await axios.get('http://localhost:3000/api/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta del backend:", response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);

      if (error.response) {
        setError(error.response.data.message || 'Error al cargar el perfil');
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;
  if (!userProfile) return <p>No se encontró el usuario.</p>;

  const {
    full_name,
    username,
    email,
    character_name,
    total_posts,
    total_comments,
    total_challenges,
    rewards_earned
  } = userProfile;

  return (
    <div className="perfil-container ranking-container">
      <h1>{full_name}</h1>
      <p><strong>Usuario:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Personaje:</strong> {character_name || 'No asignado'}</p>
      
      <h2>Estadísticas</h2>
      <p><strong>Total de publicaciones:</strong> {total_posts || 0}</p>
      <p><strong>Total de comentarios:</strong> {total_comments || 0}</p>
      <p><strong>Total de retos:</strong> {total_challenges || 0}</p>
      <p><strong>Recompensas equipadas:</strong> {rewards_earned || 'Ninguna'}</p>
    </div>
  );
}

export default Perfil;
