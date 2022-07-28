import createError from "http-errors";
import jwt from "jsonwebtoken";

export const authentication = async function (req, res, next) {
  try {

    if (!req.headers.authorization) throw createError.NotFound("Token not found..please login first");
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    if(!decodedToken) throw createError.Unauthorized()
    if (Date.now() > decodedToken.exp * 1000)
      throw createError.RequestTimeout(" session expired please login again");
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    next(err)
  }
};
