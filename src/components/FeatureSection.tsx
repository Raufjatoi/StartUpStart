
import { CircleCheck, BadgeDollarSign, Users, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureSection = () => {
  const features = [
    {
      icon: <Rocket className="h-6 w-6 text-startup-purple" />,
      title: "Idea Analysis",
      description: "Get detailed analysis of your startup idea with AI-powered insights on viability and market potential.",
      link: "#analyzer",
    },
    {
      icon: <BadgeDollarSign className="h-6 w-6 text-startup-purple" />,
      title: "Investment Estimation",
      description: "Calculate how much capital you'll need to bring your idea to life with accurate financial projections.",
      link: "#investment-cards",
    },
    {
      icon: <Users className="h-6 w-6 text-startup-purple" />,
      title: "Team Building",
      description: "Discover the ideal team structure and key roles needed to execute your vision successfully.",
      link: "#analyzer",
    },
    {
      icon: <CircleCheck className="h-6 w-6 text-startup-purple" />,
      title: "Roadmap Creation",
      description: "Get a detailed timeline and milestone plan for turning your idea into a successful business.",
      link: "#pricing",
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            How StartUpStart Helps You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything young entrepreneurs need to validate, plan, and launch their startup ideas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <a 
              key={index} 
              href={feature.link}
              className="glass p-6 rounded-xl card-hover transition-all duration-300 hover:scale-105"
            >
              <div className="bg-startup-purple/10 rounded-full p-3 inline-flex mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

