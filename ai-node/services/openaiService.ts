import OpenAI from "openai";
import { getChatbotSystemPrompt } from "./promptService";
import dotenv from "dotenv";

dotenv.config();

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
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

function logOpenAiError(err: unknown): void {
  if (err instanceof Error) {
    console.warn("[AI Service] OpenAI request failed:", {
      message: err.message,
      name: err.name,
    });
    return;
  }

  console.warn("[AI Service] OpenAI request failed:", err);
}

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export async function generateToast(): Promise<string> {
  try {
    const response = await client.responses.create({
      model: MODEL,
      temperature: 0.2,
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

export async function generateChatReply(
  history: ChatMessage[]
): Promise<string> {
  try {
    const systemPrompt = getChatbotSystemPrompt();

    const input = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ];

    const response = await client.responses.create({
      model: MODEL,
      temperature: 0.2,
      input,
    });

    const text = response.output_text?.trim();

    if (!text) {
      return "אני כאן כדי לעזור. אפשר לנסח שוב את השאלה?";
    }

    return text;
  } catch (err: unknown) {
    logOpenAiError(err);
    return "מצטער, יש תקלה זמנית. אפשר לנסות שוב בעוד רגע?";
  }
}