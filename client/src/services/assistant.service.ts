interface SendMessageResponse {
  message: string;
  intent?: string;
  budget?: number;
  priority: string;
}

export async function sendMessage(
  message: string,
  userName: string,
  budget: number,
): Promise<SendMessageResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mealType = message.toLowerCase().includes("dinner")
    ? "Dinner"
    : message.toLowerCase().includes("lunch")
      ? "Lunch"
      : "general";

  const extractedBudget = message.match(/₹(\d+)/)
    ? parseInt(message.match(/₹(\d+)/)![1])
    : budget || 800;

  const response = {
    message: `I understood:\nBudget: ₹${extractedBudget}\nMeal: ${mealType}\nPriority: Best Value\n\nI'm finding the best shopping plan for ${userName || "you"}...`,
    intent: "shopping",
    budget: extractedBudget,
    priority: "best_value",
  };

  return response;
}
