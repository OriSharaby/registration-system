import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());

const PORT = Number(process.env.PORT || 4001);
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEBUG = process.env.DEBUG === "true";

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

const client = new OpenAI({
  apiKey: openaiApiKey,
});

const FALLBACK_MESSAGES: string[] = [
  "Registration successful! 🎉",
  "Welcome aboard! We're glad you're here 😄",
  "You're all set! Registration completed 🚀",
];

function randomFallback(): string {
  return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
}

function log(...args: unknown[]): void {
  if (DEBUG) {
    console.log("[AI Service]", ...args);
  }
}

function logOpenAiError(err: unknown): void {
  if (err instanceof Error) {
    console.warn("[AI Service] OpenAI request failed -> using fallback:", {
      message: err.message,
      name: err.name,
    });
    return;
  }

  console.warn("[AI Service] OpenAI request failed -> using fallback:", err);
}

async function generateToast(): Promise<string> {
  try {
    const response = await client.responses.create({
      model: MODEL,
      input:
        "Generate a very short friendly registration toast in English (max 10 words) and add one emoji.",
    });

    const text = response.output_text?.trim();

    if (!text) {
      return randomFallback();
    }

    return text;
  } catch (err: unknown) {
    logOpenAiError(err);
    return randomFallback();
  }
}

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/ai/toast", async (_req: Request, res: Response) => {
  const message = await generateToast();
  res.json({ message });
});

app.listen(PORT, () => {
  console.log(`[AI Service] Running on http://localhost:${PORT}`);
  log("DEBUG=true");
  log("MODEL:", MODEL);
  log("OPENAI_API_KEY loaded?", !!openaiApiKey);
});