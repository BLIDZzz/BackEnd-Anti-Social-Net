const Joi = require('joi');

const userSchema = Joi.object({
    nickName: Joi.string().min(3).required().trim()
});

module.exports = userSchema;