import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
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
app.use(express.json()); // Parse les corps JSON des requêtes entrantes

// Routes
app.use("/api/users", userRoutes);

// Middlewares
// Error Handler
// app.use(errorHandler);
// Root endpoint for basic server check
app.get("/", (req, res) => {
  res.send("Welcome to the Taskly API server");
});

app.listen(port, () => {
  console.log(`HTTPS server running on http://localhost:${port}`);
});
