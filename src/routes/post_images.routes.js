const express = require('express');
const router = express.Router();

const {
    createPostImage,
    deletePostImage
} = require('../controllers/post_images.controller');

const validarSchema = require('../middlewares/validarSchema');
const buscarPostPorId = require('../middlewares/buscarPostPorId');
const validarReferencia = require('../middlewares/validarReferencia');
const buscarImagePost = require("../middlewares/buscarImagePost")

const Post = require('../models/post');
const { postImageSchema } = require('../schemas/post_images.schema');

// Agregar una imagen a una publicación
router.post(
    '/:id/images',
    validarReferencia(Post, 'id', 'params'),
    buscarPostPorId,
    validarSchema(postImageSchema),
    createPostImage
);

// Eliminar una imagen de una publicación
router.delete(
    '/:id/images/:imageId',
    validarReferencia(Post, 'id', 'params'),
    buscarPostPorId,
    buscarImagePost,
    deletePostImage
);

module.exports = router;