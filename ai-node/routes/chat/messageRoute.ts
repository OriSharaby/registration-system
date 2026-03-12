import { Router, Request, Response } from "express";
import { Conversation } from "../../models/Conversation";
import { handleCollectingNameStep } from "./messageHandlers/collectingNameHandler";
import { handleCollectingPhoneStep } from "./messageHandlers/collectingPhoneHandler";
import { handleReadyStep } from "./messageHandlers/readyHandler";

const router = Router();

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { conversationId, message } = req.body as {
      conversationId?: string;
      message?: string;
    };

    if (!conversationId || !message?.trim()) {
      return res.status(400).json({
        message: "conversationId and message are required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const trimmedMessage = message.trim();
    const userTimestamp = new Date();

    conversation.messages.push({
      role: "user",
      content: trimmedMessage,
      timestamp: userTimestamp,
    });

    switch (conversation.profileStep) {
      case "collecting_name":
        return handleCollectingNameStep(
          conversation,
          trimmedMessage,
          userTimestamp,
          res
        );

      case "collecting_phone":
        return handleCollectingPhoneStep(
          conversation,
          trimmedMessage,
          userTimestamp,
          res
        );

      default:
        return handleReadyStep(conversation, trimmedMessage, userTimestamp, res);
    }
  } catch (error) {
    console.error("[POST /api/chat/message] error:", error);
    return res.status(500).json({
      message: "Failed to process message",
    });
  }
});

export default router;