import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import MaterialView from "./pages/MaterialView";
import Quiz from "./pages/Quiz";
import TestSimulation from "./pages/TestSimulation";
import TestResults from "./pages/TestResults";
import TestSolutions from "./pages/TestSolutions";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><Landing /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/materials/:id" element={<MaterialView />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/test-simulation/:id" element={<TestSimulation />} />
              <Route path="/test-results/:id" element={<TestResults />} />
              <Route path="/test-solutions/:id" element={<TestSolutions />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:id" element={<ForumPost />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
