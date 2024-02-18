import * as Joi from "joi";

const ngoSignUpValidation = Joi.object({
  name: Joi.string().required(),
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
  campaigns: Joi.array().items().optional(),
  email: Joi.string().email().required(),
});

const CampaignValidation = Joi.object({
  campaignName: Joi.string().required(),
  orgName: Joi.string().required(),
  orgPhone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  plantdata: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    co2Sequestration: Joi.number().integer().min(0).required(),
  })).required(),
  Totalco2Sequestration: Joi.number().integer().min(0).required(),
  donorList: Joi.array().items(Joi.string()), // You can adjust this based on your actual data type for donorList
  targetAmount: Joi.number().integer().min(0).required(),
  collectedAmount: Joi.number().integer().min(0).required(),
  completed: Joi.boolean().required(),
  CarbonCredits: Joi.number().integer().min(0).required(),
  ngoId: Joi.string().required(),
});

const ngoSignInValidation = Joi.object({
  email: Joi.string().email().required(),
});

export { ngoSignUpValidation, CampaignValidation, ngoSignInValidation };
