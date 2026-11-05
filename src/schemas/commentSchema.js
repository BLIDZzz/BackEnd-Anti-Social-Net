const Joi = require('joi');

const commentSchema = Joi.object({
    text: Joi.string().required().trim(),
    user: Joi.string().hex().length(24).required(),
    post: Joi.string().hex().length(24).required()
});

module.exports = commentSchema;