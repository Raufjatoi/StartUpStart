import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PricingPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      priceId: null,
      features: [
        "Basic AI Analysis",
        "3 Projects per month",
        "Community Support",
        "Basic Investment Insights",
        "Limited AI Chat",
      ],
      buttonText: "Get Started",
      highlight: false,
    },
    {
      name: "Premium",
      price: "$2",
      period: "/month",
      priceId: "price_xxxxx", // Replace with your actual Stripe price ID
      features: [
        "Everything in Free",
        "Voice Call with Voice AI Agents",
        "Unlimited Projects",
        "Priority Support",
        "Advanced AI Analysis",
      ],
      buttonText: "Upgrade Now",
      highlight: true,
    }
  ];

  const handlePlanSelect = async (plan: any) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    if (!plan.priceId) {
      toast({
        title: "Free Plan",
        description: "You're already on the free plan!",
      });
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-[#FFF1EA] to-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#3B82F6] mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-600">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl p-8 bg-white shadow-lg ${
              plan.highlight ? 'border-2 border-[#3B82F6]' : ''
            }`}
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-[#3B82F6] mb-4">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-[#3B82F6] mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handlePlanSelect(plan)}
              className={`w-full h-12 rounded-xl ${
                plan.highlight
                  ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;

