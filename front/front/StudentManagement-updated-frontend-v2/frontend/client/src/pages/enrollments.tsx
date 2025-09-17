import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { enrollmentsApi, studentsApi, coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import EnrollmentsTable from "@/components/tables/enrollments-table";
import EnrollmentForm from "@/components/forms/enrollment-form";
import type { Student, Course, EnrollmentWithDetails } from "@/types";

export default function Enrollments() {
  const [, setLocation] = useLocation();
  useEffect(()=>{ if (!isAuthenticated()) setLocation('/login'); }, []);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: enrollments, isLoading, refetch } = useQuery<EnrollmentWithDetails[], Error>({
    queryKey: ["/api/enrollments"],
    queryFn: () => enrollmentsApi.getAll(),
  });

  const { data: students } = useQuery<Student[], Error>({
    queryKey: ["/api/students"],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: courses } = useQuery<Course[], Error>({
    queryKey: ["/api/courses"],
    queryFn: () => coursesApi.getAll(),
  });

  // Enrich enrollments with student/course objects when backend only returns ids
  const enrichedEnrollments = useMemo(() => {
    const sMap = new Map<string, Student>();
    const cMap = new Map<string, Course>();
    (students || []).forEach(s => sMap.set(s.id, s));
    (courses || []).forEach(c => cMap.set(c.id, c));

    return (enrollments || []).map(e => {
      const student = (e as any).student || sMap.get((e as any).studentId) || null;
      const course = (e as any).course || cMap.get((e as any).courseId) || null;
      const studentName = (e as any).studentName || (student ? `${(student as any).firstName || ""} ${(student as any).lastName || ""}`.trim() : undefined);
      const courseName = (e as any).courseName || (course ? (course as any).name : undefined);
      return {
        ...e,
        student,
        course,
        studentName,
        courseName
      } as EnrollmentWithDetails;
    });
  }, [enrollments, students, courses]);

  return (
    <div className="p-6" data-testid="page-enrollments">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Enrollments</h2>
          <p className="text-muted-foreground">Manage student course enrollments</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0 flex items-center space-x-2" data-testid="button-new-enrollment">
              <Plus className="h-4 w-4" />
              <span>New Enrollment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Enrollment</DialogTitle>
            </DialogHeader>
            <EnrollmentForm 
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

      {/* Quick Enrollment Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          <EnrollmentForm 
            students={students || []}
            courses={courses || []}
            onSuccess={refetch}
            showSubmitButton={true}
          />
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Enrollments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EnrollmentsTable 
            enrollments={enrichedEnrollments} 
            isLoading={isLoading} 
            onRefetch={refetch} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
