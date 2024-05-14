import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/users.js";

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatar === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user.avatarURL);
  } catch (error) {
    next(error);
  }
};
