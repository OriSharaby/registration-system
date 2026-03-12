import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoutes from "./routes/chatRoutes";
import { generateToast } from "./services/openaiService";
import { appendChatRow } from "./services/googleSheetsService";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

const PORT = Number(process.env.PORT || 4001);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/ai/toast", async (_req: Request, res: Response) => {
  const message = await generateToast();
  res.json({ message });
});

async function startServer(): Promise<void> {
  try {
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

app.get("/test-sheets", async (_req, res) => {
  try {
    await appendChatRow({
      conversationId: "test-123",
      customerName: "Ori",
      phoneNumber: "0500000000",
      channel: "web",
      profileStep: "ready",
      role: "assistant",
      message: "בדיקת חיבור לגוגל שיטס",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Google Sheets test failed:", error);
    res.status(500).json({ ok: false });
  }
});

startServer();