const mongoose = require('mongoose');

/**
 * Middleware de orden superior para validar que un parámetro de la URL sea un ObjectId válido de Mongoose.
 * @param {string} paramName - Nombre del parámetro en req.params (ej. 'id', 'postId')
 */
const validarObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: `El parámetro '${paramName}' no es un ObjectId válido de MongoDB`,
      });
    }

    next();
  };
};

module.exports = validarObjectId;