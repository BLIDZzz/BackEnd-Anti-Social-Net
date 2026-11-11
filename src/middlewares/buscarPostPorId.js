const mongoose = require('mongoose');
const Post = require('../models/post');

const buscarPostPorId = async (req, res, next) => {
    try {
        // Obtener el ID, independientemente del nombre del parámetro
        const id = req.params.id || req.params.postId;

        // Comprobar que el ID tenga un formato válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'El ID de la publicación no tiene un formato válido'
            });
        }

        // Buscar la publicación en MongoDB
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            });
        }

        // Guardar la publicación para utilizarla en otros middlewares y controladores
        req.post = post;

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = buscarPostPorId;