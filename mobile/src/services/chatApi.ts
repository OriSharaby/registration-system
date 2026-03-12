const CHAT_API_BASE_URL =
  process.env.EXPO_PUBLIC_CHAT_API_BASE_URL ?? "http://localhost:4001";
  
export type StartChatPayload = {
  channel: "web" | "mobile";
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

export type StartChatResponse = {
  conversationId: string;
  messages: ChatMessage[];
};

export type SendMessagePayload = {
  conversationId: string;
  message: string;
};

export type SendMessageResponse = {
  reply: string;
  messages: ChatMessage[];
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error("Chat server did not return JSON");
  }

  const data = JSON.parse(rawText);

  if (!response.ok) {
    throw new Error(data.message || data.detail || "Request failed");
  }

  return data;
}

export async function startChat(
  payload: StartChatPayload
): Promise<StartChatResponse> {
  const response = await fetch(`${CHAT_API_BASE_URL}/api/chat/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function sendChatMessage(
  payload: SendMessagePayload
): Promise<SendMessageResponse> {
  const response = await fetch(`${CHAT_API_BASE_URL}/api/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}