import { Router } from "express";
import healthRoute from "./health";
import toastRoute from "./toast";
import chatRoutes from "./chat";

const router = Router();

router.use(healthRoute);
router.use(toastRoute);
router.use("/api/chat", chatRoutes);

export default router;