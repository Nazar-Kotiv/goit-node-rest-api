import Joi from "joi";
export const registerShemas = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subsubscriptions: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
