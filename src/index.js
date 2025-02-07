import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 8001;

// import routes

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRouts from "./routes/admin.route.js";
import songsRoutes from "./routes/songs.route.js";
import albumsRoutes from "./routes/albums.route.js";
import statsRoutes from "./routes/stats.route.js";

// use routes

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRouts);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
