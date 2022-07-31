import Joi from "joi";

export const registerBlankChecklistSchema = Joi.object({
    clientId : Joi.string().required().hex().length(24),
    requirements : Joi.object({
       cooler : Joi.valid(null),
       padding : Joi.valid(null),
       compartment : Joi.valid(null),
       pallets : Joi.valid( null),
       waterProtection : Joi.valid(null)

    }),
    category : Joi.string().default(null),
    driverDetails : Joi.object().default({
       licensePresent : null,
       rc : null,
       phone : null,
       airPressureGood : null
    }),
    summary : Joi.string().default(null),
})