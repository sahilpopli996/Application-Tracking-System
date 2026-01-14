import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB.js";

// Routes
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import fileUploadRoute from "./routes/fileUploadRoute.js";
import authRoutes from "./routes/Auth.js";

// Load env
dotenv.config();

// Create app FIRST
const app = express();
const port = process.env.PORT || 3004;

// 🔥 Middleware (ORDER MATTERS)
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3005", // frontend
  credentials: true,              // 🔑 JWT cookies
}));

app.use(cookieParser());

// Database
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
app.use("/application", applicationRoutes);
app.use("/recruiter", recruiterRoutes);
app.use("/", fileUploadRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
y