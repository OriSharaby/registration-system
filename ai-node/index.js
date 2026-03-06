import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());

const PORT = Number(process.env.PORT || 4001);
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEBUG = process.env.DEBUG === "true";
const AI_ENABLED = process.env.AI_ENABLED === "true";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FALLBACK_MESSAGES = [
  "Registration successful! 🎉",
  "Welcome aboard! We're glad you're here 😄",
  "You're all set! Registration completed 🚀",
];

function randomFallback() {
  return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
}

function log(...args) {
  if (DEBUG) console.log("[AI Service]", ...args);
}

function logOpenAiError(err) {
  const summary = {
    status: err?.status,
    code: err?.code,
    type: err?.type,
    message: err?.message,
  };

  const apiError = err?.error;
  if (apiError && typeof apiError === "object") {
    summary.api = {
      code: apiError.code,
      type: apiError.type,
      message: apiError.message,
    };
  }

  console.warn("[AI Service] OpenAI request failed -> using fallback:", summary);
}


async function generateToast() {

  if (!AI_ENABLED) {
    log("AI disabled -> fallback");
    return randomFallback();
  }

  if (!process.env.OPENAI_API_KEY) {
    log("Missing OPENAI_API_KEY -> fallback");
    return randomFallback();
  }

  try {
    const response = await client.responses.create({
      model: MODEL,
      input:
        "Generate a very short friendly registration toast in English (max 10 words) and add one emoji.",
    });

    const text = response.output_text?.trim();

    if (!text) return randomFallback();

    return text;

  } catch (err) {
    logOpenAiError(err);
    return randomFallback();
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/ai/toast", async (req, res) => {
  const message = await generateToast();
  res.json({ message });
});

app.listen(PORT, () => {
  console.log(`[AI Service] Running on http://localhost:${PORT}`);
  log("DEBUG=true");
  log("MODEL:", MODEL);
  log("AI_ENABLED:", AI_ENABLED);
  log("OPENAI_API_KEY loaded?", !!process.env.OPENAI_API_KEY);
});