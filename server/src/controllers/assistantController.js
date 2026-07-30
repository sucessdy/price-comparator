
const asyncHandler = require("../utils/asyncHandler");
const { ValidationError } = require("../errors/AppError");
const { processMessage } = require("../services/assistantService");
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ValidationError("Message is required");
  }

  const response = await processMessage(message);
  res.status(200).json(response);
});

module.exports =  {chat }; 