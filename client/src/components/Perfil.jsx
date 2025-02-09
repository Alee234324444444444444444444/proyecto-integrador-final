import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/perfil.css';

const BASE_URL = 'http://localhost:3000';

function Perfil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener el perfil del usuario desde la API
        axios.get(`${BASE_URL}/perfil`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setUser(response.data[0]);  // Guardar el primer objeto del arreglo en el estado
                } else {
                    setError('No se encontraron datos de perfil');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Error al cargar el perfil');
                setLoading(false);
            });
    }, []); // Solo se ejecuta una vez, al montar el componente

    // Manejo de carga y error
    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>{error}</p>;

    // Verificar si 'user' existe antes de acceder a sus propiedades
    if (!user) {
        return <p>No se encontró el usuario.</p>;
    }

    // Desestructuración de los datos de 'user' para usarlos más fácilmente
    const {
        full_name,
        username,
        email,
        character_name,
        total_posts,
        total_comments,
        total_challenges,
        rewards_earned
    } = user;

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
            <p><strong>Recompensas obtenidas:</strong> {rewards_earned || 'Ninguna'}</p>
        </div>
    );
}

export default Perfil;
