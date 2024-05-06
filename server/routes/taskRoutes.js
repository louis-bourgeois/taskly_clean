import express from "express";
import { updateTask } from "../controllers/taskControllers.js";
const router = express.Router();

router.post("/update", updateTask);

export default router;
