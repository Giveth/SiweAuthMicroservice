import Joi, { ObjectSchema, ValidationResult } from 'joi';
import { networkIds } from '../utils/utils';

const ethereumWalletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const txHashRegex = /^0x[a-fA-F0-9]{64}$/;

export const validateWithJoiSchema = (data: any, schema: ObjectSchema) => {
  const validationResult = schema.validate(data);
  throwHttpErrorIfJoiValidatorFails(validationResult);
};

const throwHttpErrorIfJoiValidatorFails = (
  validationResult: ValidationResult,
) => {
  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }
};

export const createDonationValidator = Joi.object({
  fromWalletAddress: Joi.string()
    .required()
    .pattern(ethereumWalletAddressRegex),
  toWalletAddress: Joi.string().required().pattern(ethereumWalletAddressRegex),
  amount: Joi.number().required().min(0.0001),
  priceUsd: Joi.number().min(0.000001),
  txHash: Joi.string().required().pattern(txHashRegex),
  nonce: Joi.number().integer().min(0),
  network: Joi.string()
    .required()
    .valid(...Object.keys(networkIds)),
  currency: Joi.string().required(),
});

export const createAccessTokenValidator = Joi.object({
  scopes: Joi.array().required().items(Joi.string()).min(1),
});
