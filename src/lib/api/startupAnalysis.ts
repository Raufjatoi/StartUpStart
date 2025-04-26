import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeStartupDetailed(idea: string): Promise<any> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an experienced startup advisor and analyst. Analyze the startup idea and provide detailed analysis with visualization-ready data. Return a clean JSON response with NO markdown formatting, NO code blocks, and NO additional text. Use realistic values and numbers for visualizations.

IMPORTANT: Return ONLY the JSON object with this exact structure:
{
  "overview": {
    "title": "Brief title for the idea",
    "summary": "Concise summary of the analysis",
    "viabilityScore": 75,
    "riskLevel": "Medium"
  },
  "marketAnalysis": {
    "radarMetrics": {
      "marketPotential": 8,
      "competitionLevel": 6,
      "entryBarriers": 7,
      "scalability": 9,
      "timing": 8
    },
    "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"]
  },
  "technicalAnalysis": {
    "feasibility": 8,
    "complexity": 7,
    "techStack": ["Tech 1", "Tech 2", "Tech 3"],
    "timeline": ["Phase 1: Planning", "Phase 2: Development", "Phase 3: Testing", "Phase 4: Launch"],
    "team": ["Frontend Developer", "Backend Developer", "UI/UX Designer", "Project Manager"]
  },
  "financialProjections": {
    "revenueProjections": [
      { "month": 1, "revenue": 0 },
      { "month": 6, "revenue": 50000 },
      { "month": 12, "revenue": 150000 }
    ],
    "costBreakdown": [
      { "category": "Development", "percentage": 40 },
      { "category": "Marketing", "percentage": 30 },
      { "category": "Operations", "percentage": 20 },
      { "category": "Other", "percentage": 10 }
    ]
  }
}`
        },
        {
          role: "user",
          content: `Analyze this startup idea in detail: "${idea}"`
        }
      ],
      model: "compound-beta",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    try {
      const cleanedResponse = response
        ?.replace(/```json\n?/g, '')
        ?.replace(/```\n?/g, '')
        ?.trim();
      
      const jsonData = JSON.parse(cleanedResponse || '{}');
      
      if (!idea.trim() || idea.length < 10) {
        return {
          overview: {
            title: "Insufficient Information",
            summary: "Please provide more details about your startup idea",
            viabilityScore: 0,
            riskLevel: "High"
          }
        };
      }
      
      return jsonData;
    } catch (e) {
      console.error('Failed to parse detailed analysis response:', e);
      throw new Error('Failed to generate detailed analysis. Please try again.');
    }
  } catch (error) {
    console.error('Detailed analysis error:', error);
    throw error;
  }
}
