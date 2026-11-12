const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require('../controllers/comment.controller');

const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const validarSchema = require('../middlewares/validarSchema');
const validarReferencia = require('../middlewares/validarReferencia');
const buscarComentarioPorId = require('../middlewares/buscarComentarioPorId');
const { createCommentSchema, updateCommentSchema } = require('../schemas/comment.schema');

// 📌 POST /comments
router.post(
  '/',
  validarSchema(createCommentSchema),
  validarReferencia(User, 'user'),
  validarReferencia(Post, 'post'),
  createComment
);

// 📌 GET /comments/post/:postId
router.get(
  '/post/:postId',
  validarReferencia(Post, 'postId', 'params'),
  getCommentsByPost
);

// 📌 PUT /comments/:id
router.put(
  '/:id',
  validarReferencia(Comment, 'id', 'params'),
  buscarComentarioPorId,
  validarSchema(updateCommentSchema),
  updateComment
);

// 📌 DELETE /comments/:id
router.delete(
  '/:id',
  validarReferencia(Comment, 'id', 'params'),
  buscarComentarioPorId,
  deleteComment
);

module.exports = router;