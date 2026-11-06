const Joi = require('joi');

const tagSchema = Joi.object({
    name: Joi.string().required().trim()
});

module.exports = tagSchema;