const express = require('express');
const router = express.Router();

const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/post.controller');

const validarSchema = require('../middlewares/validarSchema');
const validarReferencia = require('../middlewares/validarReferencia');
const buscarPostPorId = require('../middlewares/buscarPostPorId');

const User = require('../models/user');
const { createPostSchema, updatePostSchema } = require('../schemas/postSchema');

// Obtener todas las publicaciones
router.get('/', getAllPosts);

// Obtener una publicacion por ID
router.get(
    '/:id',
    validarReferencia(require('../models/post'), 'id', 'params'),
    buscarPostPorId,
    getPostById
);

// Crear una publicacion
router.post(
    '/',
    validarSchema(createPostSchema),
    validarReferencia(User, 'user'),
    createPost
);

// Actualizar una publicacion
router.put(
    '/:id',
    validarReferencia(require('../models/post'), 'id', 'params'),
    buscarPostPorId,
    validarSchema(updatePostSchema),
    updatePost
);

// Eliminar una publicacion
router.delete(
    '/:id',
    validarReferencia(require('../models/post'), 'id', 'params'),
    buscarPostPorId,
    deletePost
);

module.exports = router;