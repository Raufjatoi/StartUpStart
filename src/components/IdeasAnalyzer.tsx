
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzeStartupIdea } from '@/lib/api/ideaAnalysis';
import { Loader2 } from 'lucide-react';

export default function IdeasAnalyzer() {
  const [idea, setIdea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!idea.trim()) {
      toast({
        title: "Please enter your startup idea",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeStartupIdea(idea);
      setAnalysis(result);
      toast({
        title: "Analysis complete!",
        description: "Scroll down to see the detailed analysis.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Startup Idea Analyzer</h2>
        <p className="text-gray-600 mb-4">
          Describe your startup idea in detail. Our AI will analyze its viability, investment needs, and provide a roadmap for success.
        </p>
        
        <Textarea
          placeholder="Enter your startup idea here..."
          className="min-h-[200px] mb-4"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <Button 
          className="w-full bg-startup-purple hover:bg-startup-purple/90"
          onClick={handleAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze My Idea'
          )}
        </Button>

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="glass p-6">
              <h3 className="text-xl font-semibold mb-3">Analysis Summary</h3>
              <p className="text-gray-600">{analysis.textSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6">
                <h3 className="text-xl font-semibold mb-3">Market Analysis</h3>
                <div className="space-y-2">
                  <p><strong>Potential:</strong> {analysis.analysis.marketAnalysis.potential}/10</p>
                  <p><strong>Market Size:</strong> {analysis.analysis.marketAnalysis.marketSize}</p>
                  <p><strong>Target Market:</strong> {analysis.analysis.marketAnalysis.targetMarket}</p>
                </div>
              </div>

              <div className="glass p-6">
                <h3 className="text-xl font-semibold mb-3">Technical Analysis</h3>
                <div className="space-y-2">
                  <p><strong>Feasibility:</strong> {analysis.analysis.technicalAnalysis.feasibility}/10</p>
                  <p><strong>Complexity:</strong> {analysis.analysis.technicalAnalysis.complexity}/10</p>
                  <p><strong>Time to MVP:</strong> {analysis.analysis.technicalAnalysis.developmentTimeline.monthsToMVP} months</p>
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <h3 className="text-xl font-semibold mb-3">Recommendations</h3>
              <ul className="list-disc list-inside space-y-2">
                {analysis.analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






