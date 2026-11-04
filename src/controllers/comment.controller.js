const Comment = require('../models/Comment');

/**
 * Crea un nuevo comentario vinculado a un usuario y a un post.
 */
const createComment = async (req, res) => {
  try {
    const { text, userId, postId } = req.body;

    const newComment = await Comment.create({
      text,
      userId,
      postId,
    });

    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno del servidor al crear el comentario',
    });
  }
};

/**
 * Obtiene todos los comentarios de una publicación específica.
 * Filtra los comentarios antiguos que ya no son visibles (isVisible === false).
 */
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).populate('userId', 'nickName');
    const visibleComments = comments.filter((comment) => comment.isVisible);

    return res.status(200).json(visibleComments);
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno del servidor al obtener los comentarios',
    });
  }
};

/**
 * Actualiza el texto de un comentario (Aprovechando req.comentario).
 */
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    // Actualizamos el campo en la instancia que ya trajo el middleware
    req.comentario.text = text;
    const updatedComment = await req.comentario.save();

    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno del servidor al actualizar el comentario',
    });
  }
};

/**
 * Elimina un comentario por su ID (Aprovechando req.comentario).
 */
const deleteComment = async (req, res) => {
  try {
    // Eliminamos la instancia directamente
    await req.comentario.deleteOne();

    return res.status(200).json({
      message: 'Comentario eliminado exitosamente',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno del servidor al eliminar el comentario',
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};