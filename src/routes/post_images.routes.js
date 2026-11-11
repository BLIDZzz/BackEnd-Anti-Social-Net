const express = require('express');
const router = express.Router();

const {
    createPostImage,
    deletePostImage,
    uploadPostImage
} = require('../controllers/post_images.controller');

const validarSchema = require('../middlewares/validarSchema');
const buscarPostPorId = require('../middlewares/buscarPostPorId');
const validarReferencia = require('../middlewares/validarReferencia');
const buscarImagePost = require("../middlewares/buscarImagePost")
const subirImagen = require('../middlewares/subirImagen');

const Post = require('../models/post');
const { postImageSchema } = require('../schemas/postSchema');

// Agregar una imagen mediante una URL enviada en JSON
router.post(
    '/:id/images',
    validarReferencia(Post, 'id', 'params'),
    buscarPostPorId,
    validarSchema(postImageSchema),
    createPostImage
);

// Subir un archivo físico mediante Multer
router.post(
    '/:id/images/upload',
    buscarPostPorId,
    validarSchema(postImageSchema),
    subirImagen.single("image"),
    uploadPostImage
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