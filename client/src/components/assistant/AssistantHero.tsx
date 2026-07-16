import { useState } from "react";
import { useUser } from "../../context/userProfile";
import { Message } from "../../types/assistant";

const AssistantHero = () => {
  const { user } = useUser();
  const [input, setInput] = useState<string>("");
  const [message, setMessage] = useState<Message[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSend = async (): Promise<void> => {
    if (!input.trim || loading) return;
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessage((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  };

  return (
    <div className="max-w-4xl mx-auto  px-4 my-4 ">
      <div className="mb-5">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">👋 Hi Mukta</h1>
        <p className="text-xl text-gray-600">What do you need today?</p>
      </div>

      {/* chat message */}
    </div>
  );
};

export default AssistantHero;
