import express from "express";
import { addTask, updateTask } from "../controllers/taskControllers.js";
const router = express.Router();

router.post("/update", updateTask);

router.post("/add", addTask);
export default router;
