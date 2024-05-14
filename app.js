import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import path from "node:path";

import { contactsRouter } from "./routes/contactsRouter.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public/avatars")));
app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);
app.use("/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const DB_URI = process.env.DB_URI;

async function startServer() {
  try {
    await mongoose.connect(DB_URI);
    console.info("Database connection successful");

    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
    node;
  }
}

startServer();
