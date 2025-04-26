import { Bell, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/contexts/NotificationsContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function NotificationsPopover() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = async (notification: {
    id: string;
    read: boolean;
    link?: string;
  }) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    setIsOpen(false); // Close popover after clicking
    
    if (notification.link) {
      navigate(notification.link);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setIsOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80" 
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-8 px-4">
              <div className="bg-muted/50 p-3 rounded-full mb-4">
                <InboxIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h5 className="font-medium mb-2">No notifications yet</h5>
              <p className="text-sm text-muted-foreground text-center mb-4">
                When you receive notifications, they'll appear here. Stay tuned for updates about your projects, investments, and important announcements.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard');
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read ? 'bg-muted/50' : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{notification.title}</h5>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}


