const Joi = require('joi');

const userSchema = Joi.object({
    nickName: Joi.string().required().trim()
});

module.exports = userSchema;