import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Book, ClipboardList, TrendingUp, ArrowUp } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      change: "+8.2%",
      changeType: "positive",
      bgGradient: "from-blue-400 to-blue-600",
      cardGradient: "from-blue-50 to-blue-100",
      shadowColor: "shadow-blue-200",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Courses",
      value: stats?.activeCourses || 0,
      icon: Book,
      change: "+12.1%",
      changeType: "positive",
      bgGradient: "from-green-400 to-green-600",
      cardGradient: "from-green-50 to-green-100",
      shadowColor: "shadow-green-200",
      borderColor: "border-green-200",
    },
    {
      title: "Total Enrollments",
      value: stats?.totalEnrollments || 0,
      icon: ClipboardList,
      change: "+5.4%",
      changeType: "positive",
      bgGradient: "from-purple-400 to-purple-600",
      cardGradient: "from-purple-50 to-purple-100",
      shadowColor: "shadow-purple-200",
      borderColor: "border-purple-200",
    },
    {
      title: "Average Grade",
      value: stats?.averageGrade?.toFixed(2) || "0.00",
      icon: TrendingUp,
      change: "+2.1%",
      changeType: "positive",
      bgGradient: "from-orange-400 to-orange-600",
      cardGradient: "from-orange-50 to-orange-100",
      shadowColor: "shadow-orange-200",
      borderColor: "border-orange-200",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Header Section */}
        <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-4">
              <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-64 mb-3 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-96 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl">
                <CardContent className="p-8">
                  <div className="h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-testid="page-dashboard">
      {/* Hero Header Section */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
              Dashboard Overview
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Welcome back! Here's what's happening at your institution today
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 mt-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className={`group bg-white/80 backdrop-blur-sm border-2 ${stat.borderColor} ${stat.shadowColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 rounded-3xl overflow-hidden`}
                data-testid={`card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.cardGradient} rounded-full opacity-30 -translate-y-16 translate-x-16`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
                          {stat.title}
                        </p>
                        <p className="text-4xl font-black text-slate-800 group-hover:scale-110 transition-transform duration-200" 
                           data-testid={`text-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-16 h-16 bg-gradient-to-br ${stat.bgGradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className={`bg-gradient-to-r ${stat.cardGradient} px-4 py-3 rounded-2xl border ${stat.borderColor}`}>
                      <div className="flex items-center text-sm">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full flex items-center font-bold text-xs">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {stat.change}
                        </div>
                        <span className="text-slate-600 ml-3 font-medium">from last month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-12 translate-x-12"></div>
              <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center">
                <ClipboardList className="h-6 w-6 mr-3 text-blue-600" />
                Recent Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-slate-100 to-blue-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ClipboardList className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Recent Enrollments</h3>
                  <p className="text-slate-500">New student enrollments will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -translate-y-12 translate-x-12"></div>
              <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-slate-100 to-green-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Performance Data</h3>
                  <p className="text-slate-500">Course performance metrics will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}