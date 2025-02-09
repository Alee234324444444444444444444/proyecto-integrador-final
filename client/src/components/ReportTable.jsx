import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ReportTable.css';  

const BASE = 'http://localhost:3000';  // Cambia esto según tu URL base

const Reports = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Hacer una solicitud GET para obtener los datos del perfil
    axios.get(`${BASE}/reports`)
      .then(response => {
        console.log('Datos del ranking:', response.data); // Verifica los datos recibidos
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos del ranking:', error);
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
        }
      });
  }, []);

  return (
    <div className='ranking-container'>
      <h2>Ranking de Comentarios</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th><strong>Usuario</strong></th>
            <th><strong>Nombre</strong></th>
            <th><strong>Username</strong></th>
            <th><strong>Email</strong></th>
            <th><strong>Comentarios Totales</strong></th>
            <th><strong>Respuestas Totales</strong></th>
            <th><strong>Últimos Comentarios</strong></th>
            
          </tr>
        </thead>
        <tbody>
          {userData.length > 0 ? (
            userData.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.total_comments}</td>
                <td>{user.total_responses}</td>
                <td>{user.last_three_comments}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;