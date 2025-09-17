import { Bell, GraduationCap, Menu, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg h-20">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-blue-50/30 to-indigo-50/50 pointer-events-none"></div>
      
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-8 h-full">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-3 rounded-2xl hover:bg-white/60 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={onSidebarToggle}
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </Button>
          
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-6">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                EduManager
              </h1>
              <p className="text-xs font-semibold text-slate-500 -mt-1">Student Management System</p>
            </div>
          </div>
        </div>
        
        {/* Right Section - Search, Notifications, Profile */}
        <div className="flex items-center space-x-6">
          {/* Enhanced Search Bar */}
          <div className="hidden md:flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-white/80 group min-w-[320px]">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Search students, courses, grades..."
              className="bg-transparent border-none outline-none text-sm flex-1 p-0 placeholder:text-slate-400 text-slate-700 font-medium"
              data-testid="input-search"
            />
            <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              ⌘K
            </div>
          </div>
          
          {/* Enhanced Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg hover:bg-white/60 transition-all duration-200 transform hover:scale-105 group" 
            data-testid="button-notifications"
          >
            <Bell className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
              3
            </span>
          </Button>
          
          {/* Enhanced Profile Section */}
          <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30 shadow-md hover:shadow-lg hover:bg-white/60 transition-all duration-200 cursor-pointer group">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
                alt="User avatar" 
                className="w-10 h-10 rounded-2xl border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-200"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500 -mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
          </div>
        </div>
      </div>
    </header>
  );
}
