import express from "express";
import { getAvatar, uploadAvatar } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

import upload from "../middleware/upload.js";
const usersRouter = express.Router();

usersRouter.get("/avatar", auth, getAvatar);
usersRouter.patch("/avatar", auth, upload.single("avatarURL"), uploadAvatar);

export { usersRouter };
