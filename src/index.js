import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { initializeSocket } from "./lib/socket.js";
import cron from "node-cron";
import fs from "fs";

import { connectDB } from "./lib/db.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 8001;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

// import routes

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRouts from "./routes/admin.route.js";
import songsRoutes from "./routes/song.route.js";
import albumsRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stat.route.js";
import { createServer } from "http";

// use routes

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRouts);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// error handler
app.use((error, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

/// TODO: Socket.io implementation

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
