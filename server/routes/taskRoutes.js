import express from "express";
import {
  addTask,
  deleteTask,
  updateTask,
} from "../controllers/taskControllers.js";
const router = express.Router();

router.post("/update", updateTask);

router.post("/add", addTask);

router.delete("/delete/:id", deleteTask);
export default router;
