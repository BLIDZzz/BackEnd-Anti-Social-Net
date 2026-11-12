const Joi = require('joi');

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).required().messages({
    'string.empty': 'El texto del comentario es obligatorio',
    'any.required': 'El texto del comentario es obligatorio',
  }),
  user: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'El user debe ser un ObjectId de MongoDB válido',
    'any.required': 'El user es obligatorio',
  }),
  post: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'El post debe ser un ObjectId de MongoDB válido',
    'any.required': 'El post es obligatorio',
  }),
});

const updateCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).required().messages({
    'string.empty': 'El texto del comentario no puede estar vacío',
    'any.required': 'El texto del comentario es obligatorio',
  }),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
};