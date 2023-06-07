const Joi = require('joi');


const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const updateSchemas = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  })
  .or("name", "email", "phone")
  .required();
  
  module.exports = 
  {
    contactAddSchema,
  updateSchemas
  }

  