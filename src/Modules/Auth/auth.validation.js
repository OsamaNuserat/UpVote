import Joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const signupSchema = {
  body: Joi.object({
    name: Joi.string().alphanum().min(3).max(20).required().messages({
      "any.required": "username is required",
      "string.empty": "username is required",
    }),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: Joi.string().valid(Joi.ref("password")),
  }).required(),
};

export const loginSchema = {
  body: Joi.object({
    email: generalFields.email,
    password: generalFields.password,
  }).required(),
};
