import express from "express";
import validateBody from "../helpers/validateBody.js";
import { auth } from "../middleware/auth.js";

import {
  register,
  login,
  logout,
  getCurrent,
  verify,
  resendVerifyEmail,
} from "../controllers/auth.js";
import {
  registerShemas,
  loginSchema,
  emailShema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post(
  "/register",
  jsonParser,
  validateBody(registerShemas),
  register
);
authRouter.get("/verify/:verificationToken", verify);

authRouter.post("/verify", validateBody(emailShema), resendVerifyEmail);

authRouter.post("/login", jsonParser, validateBody(loginSchema), login);
export { authRouter };

authRouter.post("/logout", auth, logout);

authRouter.get("/current", auth, getCurrent);
