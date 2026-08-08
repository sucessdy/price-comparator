import { INTENT_TYPES, MESSAGE_TYPES, type IntentType, type Message, type MessageType } from "../components/assistant/assistant.types";

interface AssistantResponse {
  message: string;
  budget?: number;
  priority: string;
  intent: IntentType;
  data: unknown;  // ← Fixed: semicolon, not colon
  context?: Record<string, unknown>;
}

export const createAssistantMessage = (response: AssistantResponse): Message => {
  // eslint-disable-next-line no-useless-assignment
  let type: MessageType = MESSAGE_TYPES.TEXT;  // ← Only declare once

  switch (response.intent) {
    case INTENT_TYPES.COMPARE:
      type = MESSAGE_TYPES.COMPARISON;
      break;

    case INTENT_TYPES.OPTIMIZE_CART:
      type = MESSAGE_TYPES.SHOPPING_PLAN;
      break;

    case INTENT_TYPES.SHOPPING_NEED:
      type = MESSAGE_TYPES.RECOMMENDATION;
      break;

    default:
      type = MESSAGE_TYPES.TEXT;
  }

  const chips: string[] = [];
  if (response.budget) chips.push(`₹${response.budget}`);
  if (response.priority) chips.push(response.priority);

  return {
    id: Date.now(),
    sender: "assistant",
    text: response.message,
    timestamp: new Date(),
    intent: response.intent,
    type: type,
    data: response.data,
    context: response.context,
    chips: chips.length ? chips : undefined,
  };
};