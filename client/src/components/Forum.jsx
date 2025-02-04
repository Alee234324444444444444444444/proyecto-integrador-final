import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Forum.css';

const BASE_URL = 'http://localhost:3000';

function Forum() {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/comments`);
        if (response.status === 200) {
          setComments(response.data);
        }
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    };
    fetchComments();
  }, []);

  const handlePostComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return;
    try {
      const response = await axios.post(`${BASE_URL}/comments`, {
        username: user.username,
        content: newComment,
      });
      if (response.status === 201) {
        setComments([...comments, response.data]);
        setNewComment('');
        Swal.fire('Éxito', 'Comentario publicado con éxito', 'success');
      }
    } catch (error) {
      console.error('Error al publicar el comentario:', error);
      Swal.fire('Error', 'No se pudo publicar el comentario', 'error');
    }
  };

  const handleDelete = async (commentId) => {
    if (!isAuthenticated) return;
    
    console.log('Intentando eliminar:', {
      url: `${BASE_URL}/comments/${commentId}`,
      userId: user.id
    });
  
    try {
      // Cambiamos la forma de hacer la petición DELETE
      const response = await axios.delete(`${BASE_URL}/comments/${commentId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: { user_id: user.id } // axios.delete espera los datos en el campo 'data'
      });
      
      if (response.status === 200) {
        setComments(comments.filter(comment => comment.id !== commentId));
        Swal.fire('Éxito', 'Comentario eliminado con éxito', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      console.log('User ID:', user.id);
      console.log('Comment ID:', commentId);
      Swal.fire('Error', 'No se pudo eliminar el comentario', 'error');
    }
  };

  const handleEdit = async (commentId) => {
    if (!isAuthenticated || !editingContent.trim()) return;

    try {
      const response = await axios.put(`${BASE_URL}/comments/${commentId}`, {
        user_id: user.id,
        content: editingContent
      });

      if (response.status === 200) {
        setComments(comments.map(comment => 
          comment.id === commentId ? { ...comment, content: editingContent } : comment
        ));
        setEditingComment(null);
        setEditingContent('');
        Swal.fire('Éxito', 'Comentario modificado con éxito', 'success');
      }
    } catch (error) {
      console.error('Error al modificar el comentario:', error);
      Swal.fire('Error', 'No se pudo modificar el comentario', 'error');
    }
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim() || !isAuthenticated) return;
    
    try {
      const response = await axios.post(`${BASE_URL}/comments`, {
        username: user.username,
        content: replyContent,
        parent_id: parentId,
      });
      
      if (response.status === 201) {
        // Actualizar comentarios incluyendo la nueva respuesta
        const updatedComments = [...comments];
        const parentCommentIndex = updatedComments.findIndex(c => c.id === parentId);
        if (parentCommentIndex !== -1) {
          if (!updatedComments[parentCommentIndex].replies) {
            updatedComments[parentCommentIndex].replies = [];
          }
          updatedComments[parentCommentIndex].replies.push(response.data);
        }
        setComments(updatedComments);
        setReplyingTo(null);
        setReplyContent('');
        Swal.fire('Éxito', 'Respuesta publicada con éxito', 'success');
      }
    } catch (error) {
      console.error('Error al responder el comentario:', error);
      Swal.fire('Error', 'No se pudo publicar la respuesta', 'error');
    }
  };

  return (
    <section className="foro">
      <h3>Foro de Discusión</h3>
      {isAuthenticated && (
        <div className="nuevo-comentario">
          <textarea
            className="foro-textarea"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn-publicar" onClick={handlePostComment}>
            Publicar
          </button>
        </div>
      )}
      <ul className="comentarios">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="comentario-item">
              <div className="comentario-box">
                <div className="comentario-header">
                  <strong>{comment.User?.username || 'Usuario Anónimo'}</strong>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                
                {editingComment === comment.id ? (
                  <div className="edit-container">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="edit-textarea"
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleEdit(comment.id)}>
                        Guardar
                      </button>
                      <button onClick={() => {
                        setEditingComment(null);
                        setEditingContent('');
                      }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}

                {isAuthenticated && (
                  <div className="comment-actions">
                    <button onClick={() => {
                      setReplyingTo(comment.id);
                      setReplyContent(`@${comment.User?.username || 'Usuario Anónimo'} `);
                    }}>
                      Responder
                    </button>
                    
                    {user && comment.User && user.username === comment.User.username && (
                      <>
                        <button onClick={() => {
                          setEditingComment(comment.id);
                          setEditingContent(comment.content);
                        }}>
                          Modificar
                        </button>
                        <button 
                          className="btn-eliminar" 
                          onClick={() => handleDelete(comment.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                )}

                {replyingTo === comment.id && (
                  <div className="reply-box">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                    />
                    <div className="reply-actions">
                      <button onClick={() => handleReply(comment.id)}>
                        Enviar Respuesta
                      </button>
                      <button onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Mostrar respuestas */}
                {comment.replies && comment.replies.length > 0 && (
                  <ul className="replies-list">
                    {comment.replies.map((reply) => (
                      <li key={reply.id} className="reply-item">
                        <strong>{reply.User?.username || 'Usuario Anónimo'}</strong>
                        <span className="reply-date">
                          {new Date(reply.created_at).toLocaleString()}
                        </span>
                        <p>{reply.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="no-comments">No hay comentarios disponibles. ¡Sé el primero en comentar!</p>
        )}
      </ul>
    </section>
  );
}

export default Forum;
