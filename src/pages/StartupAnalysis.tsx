import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Clock, TrendingUp, BadgeDollarSign, Target, Brain, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyzeStartupDetailed } from '@/lib/api/startupAnalysis';

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316'];

const StartupAnalysis = () => {
  const [idea, setIdea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalysis = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!idea.trim()) {
      toast({
        title: "Please enter your startup idea",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeStartupDetailed(idea);
      setAnalysis(result);
      toast({
        title: "Analysis complete!",
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
        <div className="glass p-6 md:p-8 rounded-xl max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="h-8 w-8 text-startup-purple" />
            <h1 className="text-3xl font-bold">Startup Analysis</h1>
          </div>

          <Textarea
            placeholder="Describe your startup idea in detail..."
            className="min-h-[200px] mb-6"
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
              {/* Overview Section */}
              <div className="glass p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">{analysis.overview.title}</h2>
                <p className="text-gray-600 mb-4">{analysis.overview.summary}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-startup-purple/10 rounded-lg">
                    <p className="text-sm text-gray-600">Viability Score</p>
                    <p className="text-2xl font-bold text-startup-purple">{analysis.overview.viabilityScore}%</p>
                  </div>
                  <div className="p-4 bg-startup-purple/10 rounded-lg">
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="text-2xl font-bold text-startup-purple">{analysis.overview.riskLevel}</p>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              {analysis.marketAnalysis?.radarMetrics && (
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-startup-purple" />
                    Market Analysis
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={Object.entries(analysis.marketAnalysis.radarMetrics).map(([key, value]) => ({
                      subject: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                      value: value
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar name="Metrics" dataKey="value" fill="#8b5cf6" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Key Competitors</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.marketAnalysis.competitors.map((competitor: string, index: number) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-startup-purple/10 text-startup-purple">
                          {competitor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Analysis */}
              {analysis.technicalAnalysis && (
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Brain className="h-6 w-6 text-startup-purple" />
                    Technical Requirements
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.technicalAnalysis.techStack.map((tech: string, index: number) => (
                          <span key={index} className="px-3 py-1 rounded-full bg-startup-purple/10 text-startup-purple">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Timeline</h3>
                      <div className="space-y-2">
                        {analysis.technicalAnalysis.timeline.map((phase: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-startup-purple" />
                            <span>{phase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Analysis */}
              {analysis.financialProjections && (
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BadgeDollarSign className="h-6 w-6 text-startup-purple" />
                    Financial Analysis
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Revenue Projections</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analysis.financialProjections.revenueProjections}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Cost Breakdown</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analysis.financialProjections.costBreakdown}
                            dataKey="percentage"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {analysis.financialProjections.costBreakdown.map((_: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StartupAnalysis;








