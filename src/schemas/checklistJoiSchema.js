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

export const filledChecklistSchema = Joi.object({
   requirements : Joi.object({
       cooler : Joi.boolean().default(false),
       padding : Joi.boolean().default(false),
       compartment : Joi.boolean().default(false),      
       pallets : Joi.boolean().default(false),
       waterProtection : Joi.boolean().default(false),
       }).required(),
   category: Joi.string().valid("food", "medical", "houseHolds", "electronics", "other").required(),
   driverDetails:  Joi.object({
       licensePresent : Joi.boolean().required(),
       rc : Joi.boolean().required(),
       phone : Joi.boolean().required(),
       airPressureGood : Joi.boolean().required(),
   }).required(), 
   summary : Joi.string()
})