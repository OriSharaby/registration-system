import { Router } from "express";
import startRoute from "./startRoute";
import messageRoute from "./messageRoute";

const router = Router();

router.use(startRoute);
router.use(messageRoute);

export default router;