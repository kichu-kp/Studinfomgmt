import { useState } from 'react';
import { GraduationCap, Users, BookOpen, TrendingUp, Award, ArrowRight, ChevronRight, BarChart3, Calendar, Bell } from 'lucide-react';

export default function WelcomePage() {
  const [isHovered, setIsHovered] = useState(false);

  const handleGetStarted = () => {
    // This would redirect to dashboard in your actual app
    window.location.href = '/dashboard';
  };

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Track and manage all student records, enrollment details, and academic progress in one place"
    },
    {
      icon: BookOpen,
      title: "Course Administration",
      description: "Organize courses, manage curricula, and monitor course performance with comprehensive tools"
    },
    {
      icon: Award,
      title: "Grade Tracking",
      description: "Record, analyze, and report student grades with advanced analytics and performance insights"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Generate detailed reports and gain insights with powerful analytics and visualization tools"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Managed", color: "from-blue-500 to-blue-600" },
    { number: "500+", label: "Courses Available", color: "from-green-500 to-green-600" },
    { number: "50+", label: "Institutions Using", color: "from-purple-500 to-purple-600" },
    { number: "99.9%", label: "Uptime Guaranteed", color: "from-orange-500 to-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 bg-white/30 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  EduManager
                </h1>
                <p className="text-xs font-semibold text-slate-500 -mt-1">Student Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30 shadow-md">
                <span className="text-sm font-semibold text-slate-700">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 shadow-lg mb-8">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-slate-700">Welcome to your Admin Dashboard</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Welcome,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Administrator
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 font-medium mb-4 max-w-4xl mx-auto leading-relaxed">
            Manage your institution with powerful tools to track students, 
            monitor academic progress, and generate comprehensive reports.
          </p>
          
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
            Everything you need to efficiently manage student records, course administration, 
            and academic performance in one comprehensive platform.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-xl font-bold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 mr-3">Get Started</span>
            <ArrowRight className={`h-6 w-6 relative z-10 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.number}
              </div>
              <div className="text-sm font-semibold text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
                <div className="flex items-start space-x-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-lg group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-white/30 shadow-xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto font-medium">
              Access your comprehensive dashboard to manage students, courses, grades, and generate detailed reports.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-bold text-lg group"
            >
              Enter Dashboard
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}