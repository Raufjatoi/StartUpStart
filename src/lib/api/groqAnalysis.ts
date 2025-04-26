import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

export async function analyzeWithGroq(idea: string): Promise<any> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a startup advisor analyzing business ideas."
        },
        {
          role: "user",
          content: `Analyze this startup idea: "${idea}"`
        }
      ],
      model: "compound-beta",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('Groq analysis failed:', error);
    throw error;
  }
}