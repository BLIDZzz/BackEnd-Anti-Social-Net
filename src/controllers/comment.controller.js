const Comment = require('../models/comment');

const createComment = async (req, res) => {
  try {
    const { text, user, post } = req.body;
    const newComment = await Comment.create({ text, user, post });
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al crear el comentario' });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('user', 'nickName');
    const visibleComments = comments.filter((comment) => comment.isVisible);
    return res.status(200).json(visibleComments);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al obtener los comentarios' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    req.comentario.text = text;
    const updatedComment = await req.comentario.save();
    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al actualizar el comentario' });
  }
};

const deleteComment = async (req, res) => {
  try {
    await req.comentario.deleteOne();
    return res.status(200).json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al eliminar el comentario' });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};