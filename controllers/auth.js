import bcrypt from "bcrypt";
import User from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import e from "express";

const { SECRET_KEY, BASE_URL } = process.env;

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
    const verificationToken = nanoid();

    await User.create({
      ...req.body,
      name,
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}"> Click verify email</a>`,
    };
    await sendEmail(verifyEmail);

    res.status(201).send({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return HttpError(400, "missing required field email");
    }
    if (user.verify) {
      return HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}"> Click verify email</a>`,
    };
    await sendEmail(verifyEmail);

    res.status(200).json({ message: "Verification email sent" });
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

    if (!user.verify) {
      return HttpError(404, "User not found");
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
