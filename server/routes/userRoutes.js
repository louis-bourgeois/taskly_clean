import express from "express";
import passport from "passport";
import { checkUser, createUser } from "../controllers/userControllers.js";
import { hashPassword } from "../middleware/pasword.js";
const router = express.Router();

router.get("/", checkUser);
router.post("/register", hashPassword, createUser);
router.post("/login", (req, res, next) => {
  // console.log("Received data:", req.body);
  // res.json({ status: "success", data: req.body });
  passport.authenticate("local", (err, user, info) => {
    console.log("body", req.body);
    if (err) return res.status(500).json({ message: "Internal server error" });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed", reason: info.message });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Login successful", user: user });
    });
  })(req, res, next);
});

export default router;
