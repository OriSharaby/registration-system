import { Router, Request, Response } from "express";
import { Conversation } from "../../models/Conversation";
import { exportMessageToSheets } from "./chatHelpers";

const router = Router();

router.post("/start", async (req: Request, res: Response) => {
  try {
    const { channel } = req.body as {
      channel?: "web" | "mobile";
    };

    if (!channel) {
      return res.status(400).json({
        message: "channel is required",
      });
    }

    if (channel !== "web" && channel !== "mobile") {
      return res.status(400).json({
        message: "channel must be either 'web' or 'mobile'",
      });
    }

    const greeting =
      "שלום, אני העוזר של A.B Deliveries. לפני שנתחיל, אשמח אם תכתוב לי את השם שלך.";

    const greetingTimestamp = new Date();

    const conversation = await Conversation.create({
      customerName: "Not provided yet",
      phoneNumber: "Not provided yet",
      channel,
      profileStep: "collecting_name",
      messages: [
        {
          role: "assistant",
          content: greeting,
          timestamp: greetingTimestamp,
        },
      ],
    });

    await exportMessageToSheets(
      conversation,
      "assistant",
      greeting,
      greetingTimestamp
    );

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

export default router;