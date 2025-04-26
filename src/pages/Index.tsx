
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import IdeasAnalyzer from "@/components/IdeasAnalyzer";
import FeatureSection from "@/components/FeatureSection";
import InvestmentCards from "@/components/InvestmentCards";
import PricingPlans from "@/components/PricingPlans";
import AIChatButton from "@/components/AIChatButton";
import { useAuth } from '@/contexts/AuthContext';
import VoiceChat from '@/components/VoiceChat';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Background */}
      <div className="dynamic-bg"></div>
      
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <div id="analyzer" className="scroll-mt-20">
          <IdeasAnalyzer />
        </div>
        
        <FeatureSection />
        
        <InvestmentCards />
        
        <PricingPlans />
      </main>
      
      <Footer />
      
      {/* Always show AIChatButton */}
      <AIChatButton />
      
      {/* Show VoiceChat only when user is logged in */}
      {user && (
        <div className="fixed bottom-6 right-20">
          <VoiceChat />
        </div>
      )}
    </div>
  );
};

export default Index;


