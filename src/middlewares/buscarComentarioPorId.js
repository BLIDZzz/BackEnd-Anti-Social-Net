const Comment = require('../models/comment');

/**
 * Middleware para buscar un comentario por su ID e inyectarlo en req.comentario.
 */
const buscarComentarioPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comentario = await Comment.findById(id);

    if (!comentario) {
      return res.status(404).json({
        message: 'Comentario no encontrado',
      });
    }

    // Inyectar el comentario encontrado en el objeto de la petición
    req.comentario = comentario;
    next();
  } catch (error) {
     return res.status(500).json({
      message: 'Error interno del servidor al buscar el comentario',
    });
  }
};

module.exports = buscarComentarioPorId;