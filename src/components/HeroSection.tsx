
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-startup-purple to-[#1EAEDB] bg-clip-text text-transparent">
            Your Startup Journey Starts Here
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your startup idea into reality with our AI-powered platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="text-lg py-6 px-8 bg-startup-purple hover:bg-startup-purple/90"
              asChild
            >
              <Link to="/analyze" className="flex items-center gap-2">
                Analyze My Startup Idea
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            {!user && (
              <Button 
                variant="outline" 
                className="text-lg py-6 px-8 border-startup-purple text-startup-purple hover:bg-startup-purple/10"
                asChild
              >
                <Link to="/signup">
                  Create Account
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10">
        {/* Background elements */}
      </div>
    </section>
  );
};

export default HeroSection;




