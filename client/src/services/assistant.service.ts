
import api from "../api/assistant.api";

export async function sendAssistantMessage(message: string) {
  const response = await api.post("/assistant/chat", {
    message,
  });

  return response.data;
}