// import { Router, Request, Response } from "express";
// import { Conversation } from "../models/Conversation";
// import { generateChatReply } from "../services/openaiService";
// import { appendChatRow } from "../services/googleSheetsService";

// const router = Router();

// function isValidIsraeliMobile(phone: string): boolean {
//   return /^05\d{8}$/.test(phone);
// }

// function normalizeIsraeliPhoneNumber(phone: string): string | null {
//   const cleaned = phone.replace(/[^\d+]/g, "");

//   if (cleaned.startsWith("+972")) {
//     const local = "0" + cleaned.slice(4);

//     if (isValidIsraeliMobile(local)) {
//       return local;
//     }

//     return null;
//   }

//   if (isValidIsraeliMobile(cleaned)) {
//     return cleaned;
//   }

//   return null;
// }

// function extractIsraeliPhoneNumber(text: string): string | null {
//   const match = text.match(/(?:\+972|0)[\d\s-]{8,15}/);

//   if (!match) {
//     return null;
//   }

//   return normalizeIsraeliPhoneNumber(match[0]);
// }

// function exportMessageToSheets(
//   conversation: any,
//   role: "user" | "assistant",
//   message: string,
//   timestamp: Date
// ): void {
//   console.log("[Sheets] exporting message:", {
//     conversationId: conversation._id.toString(),
//     role,
//     message,
//   });

//   appendChatRow({
//     conversationId: conversation._id.toString(),
//     customerName: conversation.customerName,
//     phoneNumber: conversation.phoneNumber,
//     channel: conversation.channel,
//     profileStep: conversation.profileStep,
//     role,
//     message,
//     timestamp,
//     createdAt: conversation.createdAt,
//     updatedAt: conversation.updatedAt,
//   }).catch((error) => {
//     console.error(`Failed to export ${role} message to Google Sheets:`, error);
//   });
// }

// router.post("/start", async (req: Request, res: Response) => {
//   console.log("[POST /api/chat/start] body:", req.body);

//   try {
//     const { channel } = req.body as {
//       channel?: "web" | "mobile";
//     };

//     if (!channel) {
//       return res.status(400).json({
//         message: "channel is required",
//       });
//     }

//     if (channel !== "web" && channel !== "mobile") {
//       return res.status(400).json({
//         message: "channel must be either 'web' or 'mobile'",
//       });
//     }

//     const greeting =
//       "שלום, אני העוזר של A.B Deliveries. לפני שנתחיל, אשמח אם תכתוב לי את השם שלך.";

//     const greetingTimestamp = new Date();

//     const conversation = await Conversation.create({
//       customerName: "Not provided yet",
//       phoneNumber: "Not provided yet",
//       channel,
//       profileStep: "collecting_name",
//       messages: [
//         {
//           role: "assistant",
//           content: greeting,
//           timestamp: greetingTimestamp,
//         },
//       ],
//     });

//     exportMessageToSheets(
//       conversation,
//       "assistant",
//       greeting,
//       greetingTimestamp
//     );

//     return res.status(201).json({
//       conversationId: conversation._id,
//       messages: conversation.messages,
//     });
//   } catch (error) {
//     console.error("[POST /api/chat/start] error:", error);
//     return res.status(500).json({
//       message: "Failed to start conversation",
//     });
//   }
// });

// router.post("/message", async (req: Request, res: Response) => {
//   console.log("[POST /api/chat/message] body:", req.body);

//   try {
//     const { conversationId, message } = req.body as {
//       conversationId?: string;
//       message?: string;
//     };

//     if (!conversationId || !message?.trim()) {
//       return res.status(400).json({
//         message: "conversationId and message are required",
//       });
//     }

//     const conversation = await Conversation.findById(conversationId);

//     if (!conversation) {
//       return res.status(404).json({
//         message: "Conversation not found",
//       });
//     }

//     const trimmedMessage = message.trim();
//     const userTimestamp = new Date();

//     conversation.messages.push({
//       role: "user",
//       content: trimmedMessage,
//       timestamp: userTimestamp,
//     });

//     if (conversation.profileStep === "collecting_name") {
//       conversation.customerName = trimmedMessage;
//       conversation.profileStep = "collecting_phone";

//       const reply = `תודה ${trimmedMessage}, עכשיו אשמח אם תכתוב לי את מספר הטלפון הישראלי שלך.`;
//       const assistantTimestamp = new Date();

//       conversation.messages.push({
//         role: "assistant",
//         content: reply,
//         timestamp: assistantTimestamp,
//       });

//       await conversation.save();

//       exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
//       exportMessageToSheets(
//         conversation,
//         "assistant",
//         reply,
//         assistantTimestamp
//       );

