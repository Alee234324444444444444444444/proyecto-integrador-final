import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ReportTable.css';

const BASE = 'http://localhost:3000';

const Reports = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE}/reports`);
        const formattedData = response.data.map(user => ({
          ...user,
          // Asegurarse de que last_three_comments sea legible
          last_three_comments: Array.isArray(user.last_three_comments) 
            ? user.last_three_comments.join('\n') 
            : user.last_three_comments
        }));
        setUserData(formattedData);
      } catch (error) {
        console.error('Error al obtener los datos del ranking:', error);
        setError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="ranking-container">
        <h2>Ranking de Comentarios</h2>
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-container">
        <h2>Ranking de Comentarios</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className='ranking-container'>
      <h2>Ranking de Comentarios</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Username</th>
            <th>Email</th>
            <th>Comentarios</th>
            <th>Respuestas</th>
            <th>Últimos Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {userData.length > 0 ? (
            userData.map(user => (
              <tr key={user.id}>
                <td data-label="Usuario">{user.id}</td>
                <td data-label="Nombre">{user.name || 'N/A'}</td>
                <td data-label="Username">{user.username || 'N/A'}</td>
                <td data-label="Email">{user.email || 'N/A'}</td>
                <td data-label="Comentarios">{user.total_comments || '0'}</td>
                <td data-label="Respuestas">{user.total_responses || '0'}</td>
                <td data-label="Últimos Comentarios">
                  {user.last_three_comments || 'Sin comentarios recientes'}
                </td>
              </tr>
            ))
          ) : (
            <tr className="empty-row">
              <td colSpan="7">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;