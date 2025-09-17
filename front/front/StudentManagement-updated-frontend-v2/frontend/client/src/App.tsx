import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Welcome from "@/pages/Welcome";
import Students from "@/pages/students";
import Courses from "@/pages/courses";
import Enrollments from "@/pages/enrollments";
import Grades from "@/pages/grades";
import Reports from "@/pages/reports";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/students" component={Students} />
      <Route path="/courses" component={Courses} />
      <Route path="/enrollments" component={Enrollments} />
      <Route path="/grades" component={Grades} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  // Check if we're on the welcome page
  const isWelcomePage = location === "/" || location === "/welcome";
  const showLayoutComponents = !isWelcomePage;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Only show header and sidebar for pages that need them */}
          {showLayoutComponents && (
            <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
          )}
          
          <div className={`flex h-screen ${showLayoutComponents ? 'pt-20' : ''}`}>
            {showLayoutComponents && (
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            )}
            
            <main className={`flex-1 overflow-y-auto ${showLayoutComponents ? '' : 'pt-0'}`}>
              <Router />
            </main>
          </div>
          
          {/* Mobile sidebar overlay */}
          {sidebarOpen && showLayoutComponents && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;