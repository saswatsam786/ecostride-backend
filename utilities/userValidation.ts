import * as Joi from "joi";

const userSignUpValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string()
    .regex(/^\d{10}$/)
    .required(), // Assuming a 10-digit phone number
  gender: Joi.string().valid("male", "female", "other").required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Minimum 6 characters for the password
  userId: Joi.string().alphanum().min(3).max(30).required(), // Alphanumeric, min length 3, max length 30
});

const userIdValidation = Joi.object({
  email: Joi.string().email().required(),
});

const transactionCampaignValidation = Joi.object({
  transactionDetails: Joi.object({
    timeStamp: Joi.string().required(),
    amount: Joi.number().required(),
    status: Joi.string().required(),
  }),
  userId: Joi.string().required(),
});

export { userSignUpValidation, userIdValidation, transactionCampaignValidation };
