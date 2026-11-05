const Joi = require('joi');

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

module.exports = postSchema;