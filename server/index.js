import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./models/User.js";
import appRoutes from "./routes/appRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;

// CORS options
const corsOptions = {
  origin: "http://localhost:3000", // Allow only requests from this origin
  optionsSuccessStatus: 200,
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).render("rateLimit", {
      title: "Limite de Requêtes Dépassée",
    });
  },
});

// Middlewares
app.use(helmet()); // Sécurise les réponses avec divers en-têtes HTTP
app.use(cors(corsOptions)); // Active CORS avec les options spécifiées
app.use(limiter); // Applique la limitation de débit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Mitigates the risk of client side script accessing the protected cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry (7 day in this case)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);
app.use("/app", appRoutes);

// Middlewares
// Error Handler
// app.use(errorHandler);
// Root endpoint for basic server check
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Taskly API server! (don't act as a hacker please, that's boring)"
  );
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, cb) => {
    console.log("appelé", email, password);
    try {
      const user = await User.find({
        email: email,
      });
      if (user) {
        bcrypt.compare(password, user[2], (err, result) => {
          if (err) return cb(null, false);
          if (result) {
            console.log("====================================");
            console.log("tout est ok");
            console.log("====================================");
            const user_clean = user[1];
            return cb(null, user_clean);
          }
        });
      } else {
        throw new Error({ message: "User not found", status: 404 });
      }
    } catch (e) {
      return cb(e.message);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`HTTPS server running on http://localhost:${port}`);
});
