import express from "express";
import { testNvidiaAPI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/test", testNvidiaAPI);

export default router;