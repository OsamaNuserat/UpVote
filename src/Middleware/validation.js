import Joi from "joi";

const dataMethods = ["body", "query", "params", "headers", "file"];

export const generalFields = {
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  }),
  cPassword: Joi.string().valid(Joi.ref("password")),
  id: Joi.string().min(24).max(24).required(),
};

const validation = (schema) => {
  return (req, res, next) => {
    const validationArray = [];

    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });

        if (validationResult.error) {
          validationArray.push(validationResult.error.details);
        }
      }
    });

    if (validationArray.length > 0) {
      return res.json({ message: "validation error", validationArray });
    } else {
      next();
    }
  };
};

export default validation;
