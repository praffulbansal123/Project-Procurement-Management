import createError from "http-errors";
import logger from "../logger/logger.js";
import jwt from "jsonwebtoken";

export const authentication = async function (req, res, next) {
  try {
    let token = req.headers["authorization"];

    if (!token || token.split(" ")[0] !== "Bearer") {
      throw new createError.Unauthorized("Token is required...please login first." );
    }

    token = token.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    err.status = 401;
    logger.info(err.message);
    next(err);
  }
};

export const allowedRoles = (role) => {
  return async (req, res, next) => {
    try {
      
      const inputRole = req.decodedToken.role;
      
      if (!role.includes(inputRole)) 
        throw createError.Unauthorized(`${inputRole} is not authorized for this resource`)

      return next();
    } catch (err) {
      next(err)
    }
  };
};
