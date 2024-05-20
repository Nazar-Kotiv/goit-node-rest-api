import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/users.js";
import jimp from "jimp";

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
    const avatar = await jimp.read(req.file.path);
    await avatar.cover(250, 250).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
