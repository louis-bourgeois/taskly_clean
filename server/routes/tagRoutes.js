import express from "express";
import { updateTag } from "../controllers/tagControllers";

const router = express.Router();

router.post("/update", updateTag);

router.post("/add", addTag);

router.delete("/delete/:id", deleteTag);

export default router;
