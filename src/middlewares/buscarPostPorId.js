const Post = require('../models/post');

const buscarPostPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            });
        }

        req.post = post;

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al buscar la publicación'
        });
    }
};

module.exports = buscarPostPorId;