import LandingPage from "./LandingPage";
import ChatPage from "./ChatPage";
import ChatInput from "./ChatInput";
import { useAssistant } from "../../hooks/useAssistant";
import ShoppingPlanCard from "./cards/ShoppingPlanCard";

const AssistantPage: React.FC = () => {
  const {
    input,
    setInput,
    messages,
    isLoading,
    shoppingPlan, 
    handleOptimizePlan, 
    handleSendMessage,
    clearConversation,
    handleCompare,
    handleRemoveFromPlan, 
    handleAddToPlan,

  } = useAssistant();
  const hasConversation = messages.length > 0;
  return (
    <div className="min-h-[calc(100vh-90px)] bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6C63FF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF6B9D] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-[#6C63FF] to-[#FF6B9D] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-10">
        {hasConversation ? (
          <>
            <ChatPage
              messages={messages}
              isLoading={isLoading}
              onBack={clearConversation}
              onClear={clearConversation}
              onCompare={handleCompare}
             onAddToPlan={handleAddToPlan}

            />

 <ShoppingPlanCard
      items={shoppingPlan}
onOptimize= {handleOptimizePlan}
onRemove={handleRemoveFromPlan}
onAdd = {handleAddToPlan}

      
    />
            <ChatInput
              input={input}
              onInputChange={setInput}
              onSend={() => handleSendMessage(input)}
              isLoading={isLoading}
              placeholder="Ask about groceries..."
            />
          </>
        ) : (
          <LandingPage
            onSend={handleSendMessage}
            setInput={setInput}
            input={input}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AssistantPage;
