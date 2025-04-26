import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeStartupIdea(idea: string): Promise<any> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an experienced startup advisor and analyst. Analyze the startup idea and provide a professional analysis. Return a clean JSON response with NO markdown formatting, NO code blocks, and NO additional text. Use realistic values (never use "Unknown" or "Undefined"). For vague ideas, provide constructive feedback about what's missing.

IMPORTANT: Return ONLY the JSON object with no surrounding text or markdown.

Example response format (do not include these comments, only the JSON):
{
  "textSummary": "A clear, professional paragraph summarizing the analysis",
  "analysis": {
    "summary": "A concise overview of the idea's viability",
    "marketAnalysis": {
      "potential": 7,
      "marketSize": "$10B - $15B annually",
      "targetMarket": "Small to medium-sized businesses in the tech sector",
      "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
      "marketTrends": ["Trend 1", "Trend 2", "Trend 3"],
      "barriers": ["Barrier 1", "Barrier 2"]
    },
    "technicalAnalysis": {
      "feasibility": 8,
      "complexity": 6,
      "developmentTimeline": {
        "monthsToMVP": 4,
        "phases": [
          {
            "name": "Phase 1",
            "duration": "2 months",
            "description": "Phase description"
          }
        ]
      }
    },
    "recommendations": [
      "Specific recommendation 1",
      "Specific recommendation 2",
      "Specific recommendation 3"
    ]
  }
}`
        },
        {
          role: "user",
          content: `Analyze this startup idea: "${idea}"`
        }
      ],
      model: "compound-beta",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    
    try {
      // Clean the response of any potential markdown or code block syntax
      const cleanedResponse = response
        ?.replace(/```json\n?/g, '')
        ?.replace(/```\n?/g, '')
        ?.trim();
      
      const jsonData = JSON.parse(cleanedResponse || '{}');
      
      // Handle empty or very short ideas
      if (!idea.trim() || idea.length < 10) {
        return {
          textSummary: "The provided idea needs more detail for a comprehensive analysis. Please elaborate on your concept, target market, and unique value proposition.",
          analysis: {
            summary: "Insufficient information provided for detailed analysis",
            marketAnalysis: {
              potential: 1,
              marketSize: "$0 - requires more specific idea details",
              targetMarket: "To be determined - please specify target audience",
              competitors: ["Requires specific industry context"],
              marketTrends: ["Requires industry context"],
              barriers: ["Lack of clear value proposition", "Insufficient detail"]
            },
            technicalAnalysis: {
              feasibility: 1,
              complexity: 1,
              developmentTimeline: {
                monthsToMVP: 1,
                phases: [
                  {
                    name: "Initial Planning",
                    duration: "1 month",
                    description: "Define core concept and requirements"
                  }
                ]
              }
            },
            recommendations: [
              "Define your core value proposition clearly",
              "Identify specific target market segments",
              "Research potential competitors",
              "Develop detailed technical requirements"
            ]
          }
        };
      }
      
      return jsonData;
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Failed to generate analysis. Please try again.');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

async function getGithubTrends() {
  try {
    const response = await fetch('https://api.github.com/search/repositories?q=stars:>1000&sort=stars');
    const data = await response.json();
    return data.items.slice(0, 5).map((item: any) => item.name);
  } catch (error) {
    console.error('Error fetching GitHub trends:', error);
    return [];
  }
}

function calculateCosts(techAnalysis: any) {
  // Simple cost estimation based on team size and duration
  const monthlyRate = 10000; // Average monthly cost per person
  const teamSize = techAnalysis.team.size;
  const months = techAnalysis.timeline.months;

  const baseCost = teamSize * monthlyRate * months;
  
  return {
    min: Math.round(baseCost * 0.8), // 20% margin lower
    max: Math.round(baseCost * 1.2), // 20% margin higher
    breakdown: {
      "Personnel": Math.round(baseCost * 0.7),
      "Infrastructure": Math.round(baseCost * 0.15),
      "Marketing": Math.round(baseCost * 0.1),
      "Miscellaneous": Math.round(baseCost * 0.05),
    }
  };
}















