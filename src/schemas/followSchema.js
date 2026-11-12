const Joi = require('joi');

const followSchema = Joi.object({
    followerId: Joi.string().required().trim()
});

module.exports = followSchema;