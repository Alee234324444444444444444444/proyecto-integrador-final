import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Importa correctamente el hook
import '../styles/Forum.css';

const BASE_URL = 'http://localhost:3000';

function Forum() {
  const { user, isAuthenticated } = useAuth();  // Corregido aquí
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Cargar los comentarios desde la base de datos al cargar el componente
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Intentando obtener comentarios...');
        const response = await axios.get(`${BASE_URL}/comments`);
        console.log('Comentarios obtenidos:', response.data);
        if (response.status === 200) {
          setComments(response.data);
        } else {
          throw new Error(`Error al cargar los comentarios: Status ${response.status}`);
        }
      } catch (error) {
        console.error('Error al cargar los comentarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar comentarios',
          text: `Hubo un problema al cargar los comentarios. ${error.response ? `Código de error: ${error.response.status} - ${error.response.statusText}` : error.message}`,
          footer: '<strong>Posibles soluciones:</strong><br>- Verifica tu conexión a internet.<br>- Intenta refrescar la página.<br>- Si el problema persiste, contacta al administrador.',
        });
      }
    };

    fetchComments();
  }, []);

  // Manejar la publicación de un nuevo comentario
  const handlePostComment = async () => {
    console.log('Intentando publicar un nuevo comentario...', newComment);

    if (!newComment.trim()) {
      console.log('Comentario vacío, no se puede publicar.');
      Swal.fire({
        icon: 'error',
        title: 'Comentario vacío',
        text: 'Escribe algo antes de publicar. El campo no puede estar vacío.',
        footer: '<strong>Solución:</strong><br>- Asegúrate de que el campo de comentario no esté vacío.',
      });
      return;
    }

    if (!isAuthenticated) {
      console.log('Usuario no autenticado.');
      Swal.fire({
        icon: 'error',
        title: 'No autenticado',
        text: 'Debes iniciar sesión para publicar un comentario. Por favor, inicia sesión primero.',
        footer: '<strong>Solución:</strong><br>- Haz clic en el botón de inicio de sesión y accede a tu cuenta.',
      });
      return;
    }

    try {
      console.log('Enviando el comentario a la API...');
      const response = await axios.post(`${BASE_URL}/comments`, {  // Cambié la URL a '/comments'
        username: user.username, // Nombre del usuario
        content: newComment,
      });

      if (response.status === 201) {
        console.log('Comentario publicado con éxito:', response.data);
        // Añadir el nuevo comentario a la lista de comentarios
        setComments((prevComments) => [...prevComments, response.data]);

        // Limpiar el campo de texto
        setNewComment('');

        Swal.fire({
          icon: 'success',
          title: 'Comentario publicado',
          text: 'Tu comentario se ha publicado exitosamente.',
        });
      } else {
        console.error(`Error al publicar el comentario: Status ${response.status}`);
        throw new Error(`Error al publicar el comentario: Status ${response.status}`);
      }
    } catch (error) {
      console.error('Error al publicar el comentario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al publicar comentario',
        text: `Hubo un problema al publicar tu comentario. ${error.response ? `Código de error: ${error.response.status} - ${error.response.statusText}` : error.message}`,
        footer: '<strong>Posibles soluciones:</strong><br>- Verifica que el contenido del comentario sea válido.<br>- Intenta nuevamente.<br>- Si el error persiste, contacta al soporte.',
      });
    }
  };

  return (
    <section className="foro">
      <h3>Foro de Discusión</h3>
      {isAuthenticated ? (
        <>
          <textarea
            className="foro-textarea"
            placeholder="Escribe un comentario..."
            rows="4"
            value={newComment}
            onChange={(e) => {
              console.log('Cambio en el comentario:', e.target.value);
              setNewComment(e.target.value);
            }}
          ></textarea>
          <button className="btn-publicar" onClick={handlePostComment}>
            Publicar
          </button>
        </>
      ) : (
        <p>Debes iniciar sesión para comentar.</p>
      )}

      <ul className="comentarios">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="comentario-item">
              <div className="comentario-box">
                <p>
                  <strong>{comment.User?.username || 'Usuario Anónimo'}</strong>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </p>
                <p className="comment-content">{comment.content}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No hay comentarios disponibles. Sé el primero en comentar.</p>
        )}
      </ul>
    </section>
  );
}

export default Forum;
