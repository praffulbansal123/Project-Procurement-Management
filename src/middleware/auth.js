import createError from "http-errors";
import jwt from "jsonwebtoken";

export const authentication = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw createError.NotFound("Token not found..please login first");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    if (Date.now() > decodedToken.exp * 1000)
      throw createError.RequestTimeout(" session expired please login again");
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    return createError.Unauthorized(err.message)
  }
};
