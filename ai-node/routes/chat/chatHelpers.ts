import { appendChatRow } from "../../services/googleSheetsService";

export function isValidIsraeliMobile(phone: string): boolean {
  return /^05\d{8}$/.test(phone);
}

export function normalizeIsraeliPhoneNumber(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+972")) {
    const local = "0" + cleaned.slice(4);
    return isValidIsraeliMobile(local) ? local : null;
  }

  return isValidIsraeliMobile(cleaned) ? cleaned : null;
}

export function extractIsraeliPhoneNumber(text: string): string | null {
  const match = text.match(/(?:\+972|0)[\d\s-]{8,15}/);

  if (!match) {
    return null;
  }

  return normalizeIsraeliPhoneNumber(match[0]);
}

export async function exportMessageToSheets(
  conversation: any,
  role: "user" | "assistant",
  message: string,
  timestamp: Date
) {
  try {
    await appendChatRow({
      conversationId: conversation._id.toString(),
      customerName: conversation.customerName,
      phoneNumber: conversation.phoneNumber,
      channel: conversation.channel,
      profileStep: conversation.profileStep,
      role,
      message,
      timestamp,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error(`Failed to export ${role} message to Google Sheets:`, error);
  }
}