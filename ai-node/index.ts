import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

const PORT = Number(process.env.PORT || 4001);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

async function startServer(): Promise<void> {
  try {
    console.log("[AI Service] Starting server...");
    await mongoose.connect(MONGODB_URI!);
    console.log("[AI Service] Connected to MongoDB");
    console.log("[AI Service] Mongo DB name:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`[AI Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[AI Service] Failed to start:", error);
    process.exit(1);
  }
}

startServer();