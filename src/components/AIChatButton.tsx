import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getChatResponse } from "@/lib/api/geminiChat";

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean, isTyping?: boolean}[]>([
    {
      text: "Hi! I'm your AI assistant for StartUpStart, created by Abdul Rauf and Muhammad Owais Dehri. How can I help you learn more about our platform?",
      isUser: false
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string) => {
    // Add temporary message with typing indicator
    setMessages(prev => [...prev, { text: "", isUser: false, isTyping: true }]);
    
    // Simulate typing delay based on message length
    const minDelay = 500;
    const maxDelay = 1500;
    const typingDelay = Math.min(maxDelay, Math.max(minDelay, response.length * 20));
    
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    // Replace typing indicator with actual message
    setMessages(prev => [
      ...prev.slice(0, -1),
      { text: response, isUser: false }
    ]);
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputText("");
    setIsLoading(true);
    
    try {
      const response = await getChatResponse(userMessage);
      await simulateTyping(response);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble responding right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-startup-purple hover:bg-startup-purple/90 shadow-lg flex items-center justify-center p-0 hover:scale-105 transition-transform duration-200"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl flex flex-col animate-scale-in z-50">
          <div className="flex items-center justify-between bg-startup-purple text-white px-4 py-3 rounded-t-xl">
            <h3 className="font-medium">StartUpStart Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-startup-purple-dark"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`
                  ${message.isUser ? 'ml-8' : 'mr-8'}
                  animate-fade-in
                `}
              >
                <div className={`
                  p-3 rounded-lg
                  ${message.isUser 
                    ? 'bg-startup-purple/10' 
                    : 'bg-gray-100'
                  }
                `}>
                  {message.isTyping ? (
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-startup-purple/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-startup-purple/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-startup-purple/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                    <div className="animate-fade-in">{message.text}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Textarea 
                placeholder="Ask about StartUpStart..."
                className="resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                className={`
                  bg-startup-purple hover:bg-startup-purple/90
                  transition-all duration-200
                  ${isLoading ? 'opacity-70' : 'hover:scale-105'}
                `}
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatButton;



