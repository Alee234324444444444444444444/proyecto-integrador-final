import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const ReportTable = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/reportes`)
      .then(response => {
        console.log('Datos recibidos:', response.data); // Verifica los datos en consola
        setReports(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los reportes:', error);
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
        }
      });
  }, []);

  return (
    <div>
      <h2>Reporte de Comentarios</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Total Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map(report => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.name}</td>
                <td>{report.total_comments}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
