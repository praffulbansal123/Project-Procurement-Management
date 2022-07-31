import User from "../models/userModel.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const canCreateUser = (inputRole, creatorRole) => {
  if (creatorRole === "admin") return true;

  if (creatorRole === "client" || creatorRole === "inspection manager")
    return false;

  if (creatorRole === "procurement manager") {
    if (inputRole === "client" || inputRole === "inspection manager") {
      return true;
    }
    return false;
  }
};

export const createUser = async (input, creatorRole, creatorId) => {
  try {
    if (!canCreateUser(input.role, creatorRole)) {
      throw new createError.Forbidden(
        `${creatorRole} are not allowed to create ${input.role}`
      );
    }
    // verify email and phone number are unique
    const isEmailExist = await User.findOne({ email: input.email });

    if (isEmailExist) {
      throw createError.NotAcceptable("Email already exists");
    }

    const isPhoneNumberExist = await User.findOne({ phone: input.phone });

    if (isPhoneNumberExist) {
      throw createError.NotAcceptable("Phone number already exists");
    }

    input.createdBy = creatorId;

    if (creatorRole === "admin" && input.role === "inspection manager") {
      if (input.workingUnder === undefined) {
        input.workingUnder = creatorId;
      } else {
        const user = await User.findById(input.workingUnder).select({role: 1});
        
        if (!user) throw createError.NotFound(`No user exits with ${input.workingUnder} ID`);
        
        if (user.role !== "procurement manager") throw createError.NotAcceptable(`${input.role} can not be assigned to ${user.role}`);
      }
    }

    if (creatorRole === "procurement manager" && input.role === "inspection manager") {
      if (input.workingUnder) {
        const user = await User.findById(input.workingUnder).select({role: 1});
        
        if (!user) throw createError.NotFound(`No user exits with ${input.workingUnder} ID`);
        
        if (user.role !== "procurement manager") throw createError.NotAcceptable(`${input.role} can not be assigned to ${user.role}`);
      } else {
        input.workingUnder = creatorId;
      }
    }

    const user = await User.create(input);

    // masking password
    user.password = undefined;

    return user;
  } catch (err) {
    throw err;
  }
};

export const userLogin = async (input) => {
  try {
    const condition = {};

    if (input.role === "inspection manager") {
      if (input.phone === undefined) {
        throw createError.BadRequest("Inspection manager login, requires phone number");
      }
      condition.phone = input.phone;
    } else {
      if (input.email === undefined) {
        throw createError.BadRequest(`${input.role}, login requires Email`);
      }
      condition.email = input.email;
    }

    const user = await User.findOne(condition);

    if (!user) {
      throw createError.NotFound(`${Object.keys(condition)[0]} does not exist`);
    }

    if (user.role !== input.role) {
      throw createError.NotAcceptable(`Please login as ${user.role}`);
    }

    const isPasswordMatch = await bcrypt.compare(input.password, user.password);

    if (!isPasswordMatch) {
      throw createError.Unauthorized("Invalid Password");
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;
    const expiry = { expiresIn: process.env.JWT_EXPIRY };

    const token = jwt.sign(payload, secret, expiry);

    // masking user password
    user.password = undefined;

    const obj = { token: token, user: user };
    return obj;
  } catch (err) {
    throw err;
  }
};

export const userUpdate = async (input, creatorRole) => {
  try {
    if(creatorRole !== 'admin') throw createError.Forbidden('Only admin can update the user')

    if(input.role !== 'inspection manager') throw createError.Forbidden(`${input.role} profile can not be updated`)

    const user = await User.findById(input.id).select({role:1, workingUnder:1})

    if(!user) throw createError.NotFound(`No user exits with ${input.id} ID`);

    if(user.role !== input.role) throw createError.NotAcceptable(`${user.role} does not match with ${input.role}`)

    if(user.workingUnder === input.workingUnder ) throw createError.NotAcceptable(`user is already working under same manager`)

    const userByWorkingUnder = await User.findOne(input.workingUnder).select({role: 1})

    if(!userByWorkingUnder) throw createError.NotFound(`No such user exits with ${input.workingUnder}`)

    if(userByWorkingUnder.role !== 'procurement manager' && userByWorkingUnder.role !== 'admin') throw createError.Forbidden(`${input.role} can not be assigned to ${userByWorkingUnder.role}`)

    const updateUser = await User.findOneAndUpdate({_id: input.id}, {$set: {workingUnder: input.workingUnder}}, {new: true})
    
    return updateUser
  } catch(err) {
    throw (err)
  }
};

export const inspectionManager = async (payload) => {
  try {

    if(payload.role === 'inspection manager' || payload.role === 'client') {
      throw createError.Forbidden(`${payload.role} is not authorized to get Inspection Manager list`)
    }
    else if(payload.role === 'admin'){
      const inspManger = await User.find({role: 'inspection manager'})
      if(!inspManger) throw createError.NotFound('No Inspection Manager exits')
      return inspManger
    } else {
      console.log(payload.userId)
      const managerIns = await User.find({role: 'inspection manager', workingUnder: payload.userId})
      if(!managerIns) throw createError.NotFound(`No Inspection Manager is assigned to this ${payload.role}`)
      return managerIns
    }
  } catch (err) {
    throw(err)
  }
}
