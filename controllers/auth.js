import bcrypt from "bcrypt";
import User from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (user !== null) {
      const error = new HttpError(409, "Email in use");
      return next(error);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(emailInLowerCase);

    await User.create({
      ...req.body,
      name,
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).send({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (user === null) {
      const error = new HttpError(401, "Email or password is incorrect");
      return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      const error = new HttpError(401, "Email or password is incorrect");
      return next(error);
    }
    const payload = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: 60 * 60 });

    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).send({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    res.status(200).json({
      email,
      name,
    });
  } catch (error) {
    next(error);
  }
};
