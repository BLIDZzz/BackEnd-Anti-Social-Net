const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require('../controllers/comment.controller');

// Middlewares
const validarSchema = require('../middlewares/validarSchema');
const validarObjectId = require('../middlewares/validarObjectId');
const buscarComentarioPorId = require('../middlewares/buscarComentarioPorId');
const {
  createCommentSchema,
  updateCommentSchema,
} = require('../schemas/comment.schema');

// 📌 POST /comments -> Crear comentario
router.post(
  '/',
  validarSchema(createCommentSchema),
  createComment
);

// 📌 GET /comments/post/:postId -> Obtener comentarios de un post
router.get(
  '/post/:postId',
  validarObjectId('postId'),
  getCommentsByPost
);

// 📌 PUT /comments/:id -> Actualizar comentario
router.put(
  '/:id',
  validarObjectId('id'),
  buscarComentarioPorId,
  validarSchema(updateCommentSchema),
  updateComment
);

// 📌 DELETE /comments/:id -> Eliminar comentario
router.delete(
  '/:id',
  validarObjectId('id'),
  buscarComentarioPorId,
  deleteComment
);

module.exports = router;