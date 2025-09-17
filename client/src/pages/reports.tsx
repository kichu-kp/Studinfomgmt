import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { dashboardApi, studentsApi, coursesApi, gradesApi, enrollmentsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, BookOpen, TrendingUp, BarChart3, Download, PieChart, Activity, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from 'react';

export default function Reports() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const { data: enrollments } = useQuery({
    queryKey: ["/api/enrollments"],
    queryFn: () => enrollmentsApi.getAll(),
  });

  const enrollmentCount = enrollments ? enrollments.length : (stats?.totalEnrollments || 0);

  const reportCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      bgGradient: "from-blue-400 to-blue-600",
      cardGradient: "from-blue-50 to-blue-100",
      shadowColor: "shadow-blue-200",
      borderColor: "border-blue-200",
      change: "+12.5%",
    },
    {
      title: "Total Enrollments",
      value: enrollmentCount,
      icon: BookOpen,
      bgGradient: "from-green-400 to-green-600",
      cardGradient: "from-green-50 to-green-100",
      shadowColor: "shadow-green-200",
      borderColor: "border-green-200",
      change: "+8.3%",
    },
    {
      title: "Active Courses",
      value: stats?.activeCourses || 0,
      icon: TrendingUp,
      bgGradient: "from-amber-400 to-amber-600",
      cardGradient: "from-amber-50 to-amber-100",
      shadowColor: "shadow-amber-200",
      borderColor: "border-amber-200",
      change: "+15.7%",
    },
    {
      title: "Average Grade",
      value: stats?.averageGrade?.toFixed(2) || "0.00",
      icon: BarChart3,
      bgGradient: "from-purple-400 to-purple-600",
      cardGradient: "from-purple-50 to-purple-100",
      shadowColor: "shadow-purple-200",
      borderColor: "border-purple-200",
      change: "+3.2%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header Section */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Analytics & Reports
              </h2>
              <p className="text-lg text-slate-600 mt-2 font-medium">
                Comprehensive reports and performance analytics dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 text-base font-semibold"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 rounded-2xl py-3 px-6 font-semibold transform hover:scale-105 transition-all duration-200"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 mt-8">
          {reportCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className={`group bg-white/80 backdrop-blur-sm border-2 ${stat.borderColor} ${stat.shadowColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 rounded-3xl overflow-hidden`}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.cardGradient} rounded-full opacity-30 -translate-y-16 translate-x-16`}></div>
                  <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br ${stat.cardGradient} rounded-full opacity-20 translate-y-10 -translate-x-10`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
                          {stat.title}
                        </p>
                        <p className="text-4xl font-black text-slate-800 group-hover:scale-110 transition-transform duration-200">
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
                          <Activity className="h-3 w-3 mr-1" />
                          {stat.change}
                        </div>
                        <span className="text-slate-600 ml-3 font-medium">vs last period</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Report Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Enrollment Analytics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full translate-y-8 -translate-x-8"></div>
              
              <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl mr-4 shadow-lg">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                Enrollment Analytics
                <div className="ml-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-indigo-200 shadow-md">
                  <span className="text-sm font-semibold text-slate-600">
                    {enrollmentCount} Total
                  </span>
                </div>
              </CardTitle>
              <p className="text-slate-600 mt-2 relative z-10 font-medium">
                Student enrollment trends and patterns
              </p>
            </CardHeader>
            <CardContent className="p-8 bg-gradient-to-br from-white/90 to-indigo-50/30">
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-slate-700">Total Enrollments</span>
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold">
                      {enrollmentCount}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-sm font-medium text-slate-600">This Month</p>
                      <p className="text-2xl font-bold text-blue-700">{Math.floor(enrollmentCount * 0.3)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <p className="text-sm font-medium text-slate-600">Growth Rate</p>
                      <p className="text-2xl font-bold text-purple-700">+8.3%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Performance Metrics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-emerald-100 to-green-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full translate-y-10 -translate-x-10"></div>
              
              <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-2xl mr-4 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                Performance Metrics
                <div className="ml-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-emerald-200 shadow-md">
                  <span className="text-sm font-semibold text-slate-600">
                    {stats?.averageGrade?.toFixed(1) || "0.0"} Avg
                  </span>
                </div>
              </CardTitle>
              <p className="text-slate-600 mt-2 relative z-10 font-medium">
                Academic performance overview and trends
              </p>
            </CardHeader>
            <CardContent className="p-8 bg-gradient-to-br from-white/90 to-emerald-50/30">
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 shadow-md">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Average Grade</p>
                        <p className="text-3xl font-bold text-emerald-700">{stats?.averageGrade?.toFixed(2) || "0.00"}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-xl">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                        <p className="text-sm font-medium text-slate-600">Top Performers</p>
                        <p className="text-2xl font-bold text-blue-700">{Math.floor((stats?.totalStudents || 0) * 0.15)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                        <p className="text-sm font-medium text-slate-600">Improvement</p>
                        <p className="text-2xl font-bold text-orange-700">+3.2%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-slate-100 to-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400/10 to-gray-400/10 rounded-full -translate-y-16 translate-x-16"></div>
            
            <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center">
              <div className="bg-gradient-to-br from-slate-600 to-gray-600 p-3 rounded-2xl mr-4 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Quick Report Actions
            </CardTitle>
            <p className="text-slate-600 mt-2 relative z-10 font-medium">
              Generate and export detailed reports
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 h-auto flex-col space-y-2">
                <Users className="h-8 w-8" />
                <span className="font-bold">Student Report</span>
                <span className="text-xs opacity-90">Export student data</span>
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 h-auto flex-col space-y-2">
                <BookOpen className="h-8 w-8" />
                <span className="font-bold">Course Report</span>
                <span className="text-xs opacity-90">Export course data</span>
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 h-auto flex-col space-y-2">
                <BarChart3 className="h-8 w-8" />
                <span className="font-bold">Grade Report</span>
                <span className="text-xs opacity-90">Export grade analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}