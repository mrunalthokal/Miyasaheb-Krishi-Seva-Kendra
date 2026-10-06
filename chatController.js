const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { handleMessage } = require("../services/intentRouter");

// POST /api/chat  { message: string, history?: [{role, content}] }
const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message || !String(message).trim()) {
    throw new ApiError(400, "A message is required.");
  }
  if (String(message).length > 1000) {
    throw new ApiError(400, "Message is too long (max 1000 characters).");
  }

  const result = await handleMessage(String(message).trim(), Array.isArray(history) ? history : []);
  res.json({ success: true, ...result });
});

module.exports = { chat };
