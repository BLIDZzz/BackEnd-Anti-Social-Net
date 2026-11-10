const Post = require('../models/post');

// Agregar una imagen a una publicacion
const createPostImage = async (req, res) => {
    try {
        const { url } = req.body;

        // Agregar la imagen al array images de la publicación
        req.post.images.push({ url });

        await req.post.save();

        // Obtener la imagen recién agregada
        const imagen = req.post.images[req.post.images.length - 1];

        return res.status(201).json(imagen);
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar una imagen de una publicacion
const deletePostImage = async (req, res) => {
    try {
        const { imageId } = req.params;

        // Buscar la imagen dentro de la publicacion
        const imagen = req.post.images.id(imageId);

        if (!imagen) {
            return res.status(404).json({
                message: 'Imagen no encontrada'
            });
        }

        // Eliminar la imagen del array
        imagen.deleteOne();

        await req.post.save();

        return res.status(200).json({
            message: 'La imagen fue eliminada correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    createPostImage,
    deletePostImage
};