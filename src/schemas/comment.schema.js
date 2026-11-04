const Joi = require('joi');

// Expresión regular para validar formato ObjectId de MongoDB (24 caracteres hexadecimales)
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Esquema para la creación de un comentario
const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).required().messages({
    'string.empty': 'El texto del comentario es obligatorio',
    'string.min': 'El texto del comentario debe tener al menos 1 carácter',
    'any.required': 'El texto del comentario es obligatorio',
  }),
  userId: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'El userId debe ser un ObjectId de MongoDB válido (24 caracteres hexadecimales)',
    'any.required': 'El userId es obligatorio',
  }),
  postId: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'El postId debe ser un ObjectId de MongoDB válido (24 caracteres hexadecimales)',
    'any.required': 'El postId es obligatorio',
  }),
});

// Esquema para la actualización del texto de un comentario
const updateCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).required().messages({
    'string.empty': 'El texto del comentario no puede estar vacío',
    'string.min': 'El texto del comentario debe tener al menos 1 carácter',
    'any.required': 'El texto del comentario es obligatorio',
  }),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
};