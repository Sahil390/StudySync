import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Zap, Clock, TrendingUp, Target, Bell } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import api from "@/lib/api";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ xp: 0, streak: 0, completed: 0, rank: 0 });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get User Data
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }

        // Fetch Analytics
        const { data: analytics } = await api.get('/analytics');

        // Fetch Leaderboard for Rank
        const { data: leaderboard } = await api.get('/leaderboard');
        const myRank = leaderboard.findIndex((u: any) => u._id === user?._id) + 1;

        // Fetch Quizzes
        const { data: quizList } = await api.get('/quiz');

        // Fetch Notifications (as Activity)
        const { data: notifications } = await api.get('/notifications');

        setStats({
          xp: analytics.xp || 0,
          streak: 1, // Mock streak for now
          completed: analytics.totalQuizzes || 0,
          rank: myRank > 0 ? myRank : '-',
        });

        setSubjects(analytics.subjectAnalytics.map((s: any) => ({
          name: s.subject,
          progress: Math.round(s.accuracy)
        })));

        setQuizzes(quizList.slice(0, 3));

        setActivities(notifications.slice(0, 3).map((n: any) => ({
          title: n.message,
          time: new Date(n.createdAt).toLocaleDateString(),
          icon: Bell,
          color: "gradient-accent"
        })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-white/90 text-lg">You're making great progress. Keep it up!</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">{stats.xp}</p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-3xl font-bold text-warning">{stats.streak} Day</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                <p className="text-3xl font-bold text-success">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">#{stats.rank}</p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.length > 0 ? subjects.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">{subject.progress}% Accuracy</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            )) : <p className="text-muted-foreground">No quiz data yet. Take a quiz to see your progress!</p>}
            <NavLink to="/materials">
              <Button className="w-full gradient-primary border-0 mt-4">
                Browse All Materials
              </Button>
            </NavLink>
          </CardContent>
        </Card>

        {/* Upcoming Quizzes */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              Available Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizzes.length > 0 ? quizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{quiz.title}</p>
                  <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                </div>
                <Badge variant="secondary">
                  {quiz.grade}
                </Badge>
              </div>
            )) : <p className="text-muted-foreground">No quizzes available.</p>}
            <NavLink to="/quiz">
              <Button variant="outline" className="w-full mt-4">
                View All Quizzes
              </Button>
            </NavLink>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}>
                  <activity.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )) : <p className="text-muted-foreground">No recent notifications.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
