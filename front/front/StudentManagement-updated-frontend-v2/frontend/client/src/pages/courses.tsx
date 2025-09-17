import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BookOpen, Clock } from "lucide-react";
import CourseForm from "@/components/forms/course-form";
import type { Course } from "@/types";


export default function Courses() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);


  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);


  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: coursesApi.getAll,
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-testid="page-courses">
      {/* Hero Header Section */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Course Management
              </h2>
              <p className="text-lg text-slate-600 mt-2 font-medium">
                Manage course catalog and information with style
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 text-base font-semibold" 
                  data-testid="button-add-course"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Add New Course</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800">Add New Course</DialogTitle>
                </DialogHeader>
                <CourseForm 
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

      {/* Course Grid Section */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {courses?.map((course: Course) => (
            <Card 
              key={course.id} 
              className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-3xl overflow-hidden" 
              data-testid={`card-course-${course.id}`}
            >
              {/* Card Header with Gradient */}
              <CardHeader className="bg-gradient-to-br from-slate-100 to-blue-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                        {course.name}
                      </CardTitle>
                      <p className="text-sm font-semibold text-slate-500 mt-1 bg-slate-200/50 px-3 py-1 rounded-full inline-block">
                        {course.courseId}
                      </p>
                    </div>
                    <Badge 
                      variant={course.isActive ? "default" : "secondary"}
                      className={`${
                        course.isActive 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                          : 'bg-slate-300 text-slate-700'
                      } px-3 py-1 font-semibold rounded-full text-xs`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-blue-200">
                  {course.description || "No description available"}
                </p>
                
                {/* Course Details with Modern Icons */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-medium text-slate-600 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Instructor:
                    </span>
                    <span className="font-bold text-slate-800 text-sm">{course.instructor}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <span className="text-sm font-medium text-slate-600 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                      Credits:
                    </span>
                    <span className="font-bold text-slate-800 text-sm">{course.credits}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                    <span className="text-sm font-medium text-slate-600 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
                      Capacity:
                    </span>
                    <span className="font-bold text-slate-800 text-sm">0/{course.capacity}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 py-2.5 font-semibold" 
                    data-testid={`button-view-course-${course.id}`}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 rounded-xl py-2.5 px-4 font-semibold transform hover:scale-105 transition-all duration-200" 
                    data-testid={`button-edit-course-${course.id}`}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {courses?.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg max-w-md mx-auto">
                <div className="bg-gradient-to-br from-slate-100 to-blue-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">No Courses Found</h3>
                <p className="text-slate-500 text-lg">Start by adding your first course to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}