import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";

import { connectDB } from "./lib/db.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 8001;

// middlewares

app.use(express.json()); // to parse json body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth.userId
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10mb max file size
    },
  })
);

// import routes

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRouts from "./routes/admin.route.js";
import songsRoutes from "./routes/song.route.js";
import albumsRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stat.route.js";

// use routes

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRouts);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

// error handler
app.use((error, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});

/// TODO: Socket.io implementation
