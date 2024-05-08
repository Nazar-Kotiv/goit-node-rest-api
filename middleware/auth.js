import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/users.js";
const { SECRET_KEY } = process.env;

export const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    jwt.verify(token, SECRET_KEY, async (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({ message: "Token expired" });
        }

        return res.status(401).send({ message: "Not authorized" });
      }

      const user = await User.findById(decode.id);

      if (user === null) {
        const error = new HttpError(401, "Invalid token");
        return next(error);
      }

      if (user.token !== token) {
        const error = new HttpError(401, "Invalid token");
        return next(error);
      }

      req.user = {
        id: decode.id,
        name: decode.name,
      };

      next();
    });
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};
