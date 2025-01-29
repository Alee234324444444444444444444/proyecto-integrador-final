import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Forum.css';

function Forum() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Comentario vacío',
        text: 'Escribe algo antes de publicar.',
      });
      return;
    }

    setComments([...comments, newComment]);
    setNewComment('');

    Swal.fire({
      icon: 'success',
      title: 'Publicado',
      text: 'Tu comentario se ha publicado exitosamente.',
    });
  };

  return (
    <section className="foro">
      <h3>Foro de Discusión</h3>
      <textarea
        className="foro-textarea"
        placeholder="Escribe un comentario..."
        rows="4"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <button className="btn-publicar" onClick={handlePostComment}>
        Publicar
      </button>

      <ul className="comentarios">
        {comments.map((comment, index) => (
          <li key={index} className="comentario-item">
            <div className="comentario-box">
              <p>{comment}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Forum;
