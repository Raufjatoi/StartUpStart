import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getChatResponse } from "@/lib/api/geminiChat";
import { ArrowLeft, Home, MessageCircle, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState<{text: string, isUser: boolean, isTyping?: boolean}[]>([
    {
      text: "Hi! I'm your AI assistant for StartUpStart, created by Abdul Rauf and Muhammad Owais Dehri. How can I help you learn more about our platform?",
      isUser: false
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string) => {
    // Add a temporary message with typing indicator
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
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Background */}
      <div className="dynamic-bg"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-startup-purple to-[#1EAEDB] bg-clip-text text-transparent">
              StartUpStart
            </span>
          </Link>

          <div className="flex items-center space-x-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-startup-purple/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-startup-purple/10"
            >
              <Link to="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 relative z-10">
        <div className="glass p-6 md:p-8 rounded-xl max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="h-8 w-8 text-startup-purple" />
            <h1 className="text-3xl font-bold">Chat Assistant</h1>
          </div>

          <div className="h-[500px] overflow-y-auto mb-6 space-y-4 p-4 rounded-lg bg-background/50">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`
                  ${message.isUser ? 'ml-12' : 'mr-12'}
                  animate-fade-in
                `}
              >
                <div className={`
                  p-4 rounded-lg
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
      </main>
    </div>
  );
}
