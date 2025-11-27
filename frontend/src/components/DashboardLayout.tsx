import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";


export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton hideGetStarted showUserControls />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>

    </div>
  );
};
