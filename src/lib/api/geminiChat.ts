import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const systemPrompt = `You are an AI assistant for StartUpStart platform, created by Abdul Rauf and Muhammad Owais Dehri.
    Key points about the platform:
    - It's a startup analysis and advisory platform
    - Uses AI to analyze startup ideas and provide detailed feedback
    - Offers features like market analysis, technical feasibility, and investment estimates
    - Has different pricing plans including a free tier
    
    Important guidelines:
    1. Always mention that the platform is created by Abdul Rauf and Muhammad Owais Dehri
    2. Focus responses on StartUpStart's features and capabilities
    3. If asked about unrelated topics, politely redirect to platform information
    4. Be friendly and professional
    5. Keep responses concise and informative`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Who created this platform?" }]
        },
        {
          role: "model",
          parts: [{ text: "StartUpStart was created by Abdul Rauf and Muhammad Owais Dehri. They developed this innovative platform to help entrepreneurs analyze and validate their startup ideas using AI technology." }]
        }
      ],
    });

    const result = await chat.sendMessage([
      {
        text: `${systemPrompt}\n\nUser message: ${userMessage}`
      }
    ]);
    
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I apologize, but I'm having trouble connecting right now. Please try again later.";
  }
}
