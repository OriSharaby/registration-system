import { Response } from "express";
import { exportMessageToSheets } from "../chatHelpers";
import { updateConversationRows } from "../../../services/googleSheetsService";

export async function handleCollectingNameStep(
  conversation: any,
  trimmedMessage: string,
  userTimestamp: Date,
  res: Response
) {
  conversation.customerName = trimmedMessage;
  conversation.profileStep = "collecting_phone";

  const reply = `תודה ${trimmedMessage}, עכשיו אשמח אם תכתוב לי את מספר הטלפון הישראלי שלך.`;
  const assistantTimestamp = new Date();

  conversation.messages.push({
    role: "assistant",
    content: reply,
    timestamp: assistantTimestamp,
  });

  await conversation.save();

  await updateConversationRows(conversation._id.toString(), {
    customerName: trimmedMessage,
    profileStep: "collecting_phone",
  });

  await exportMessageToSheets(
    conversation,
    "user",
    trimmedMessage,
    userTimestamp
  );

  await exportMessageToSheets(
    conversation,
    "assistant",
    reply,
    assistantTimestamp
  );

  return res.json({
    reply,
    messages: conversation.messages,
  });
}