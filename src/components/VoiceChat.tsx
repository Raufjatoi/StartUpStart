import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Phone, PhoneOff, Lock } from 'lucide-react';
import { startVoiceChat } from '@/lib/api/vapiAgent';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VoiceChat = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const callRef = useRef<any>(null);
  const { toast } = useToast();
  const { user, isPremium } = useAuth(); // Make sure isPremium is available in your AuthContext

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
        setRemainingTime(prev => prev - 1);

        if (remainingTime <= 1) {
          handleEndCall();
          toast({
            title: "Call ended",
            description: "Upgrade to premium for unlimited voice chat!",
            variant: "default",
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive, remainingTime]);

  const handleStartCall = async () => {
    if (!isPremium) {
      setShowUpgradeDialog(true);
      return;
    }

    try {
      console.log('Starting voice chat...');
      const call = await startVoiceChat();
      callRef.current = call;
      setIsCallActive(true);
      
      toast({
        title: "Voice chat started",
        description: "You can start speaking now",
      });
    } catch (error: any) {
      console.error('Failed to start voice chat:', error);
      toast({
        title: "Failed to start voice chat",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEndCall = () => {
    if (callRef.current) {
      console.log('Ending call...');
      callRef.current.end();
      callRef.current = null;
    }
    setIsCallActive(false);
    setCallDuration(0);
    setRemainingTime(300);
    toast({
      title: "Call ended",
      description: "Thanks for trying our voice chat feature!",
    });
  };

  const handleToggleMute = () => {
    if (callRef.current) {
      if (isMuted) {
        callRef.current.unmute();
      } else {
        callRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 w-64 bg-white rounded-xl shadow-2xl p-4">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-1">AI Voice Chat</h3>
          {!isCallActive ? (
            <p className="text-sm text-gray-600">Try our voice assistant!</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Call duration: {formatTime(callDuration)}</p>
              {!isPremium && (
                <p className="text-sm text-startup-purple">
                  Remaining: {formatTime(remainingTime)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {!isCallActive ? (
            <Button
              onClick={handleStartCall}
              className="bg-startup-purple hover:bg-startup-purple-dark"
            >
              <Phone className="h-5 w-5 mr-2" />
              Start Call
            </Button>
          ) : (
            <>
              <Button
                onClick={handleToggleMute}
                variant={isMuted ? "destructive" : "outline"}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                onClick={handleEndCall}
                variant="destructive"
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-startup-purple" />
              Premium Feature
            </DialogTitle>
            <DialogDescription>
              Voice chat is a premium feature. Upgrade your account to enjoy unlimited AI voice conversations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Link to="/pricing">
              <Button className="bg-startup-purple hover:bg-startup-purple/90">
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default VoiceChat;

