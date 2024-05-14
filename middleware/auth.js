import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/users.js";
import multer from "multer";
import path from "path";

const { SECRET_KEY } = process.env;

export const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  jwt.verify(token, SECRET_KEY, async (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }

      return res.status(401).send({ message: "Not authorized" });
    }

    const user = await User.findById(decode.id);

    if (!user || user.token !== token) {
      return next(HttpError(401, "Invalid token"));
    }

    req.user = {
      id: decode.id,
      name: decode.name,
    };

    next();
  });
};
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/avatars"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() + file.originalname);
  },
});

export const upload = multer({
  storage,
  // limits: {},
});
