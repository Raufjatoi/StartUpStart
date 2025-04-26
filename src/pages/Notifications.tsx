import { useNotifications } from "@/contexts/NotificationsContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, InboxIcon, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: {
    id: string;
    read: boolean;
    link?: string;
  }) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
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
        <div className="glass p-6 md:p-8 rounded-xl max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="h-8 w-8 text-startup-purple" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>

          {unreadCount > 0 && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => markAllAsRead()}
                className="text-startup-purple hover:bg-startup-purple/10"
              >
                Mark all as read
              </Button>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted/50 p-3 rounded-full mb-4 w-fit mx-auto">
                <InboxIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="font-medium mb-2">No notifications yet</h2>
              <p className="text-sm text-muted-foreground mb-4">
                When you receive notifications, they'll appear here. Stay tuned for updates about your projects, investments, and important announcements.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="text-startup-purple hover:bg-startup-purple/10"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-muted/50' 
                      : 'bg-muted hover:bg-muted/80 border border-startup-purple/20'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
