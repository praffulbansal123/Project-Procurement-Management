import { registerUserSchema, loginUserSchema, updateUserSchema } from '../schemas/userJoiSchema.js'
import { registerBlankChecklistSchema, filledChecklistSchema } from '../schemas/checklistJoiSchema.js'
import { registerOrderSchema, updateStatusSchema  } from '../schemas/orderJoiSchema.js'

/*
* @author Prafful Bansal
* @description Joi validation for the incoming request
*/
const requestValidator = (req, next, schema) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        // joi error status
        error.status = 422; 
        return next(error);
    } else {
        req.body = value;
       return next();
    }
}

const formDataValidator = (req, next, schema) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    let requestBody = {...req.body}
    console.log(requestBody)

    if(requestBody.requirements) {
        requestBody.requirements = JSON.parse(requestBody.requirements);
    }
    if(requestBody.driverDetails){
        requestBody.driverDetails = JSON.parse(requestBody.driverDetails);
    }
    const { error, value } = schema.validate(requestBody, options);
    if (error) {
        logger.info(error)
         error.status = 422; //
       return next(error);
    } else {
        req.body = value;
       return next();
    }
}

export const createUserSchema = (req, res, next) => {
    const schema = registerUserSchema
    requestValidator(req, next, schema);
}

export const loginSchema = (req, res, next) => {
    const schema = loginUserSchema
    requestValidator(req, next, schema);
}

export const updateSchema = (req, res, next) => {
    const schema = updateUserSchema
    requestValidator(req, next, schema);
}

export const createBlankChecklistSchema = (req, res, next) => {
    const schema = registerBlankChecklistSchema
    requestValidator(req, next, schema);
}

export const createOrderSchema = (req, res, next) => {
    const schema = registerOrderSchema
    requestValidator(req, next, schema);
}

export const createFilledChecklistSchema = (req, res, next) => {
    const schema = filledChecklistSchema;
    formDataValidator(req, next, schema)
}

export const updateOrderStatusSchema = (req, res, next) => {
    const schema = updateStatusSchema;
    requestValidator(req, next, schema);
}