//       return res.json({
//         reply,
//         messages: conversation.messages,
//       });
//     }

//     if (conversation.profileStep === "collecting_phone") {
//       const extractedPhone = extractIsraeliPhoneNumber(trimmedMessage);

//       if (!extractedPhone) {
//         const reply =
//           "לא הצלחתי לזהות מספר טלפון ישראלי תקין. אנא כתוב מספר טלפון נייד ישראלי בפורמט כמו 0501234567.";
//         const assistantTimestamp = new Date();

//         conversation.messages.push({
//           role: "assistant",
//           content: reply,
//           timestamp: assistantTimestamp,
//         });

//         await conversation.save();

//         exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
//         exportMessageToSheets(
//           conversation,
//           "assistant",
//           reply,
//           assistantTimestamp
//         );

//         return res.json({
//           reply,
//           messages: conversation.messages,
//         });
//       }

//       conversation.phoneNumber = extractedPhone;
//       conversation.profileStep = "ready";

//       const reply = `מעולה, שמרתי את מספר הטלפון שלך: ${extractedPhone}. עכשיו אפשר להמשיך — איך אוכל לעזור לך לגבי המשלוח?`;
//       const assistantTimestamp = new Date();

//       conversation.messages.push({
//         role: "assistant",
//         content: reply,
//         timestamp: assistantTimestamp,
//       });

//       await conversation.save();

//       exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
//       exportMessageToSheets(
//         conversation,
//         "assistant",
//         reply,
//         assistantTimestamp
//       );

//       return res.json({
//         reply,
//         messages: conversation.messages,
//       });
//     }

//     const historyForAi = conversation.messages.map((msg) => ({
//       role: msg.role as "user" | "assistant" | "system",
//       content: msg.content,
//     }));

//     const reply = await generateChatReply(historyForAi);
//     const assistantTimestamp = new Date();

//     conversation.messages.push({
//       role: "assistant",
//       content: reply,
//       timestamp: assistantTimestamp,
//     });

//     await conversation.save();

//     exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
//     exportMessageToSheets(conversation, "assistant", reply, assistantTimestamp);

//     return res.json({
//       reply,
//       messages: conversation.messages,
//     });
//   } catch (error) {
//     console.error("[POST /api/chat/message] error:", error);
//     return res.status(500).json({
//       message: "Failed to process message",
//     });
//   }
// });

// export default router;

import { Router, Request, Response } from "express";
import { Conversation } from "../models/Conversation";
import { generateChatReply } from "../services/openaiService";
import {
  appendChatRow,
  updateConversationRows,
} from "../services/googleSheetsService";

const router = Router();

function isValidIsraeliMobile(phone: string): boolean {
  return /^05\d{8}$/.test(phone);
}

function normalizeIsraeliPhoneNumber(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+972")) {
    const local = "0" + cleaned.slice(4);

    if (isValidIsraeliMobile(local)) {
      return local;
    }

    return null;
  }

  if (isValidIsraeliMobile(cleaned)) {
    return cleaned;
  }

  return null;
}

function extractIsraeliPhoneNumber(text: string): string | null {
  const match = text.match(/(?:\+972|0)[\d\s-]{8,15}/);

  if (!match) {
    return null;
  }

  return normalizeIsraeliPhoneNumber(match[0]);
}

async function exportMessageToSheets(
  conversation: any,
  role: "user" | "assistant",
  message: string,
  timestamp: Date
) {
  console.log("[Sheets] exporting message:", {
    conversationId: conversation._id.toString(),
    role,
    message,
  });

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
    })
  } catch (error) {
    console.error(`Failed to export ${role} message to Google Sheets:`, error);
  }
}

router.post("/start", async (req: Request, res: Response) => {
  console.log("[POST /api/chat/start] body:", req.body);

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

router.post("/message", async (req: Request, res: Response) => {
  console.log("[POST /api/chat/message] body:", req.body);

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

    if (conversation.profileStep === "collecting_name") {
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
      })

      await exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
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

    if (conversation.profileStep === "collecting_phone") {
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

        await exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
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

      await exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
      await exportMessageToSheets(
        conversation,
        "assistant",
        reply,
        assistantTimestamp
      );

      await updateConversationRows(conversation._id.toString(), {
        phoneNumber: extractedPhone,
        profileStep: "ready",
      })

      return res.json({
        reply,
        messages: conversation.messages,
      });
    }

    const historyForAi = conversation.messages.map((msg) => ({
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

    await exportMessageToSheets(conversation, "user", trimmedMessage, userTimestamp);
    await exportMessageToSheets(conversation, "assistant", reply, assistantTimestamp);

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