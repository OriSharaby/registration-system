import { Router, Request, Response } from "express";
import { generateToast } from "../services/openaiService";

const router = Router();

router.get("/api/ai/toast", async (_req: Request, res: Response) => {
  try {
    const message = await generateToast();
    res.json({ message });
  } catch (error) {
    console.error("[Toast Route] Failed to generate toast:", error);
    res.status(500).json({
      message: "Failed to generate toast",
    });
  }
});

export default router;