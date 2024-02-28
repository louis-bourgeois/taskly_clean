import express from "express";
import { checkUser, createUser } from "../controllers/userControllers.js";
import { checkPassword, hashPassword } from "../middleware/pasword.js";

const router = express.Router();

router.get("/", checkUser);
router.post("/register", hashPassword, createUser);
router.post("/check", checkUser, checkPassword);

export default router;
