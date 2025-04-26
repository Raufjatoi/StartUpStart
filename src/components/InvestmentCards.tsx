import { ExternalLink, Mail, Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";  // Updated import path
import { Link } from "react-router-dom";

const InvestmentCards = () => {
  const { toast } = useToast();
  const { user, isPremium } = useAuth(); // Assuming you have isPremium in your auth context
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const projects = [
    {
      title: "Mocka AI",
      description: "Interview Practice with AI - Get ready for your next job interview with AI-powered practice sessions.",
      image: "proj1.png",
      link: "https://mocka-eosin.vercel.app",
      contact: "raufpokemon00@icloud.com"
    },
    {
      title: "Multilingual Chatbot",
      description: "A Chatbot that can chat in multiple languages using Compound Beta - GROQ.",
      image:"proj2.png",
      link: "https://multilingual-chatbot-three.vercel.app/",
      contact: "raufpokemon00@gmail.com"
    },
    {
      title: "Share Store",
      description: "Buy with things and not money",
      image: "proj3.png",
      link: "https://share-store.vercel.app/",
      contact: "raufpokemon00@gmail.com"
    },
  ];

  const handleContact = (projectTitle: string, email: string) => {
    // You could implement actual email functionality here
    toast({
      title: "Contact Request",
      description: `Contact information for ${projectTitle}: ${email}`,
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Please upgrade to premium to add your project for investment.",
        variant: "destructive",
      });
      setIsDialogOpen(false);
      return;
    }
    // Handle project addition logic here
    toast({
      title: "Project Added",
      description: "Your project has been successfully added for investment.",
    });
    setIsDialogOpen(false);
  };

  return (
    <section id="investment-cards" className="my-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Investment Opportunities</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Explore these exciting projects from our ecosystem that are looking for investment and support.
        </p>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-startup-purple hover:bg-startup-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Your Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            {isPremium ? (
              <>
                <DialogHeader>
                  <DialogTitle>Add Your Project for Investment</DialogTitle>
                  <DialogDescription>
                    Fill in the details about your project to list it for potential investors.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProject} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Project Title</label>
                    <Input id="title" placeholder="Enter project title" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your project..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">Project Image URL</label>
                    <Input id="image" type="url" placeholder="https://..." required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="link" className="text-sm font-medium">Project Link</label>
                    <Input id="link" type="url" placeholder="https://..." required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact" className="text-sm font-medium">Contact Email</label>
                    <Input id="contact" type="email" placeholder="contact@example.com" required />
                  </div>
                  <Button type="submit" className="w-full bg-startup-purple hover:bg-startup-purple/90">
                    Submit Project
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <Lock className="h-12 w-12 mx-auto text-startup-purple mb-4" />
                <DialogTitle className="mb-2">Premium Feature</DialogTitle>
                <DialogDescription className="mb-4">
                  Adding projects for investment is a premium feature. Upgrade your account to access this and many other exclusive features.
                </DialogDescription>
                <Link to="/pricing">
                  <Button className="bg-startup-purple hover:bg-startup-purple/90">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-transform duration-300 hover:scale-105"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden">
                {project.description}
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-startup-purple hover:bg-startup-purple/90 transition-colors"
                  onClick={() => window.open(project.link, '_blank')}
                >
                  <span className="flex items-center gap-2">
                    Visit Project
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-startup-purple text-startup-purple hover:bg-startup-purple/10"
                  onClick={() => handleContact(project.title, project.contact)}
                >
                  <span className="flex items-center gap-2">
                    Contact Team
                    <Mail className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InvestmentCards;



