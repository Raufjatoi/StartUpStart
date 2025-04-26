import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { 
  Lightbulb, 
  Rocket, 
  LineChart, 
  Plus,
  ArrowRight,
  User,
  Bell,
  MessageCircle,
  LogOut,
  Home,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { useNotifications } from "@/contexts/NotificationsContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import VoiceChat from '@/components/VoiceChat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUpcomingDialog, setShowUpcomingDialog] = useState(false);
  const [upcomingFeatureInfo, setUpcomingFeatureInfo] = useState({
    title: '',
    description: ''
  });

  const handleUpcomingFeature = (feature: string) => {
    if (feature === 'project') {
      setUpcomingFeatureInfo({
        title: 'Projects Feature Coming Soon!',
        description: "We're currently developing this feature to help you manage your startup projects effectively. Stay tuned for updates!"
      });
    } else {
      setUpcomingFeatureInfo({
        title: 'Investments Feature Coming Soon!',
        description: "We're working on bringing you powerful investment tracking tools. This feature is currently in development."
      });
    }
    setShowUpcomingDialog(true);
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const { data: investments, error: investmentsError } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (investmentsError) throw investmentsError;

      setUserData({
        id: user.id,
        full_name: profile?.full_name || '',
        avatar_url: profile?.avatar_url,
        projects: projects || [],
        investments: investments || [],
      });
    } catch (error: any) {
      toast({
        title: "Error fetching dashboard data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-startup-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
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

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-auto"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <nav className="flex flex-col h-full">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
                <div className="flex-1 px-6 py-4 space-y-2">
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-5 w-5 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/notifications" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link to="/chat" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Messages
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </div>
                <div className="px-6 py-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/chat')}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                {userData?.avatar_url ? (
                  <img 
                    src={userData.avatar_url} 
                    alt="Profile" 
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 relative z-10">
        {/* Welcome Section */}
        <div className="glass p-6 md:p-8 rounded-xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-startup-purple" />
            <h1 className="text-3xl font-bold">Welcome, {userData?.full_name}</h1>
          </div>
          <p className="text-gray-600">
            Manage your startup projects and investments from your personal dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects Section */}
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-startup-purple" />
                <h2 className="text-xl font-semibold">Your Projects</h2>
              </div>
              <Button 
                size="sm" 
                className="bg-startup-purple hover:bg-startup-purple/90"
                onClick={() => handleUpcomingFeature('project')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            
            <div className="text-center py-8">
              <Rocket className="h-12 w-12 mx-auto text-startup-purple mb-4" />
              <p className="text-gray-600 mb-4">Project management features are coming soon!</p>
              <Button 
                variant="ghost" 
                className="text-startup-purple hover:text-startup-purple/80"
                onClick={() => handleUpcomingFeature('project')}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Investments Section */}
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LineChart className="h-6 w-6 text-startup-orange" />
                <h2 className="text-xl font-semibold">Your Investments</h2>
              </div>
              <Button 
                size="sm" 
                className="bg-startup-orange hover:bg-startup-orange/90"
                onClick={() => handleUpcomingFeature('investment')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Investment
              </Button>
            </div>
            
            <div className="text-center py-8">
              <LineChart className="h-12 w-12 mx-auto text-startup-orange mb-4" />
              <p className="text-gray-600 mb-4">Investment tracking features are coming soon!</p>
              <Button 
                variant="ghost" 
                className="text-startup-orange hover:text-startup-orange/80"
                onClick={() => handleUpcomingFeature('investment')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        {/* Add Voice Chat at the bottom */}
        <div className="fixed bottom-6 right-6">
          <VoiceChat />
        </div>

        {/* Upcoming Feature Dialog */}
        <Dialog open={showUpcomingDialog} onOpenChange={setShowUpcomingDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-startup-purple" />
                {upcomingFeatureInfo.title}
              </DialogTitle>
              <DialogDescription>
                {upcomingFeatureInfo.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-500">
                We're currently:
                <ul className="list-disc ml-6 mt-2">
                  <li>Securing funding for development</li>
                  <li>Building the infrastructure</li>
                  <li>Testing with beta users</li>
                </ul>
              </p>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpcomingDialog(false)}
                >
                  Got it
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;











