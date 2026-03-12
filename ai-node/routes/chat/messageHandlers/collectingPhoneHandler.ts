import { Response } from "express";
import { exportMessageToSheets, extractIsraeliPhoneNumber } from "../chatHelpers";
import { updateConversationRows } from "../../../services/googleSheetsService";

export async function handleCollectingPhoneStep(
  conversation: any,
  trimmedMessage: string,
  userTimestamp: Date,
  res: Response
) {
  const extractedPhone = extractIsraeliPhoneNumber(trimmedMessage);

  if (!extractedPhone) {
    const reply =
      "לא הצלחתי לזהות מספר טלפון ישראלי תקין. אנא כתוב מספר טלפון נייד ישראלי בפורמט כמו 0501234567.";
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

  conversation.phoneNumber = extractedPhone;
  conversation.profileStep = "ready";

  const reply = `מעולה, שמרתי את מספר הטלפון שלך: ${extractedPhone}. עכשיו אפשר להמשיך — איך אוכל לעזור לך לגבי המשלוח?`;
  const assistantTimestamp = new Date();

  conversation.messages.push({
    role: "assistant",
    content: reply,
    timestamp: assistantTimestamp,
  });

  await conversation.save();

  await updateConversationRows(conversation._id.toString(), {
    phoneNumber: extractedPhone,
    profileStep: "ready",
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