import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  addSection,
  deleteSection,
  updateSection,
} from path.resolve(__dirname, '../controllers/sectionControllers.js');

const router = express.Router();

router.post("/add", addSection);
router.post("/update", updateSection);
router.delete("/delete/:id", deleteSection);

export default router;
