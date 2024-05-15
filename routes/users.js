import express from "express";
import { getAvatar, uploadAvatar } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

import upload from "../middleware/upload.js";
const usersRouter = express.Router();

usersRouter.get("/avatars", auth, getAvatar);
usersRouter.patch("/avatars", auth, upload.single("avatarURL"), uploadAvatar);

export { usersRouter };
