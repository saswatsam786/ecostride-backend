import * as Joi from "joi";

const ngoSignUpValidation = Joi.object({
  nameNGO: Joi.string().required(),
  registrationNumber: Joi.string().required(),
  verified: Joi.boolean().required(),
  address: Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pincode: Joi.number().required(),
  }).required(),
  orgCategory: Joi.string().required(),
  namePOC: Joi.string().required(),
  phonePOC: Joi.number().required(),
  association: Joi.string().required(),
  addharPOC: Joi.number().required(),
});

export { ngoSignUpValidation };
