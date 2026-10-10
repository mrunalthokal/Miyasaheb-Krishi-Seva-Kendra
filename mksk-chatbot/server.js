require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const { connectDB, dbAvailable } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const chatRoutes = require("./routes/chatRoutes");
const llm = require("./services/llmService");

const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin === "*" ? true : allowedOrigin.split(",") }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({
  success: true,
  message: "Krishi Mitra chatbot is running.",
  dbConnected: dbAvailable(),
  llmConfigured: llm.isConfigured(),
}));

app.use("/api/chat", chatRoutes);

// Standalone test page — open http://localhost:PORT/ to try the bot without
// touching the main site at all.
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

app.use("/api", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

async function start() {
  await connectDB(); // non-fatal if it fails — bot still runs in KB-only mode
  app.listen(PORT, () => {
    console.log(`Krishi Mitra chatbot listening on http://localhost:${PORT}`);
    console.log(`LLM enhancement: ${llm.isConfigured() ? "enabled" : "disabled (knowledge-base-only mode)"}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
