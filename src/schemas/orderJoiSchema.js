import Joi from 'joi';

/*
* @author Prafful Bansal
* @description Joi validation for creating orders
*/
export const registerOrderSchema = Joi.object({
   
    clientId:  Joi.string().hex().required().length(24),
    status : Joi.string().default("pending"),
    items : Joi.number().required().min(1),
    itemType : Joi.string().valid("food", "medical", "houseHolds", "electronics", "other").required(),
    itemDetails : Joi.string().required(),
    coolerRequired  : Joi.boolean().default(false),
    paddingRequired : Joi.boolean().default(false),
    waterProtectionRequired : Joi.boolean().default(false),
    palletsRequired : Joi.boolean().default(false),
    sharingAllowed : Joi.boolean().default(false),
    deliveryTo : Joi.string().required().min(3),
    pickUpFrom : Joi.string().required().min(3),

});

/*
* @author Prafful Bansal
* @description Joi validation for updating order status
*/
export const updateStatusSchema = Joi.object({
    status : Joi.string().required().valid("completed", "dispatched")
})