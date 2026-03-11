import { Router, Request, Response } from "express";
import { Conversation } from "../models/Conversation";
import { generateChatReply } from "../services/openaiService";

const router = Router();

router.post("/start", async (req: Request, res: Response) => {
  try {
    const { customerName, phoneNumber, channel } = req.body as {
      customerName?: string;
      phoneNumber?: string;
      channel?: "web" | "mobile";
    };

    if (!customerName || !phoneNumber || !channel) {
      return res.status(400).json({
        message: "customerName, phoneNumber, and channel are required",
      });
    }

    if (channel !== "web" && channel !== "mobile") {
      return res.status(400).json({
        message: "channel must be either 'web' or 'mobile'",
      });
    }

    const greeting =
      "שלום, אני העוזר של A.B Deliveries. אשמח לעזור לך עם שאלות על משלוחים וגם להציע שירותים מתאימים. איך אפשר לעזור?";

    const conversation = await Conversation.create({
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      channel,
      messages: [
        {
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ],
    });

    return res.status(201).json({
      conversationId: conversation._id,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("[POST /api/chat/start] error:", error);
    return res.status(500).json({
      message: "Failed to start conversation",
    });
  }
});

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

    conversation.messages.push({
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    });

    const historyForAi = conversation.messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    const reply = await generateChatReply(historyForAi);

    conversation.messages.push({
      role: "assistant",
      content: reply,
      timestamp: new Date(),
    });

    await conversation.save();

    return res.json({
      reply,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("[POST /api/chat/message] error:", error);
    return res.status(500).json({
      message: "Failed to process message",
    });
  }
});

export default router;