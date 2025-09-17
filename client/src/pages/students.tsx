import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { studentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Filter } from "lucide-react";
import StudentsTable from "@/components/tables/students-table";
import StudentForm from "@/components/forms/student-form";

export default function Students() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ["/api/students", searchQuery, statusFilter],
    queryFn: () => studentsApi.getAll({ 
      query: searchQuery || undefined, 
      status: statusFilter || undefined 
    }),
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-testid="page-students">
      {/* Hero Header Section */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Student Management
              </h2>
              <p className="text-lg text-slate-600 mt-2 font-medium">
                Manage student records and information with ease
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 text-base font-semibold" 
                  data-testid="button-add-student"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Add New Student</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md border-white/20 rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800">Add New Student</DialogTitle>
                </DialogHeader>
                <StudentForm 
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
        {/* Enhanced Filters and Search Section */}
        <Card className="mb-8 mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-slate-100 to-blue-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-12 translate-x-12"></div>
            <CardTitle className="text-xl font-bold text-slate-800 relative z-10 flex items-center">
              <Search className="h-6 w-6 mr-3 text-blue-600" />
              Search & Filter Students
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Search Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                </div>
                <Input
                  placeholder="Search students by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base border-2 border-slate-200 focus:border-blue-500 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200"
                  data-testid="input-search-students"
                />
              </div>
              
              {/* Enhanced Status Filter */}
              <div className="relative">
                <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
                  <SelectTrigger 
                    className="w-52 py-3 px-4 text-base border-2 border-slate-200 hover:border-blue-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200" 
                    data-testid="select-status-filter"
                  >
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/20 rounded-2xl shadow-2xl">
                    <SelectItem value="all" className="rounded-xl">All Status</SelectItem>
                    <SelectItem value="active" className="rounded-xl">Active</SelectItem>
                    <SelectItem value="inactive" className="rounded-xl">Inactive</SelectItem>
                    <SelectItem value="graduated" className="rounded-xl">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Enhanced Filter Button */}
              <Button 
                variant="secondary" 
                className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-slate-200 text-base font-semibold" 
                data-testid="button-filter"
              >
                <Filter className="h-5 w-5 mr-2" />
                <span>Advanced Filter</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Students Table Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-10 -translate-x-10"></div>
            <CardTitle className="text-2xl font-bold text-slate-800 relative z-10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl mr-4 shadow-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                All Students Directory
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-indigo-200 shadow-md">
                <span className="text-sm font-semibold text-slate-600">
                  {students?.length || 0} Total Students
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/30 pointer-events-none"></div>
            <div className="relative z-10 bg-white/90 backdrop-blur-sm">
              <StudentsTable 
                students={students || []} 
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