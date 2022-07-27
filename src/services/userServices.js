import User from "../models/userModel.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";
import bcrypt from "bcrypt";

export const createUser = async (input) => {
  try {
    // verify email and phone number are unique
    const isEmailExist = await User.findOne({ email: input.email });

    if (isEmailExist) {
      throw new createError.NotAcceptable("Email already exists");
    }

    const isPhoneNumberExist = await User.findOne({ phone: input.phone });

    if (isPhoneNumberExist) {
      throw new createError.NotAcceptable("Phone number already exists");
    }

    const user = await User.create(input);

    // masking password
    user.password = undefined;

    return user;
  } 
  catch (err) {
    logger.info(err.message);
    throw err;
  }
};

export const userLogin = async (input) => {
    try {

    const condition = {}

    if(input.role === "inspection manager"){
        if(input.phone === undefined){
            throw new createError.BadRequest("Inspection manager login, requires phone number");
        }
        condition.phone = input.phone;
    }else{
        if(input.email === undefined){
            throw new createError.BadRequest(`${input.role}, login requires Email`)
        }
        condition.email = input.email;
    }
        
    const user = await User.findOne(condition);

    if(!user){
        throw new createError.NotFound(`${Object.keys(condition)[0]} does not exist`);
    }

    if(user.role !== input.role){
        throw new createError.NotAcceptable(`Please login as ${user.role}`);
    }

    const isPasswordMatch = await bcrypt.compare(input.password, user.password);

    if(!isPasswordMatch){
        throw new createError.Unauthorized('Invalid Password')
    }

    const payload = {
        userId : user._id.toString(),
        role : user.role
    }
    
    const secret = process.env.JWT_SECRET
    const expiry = {expiresIn : process.env.JWT_EXPIRY}
    
    const token = jwt.sign(payload, secret, expiry)
            
    // masking user password
    user.password = undefined;
            
    const obj =   {token: token, user: user}
    return obj

    } 
    catch (err) {
        logger.info(err.message)
        throw err
    }   
}
