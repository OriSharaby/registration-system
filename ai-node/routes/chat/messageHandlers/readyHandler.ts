import { Response } from "express";
import { generateChatReply } from "../../../services/openaiService";
import { exportMessageToSheets } from "../chatHelpers";

export async function handleReadyStep(
  conversation: any,
  trimmedMessage: string,
  userTimestamp: Date,
  res: Response
) {
  const historyForAi = conversation.messages.map((msg: any) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }));

  const reply = await generateChatReply(historyForAi);
  const assistantTimestamp = new Date();

  conversation.messages.push({
    role: "assistant",
    content: reply,
    timestamp: assistantTimestamp,
  });

  await conversation.save();

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