const Joi = require('joi');

// Validar los datos para crear una publicacion
const postSchema = Joi.object({
    description: Joi.string().required().trim(),
    user: Joi.string().required().trim(),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().required().trim()
        })
    ),
    tags: Joi.array().items(
        Joi.string().hex().length(24)
    )
});

// Validar los datos para agregar una imagen a una publicacion
const postImageSchema = Joi.object({
    url: Joi.string().required().trim()
});

// Validar descripción del nuevo post
const updatePostSchema = Joi.object({
    description: Joi.string().required().trim(),
});

module.exports = {
    postSchema,
    postImageSchema,
    updatePostSchema
};