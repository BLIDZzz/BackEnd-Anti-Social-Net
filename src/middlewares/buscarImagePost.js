const mongoose = require('mongoose');

const buscarImagenPost = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(imageId)) {
            return res.status(400).json({
                message: 'El identificador de la imagen no tiene un formato válido.'
            });
        }

        // Buscar la imagen dentro de la publicación
        const imagen = req.post.images.id(imageId);

        if (!imagen) {
            return res.status(404).json({
                message: 'Imagen no encontrada'
            });
        }

        req.imagen = imagen;

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al buscar la imagen'
        });
    }
};

module.exports = buscarImagenPost;