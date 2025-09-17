import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gradesApi, studentsApi, coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BookOpen, Award, TrendingUp } from "lucide-react";
import GradesTable from "@/components/tables/grades-table";
import GradeForm from "@/components/forms/grade-form";
import type { GradeWithDetails, Student, Course } from "@/types";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";

export default function Grades() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(()=>{
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  },[]);

  const { data: grades, isLoading, refetch } = useQuery<GradeWithDetails[], Error>({
    queryKey: ["/api/grades"],
    queryFn: () => gradesApi.getAll(),
  });

  const { data: students } = useQuery<Student[], Error>({
    queryKey: ["/api/students"],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: courses } = useQuery<Course[], Error>({
    queryKey: ["/api/courses"],
    queryFn: () => coursesApi.getAll(),
  });

  const enrichedGrades = useMemo(() => {
    const sMap = new Map<string, Student>();
    const cMap = new Map<string, Course>();
    (students || []).forEach(s => sMap.set(s.id, s));
    (courses || []).forEach(c => cMap.set(c.id, c));
    return (grades || []).map(g => {
      const student = (g as any).student || sMap.get((g as any).studentId) || null;
      const course = (g as any).course || cMap.get((g as any).courseId) || null;
      const studentName = (g as any).studentName || (student ? `${(student as any).firstName || ""} ${(student as any).lastName || ""}`.trim() : undefined);
      const courseName = (g as any).courseName || (course ? (course as any).name : undefined);
      return { ...g, student, course, studentName, courseName } as GradeWithDetails;
    });
  }, [grades, students, courses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-testid="page-grades">
      {/* Hero Header Section */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Grade Management
              </h2>
              <p className="text-lg text-slate-600 mt-2 font-medium">
                Manage student grades and academic performance
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 text-base font-semibold" 
                  data-testid="button-new-grade"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Add New Grade</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white/95 backdrop-blur-md border-white/20 rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800">Add New Grade</DialogTitle>
                </DialogHeader>
                <GradeForm 
                  students={students || []}
                  courses={courses || []}
                  onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Quick Grade Entry Section */}
        <Card className="mb-8 mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full -translate-y-10 -translate-x-10"></div>
            <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-2xl mr-4 shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              Quick Grade Entry
              <div className="ml-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-green-200 shadow-md">
                <span className="text-sm font-semibold text-slate-600">Fast Input Mode</span>
              </div>
            </CardTitle>
            <p className="text-slate-600 mt-2 relative z-10 font-medium">
              Enter grades quickly without opening a dialog
            </p>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-br from-white/90 to-green-50/30 backdrop-blur-sm">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200 shadow-md">
              <GradeForm 
                students={students || []}
                courses={courses || []}
                onSuccess={refetch}
                showSubmitButton={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Grades Table Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-12 -translate-x-12"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full translate-y-8 translate-x-8"></div>
            
            <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl mr-4 shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                All Student Grades
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-purple-200 shadow-md">
                  <span className="text-sm font-semibold text-slate-600">
                    {enrichedGrades?.length || 0} Total Grades
                  </span>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl shadow-lg">
                  <TrendingUp className="h-4 w-4 inline mr-2" />
                  <span className="text-sm font-bold">Performance Tracking</span>
                </div>
              </div>
            </CardTitle>
            <p className="text-slate-600 mt-2 relative z-10 font-medium">
              Complete overview of student academic performance and grades
            </p>
          </CardHeader>
          <CardContent className="p-0 relative overflow-hidden">
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-purple-50/30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.05),transparent)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent)] pointer-events-none"></div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-sm">
              <GradesTable 
                grades={enrichedGrades || []} 
                isLoading={isLoading} 
                onRefetch={refetch} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}