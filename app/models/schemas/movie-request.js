const Joi = require('joi');

module.exports = Joi.object().keys({
	year: Joi.number().integer().required(),
	title: Joi.string().required(),
	studios: Joi.string().required(),
	producers: Joi.array().items(Joi.string()).required(),
	winner: Joi.boolean().allow(null).default(false)
});