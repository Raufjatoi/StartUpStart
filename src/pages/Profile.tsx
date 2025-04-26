import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { User, Mail, Camera, Loader2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
  });

  useEffect(() => {
    getProfile();
  }, [user]);

  const getProfile = async () => {
    try {
      if (!user) return;

      // First check if profile exists
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('count')
        .eq('id', user.id)
        .single();

      if (checkError) {
        console.error('Error checking profile:', checkError);
        throw checkError;
      }

      // If profile doesn't exist, create it
      if (!profileExists || profileExists.count === 0) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: '',
              avatar_url: null
            }
          ]);

        if (insertError) throw insertError;
      }

      // Now fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload a JPG, PNG or GIF.');
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 2MB.');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Math.random()}.${fileExt}`; // Simplified file name
      const filePath = `${fileName}`; // Store directly in bucket root

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar_url: publicUrl });
      
      toast({
        title: "Avatar updated successfully",
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading avatar",
        description: error.message || 'An error occurred while uploading the avatar',
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
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
            <User className="h-8 w-8 text-startup-purple" />
            <h1 className="text-3xl font-bold">Your Profile</h1>
          </div>

          {/* Avatar Preview */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-100">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', profile.avatar_url);
                    e.currentTarget.src = ''; // Clear the broken image
                    e.currentTarget.className = 'hidden'; // Hide the broken image
                  }}
                />
              ) : (
                <User className="w-full h-full p-6 text-gray-400" />
              )}
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="full_name"
                  type="text"
                  className="pl-10"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="pl-10 opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="relative">
                <Camera className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="avatar"
                  type="file"
                  className="pl-10"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingImage}
                />
              </div>
              {uploadingImage && (
                <div className="flex items-center gap-2 text-sm text-startup-purple">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading image...</span>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={updating || uploadingImage}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;



