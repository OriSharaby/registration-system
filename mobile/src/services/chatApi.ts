const CHAT_API_BASE_URL =
  "https://registration-ai-ori-d2fwhsayfqbygah9.westeurope-01.azurewebsites.net";

export type StartChatPayload = {
  customerName: string;
  phoneNumber: string;
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
  const data = await response.json();

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