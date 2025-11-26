import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Zap, Target, BookOpen, Award, Edit2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ xp: 0, streak: 0, completed: 0, rank: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    grade: "",
    board: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: userData } = await api.get('/auth/me');
      setUser(userData);
      setEditForm({
        name: userData.name,
        grade: userData.grade || "",
        board: userData.board || "",
      });

      // Fetch Analytics for Stats
      const { data: analytics } = await api.get('/analytics');
      const { data: leaderboard } = await api.get('/leaderboard');
      const myRank = leaderboard.findIndex((u: any) => u._id === userData._id) + 1;

      setStats({
        xp: userData.xp || 0,
        streak: 1, // Mock
        completed: analytics.totalQuizzes || 0,
        rank: myRank > 0 ? myRank : '-',
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/profile', editForm);
      setUser(data);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="glass gradient-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white/20">
              <AvatarFallback className="text-3xl bg-white/20 text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade/Class</Label>
                        <Input
                          id="grade"
                          value={editForm.grade}
                          onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                          placeholder="e.g. 12th"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="board">Board</Label>
                        <Input
                          id="board"
                          value={editForm.board}
                          onChange={(e) => setEditForm({ ...editForm, board: e.target.value })}
                          placeholder="e.g. CBSE"
                        />
                      </div>
                      <Button type="submit" className="w-full gradient-primary">Save Changes</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-white/90 mb-4">
                {user?.grade ? `Class ${user.grade}` : 'Grade not set'} • {user?.board || 'Board not set'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
                  {user?.role}
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{stats.xp}</div>
              <div className="text-white/80">Total XP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">#{stats.rank}</p>
                <p className="text-sm text-muted-foreground">Global Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {user.badges.map((badge: string, index: number) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-xs text-center font-medium">{badge}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No badges earned yet. Keep learning!</p>
            )}
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center py-8">Take quizzes to see subject progress!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
