import { useMutation } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, UserMinus, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { EnrollmentWithDetails } from "@/types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface EnrollmentsTableProps {
  enrollments: EnrollmentWithDetails[];
  isLoading: boolean;
  onRefetch: () => void;
}

export default function EnrollmentsTable({ enrollments, isLoading, onRefetch }: EnrollmentsTableProps) {
  const { toast } = useToast();
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (params: { studentId: string; courseId: string }) =>
      enrollmentsApi.delete(params.studentId, params.courseId),
    onSuccess: () => {
      toast({ title: "Enrollment removed" });
      onRefetch();
    },
    onError: (error: any) => {
      toast({ title: "Failed to remove enrollment", description: error.message, variant: "destructive" });
    },
  });

  const handleDelete = (studentId: string, courseId: string) => {
    deleteMutation.mutate({ studentId, courseId });
  };

  const renderStudentName = (enrollment: EnrollmentWithDetails) => {
    // Prefer structured student name, fallback to DTO fields if present
    const s = enrollment.student;
    if (s && (s.firstName || s.lastName)) {
      return `${s.firstName || ""} ${s.lastName || ""}`.trim();
    }
    if ((enrollment as any).studentName) return (enrollment as any).studentName;
    if (s && s.studentId) return s.studentId;
    return "Unknown Student";
  };

  const renderCourseName = (enrollment: EnrollmentWithDetails) => {
    const c = enrollment.course;
    if (c && c.name) return c.name;
    if ((enrollment as any).courseName) return (enrollment as any).courseName;
    if (c && c.courseId) return c.courseId;
    return "Unknown Course";
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Enrolled Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={enrollment.student?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} alt="avatar" />
                  </div>
                  <div>
                    <p className="font-medium" data-testid={`text-student-name-${enrollment.id}`}>
                      {renderStudentName(enrollment)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment.student?.studentId || (enrollment as any).studentId || ""}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium" data-testid={`text-course-name-${enrollment.id}`}>
                    {renderCourseName(enrollment)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment.course?.courseId || (enrollment as any).courseId || ""}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium">{enrollment.course?.instructorName || (enrollment as any).instructorName || "—"}</p>
                  <p className="text-sm text-muted-foreground">{enrollment.course?.instructorEmail || ""}</p>
                </div>
              </TableCell>

              <TableCell>
                {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : "—"}
              </TableCell>

              <TableCell>
                <Badge variant="secondary">Enrolled</Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedEnrollment(enrollment)} aria-label="View enrollment">
                    <Eye />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={() => handleDelete(enrollment.student?.id || (enrollment as any).studentId, enrollment.course?.id || (enrollment as any).courseId)} aria-label="Remove enrollment">
                    <UserMinus />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog to show enrollment details */}
      <Dialog open={!!selectedEnrollment} onOpenChange={(open) => { if (!open) setSelectedEnrollment(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>
              {selectedEnrollment ? renderStudentName(selectedEnrollment) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedEnrollment ? (
              <>
                <div><strong>Student:</strong> {renderStudentName(selectedEnrollment)}</div>
                <div><strong>Student ID:</strong> {selectedEnrollment.student?.studentId || (selectedEnrollment as any).studentId || "—"}</div>
                <div><strong>Course:</strong> {renderCourseName(selectedEnrollment)}</div>
                <div><strong>Instructor:</strong> {selectedEnrollment.course?.instructorName || (selectedEnrollment as any).instructorName || "—"}</div>
                <div><strong>Enrolled At:</strong> {selectedEnrollment.enrolledAt ? new Date(selectedEnrollment.enrolledAt).toLocaleString() : "—"}</div>
                <div><strong>Status:</strong> Enrolled</div>
              </>
            ) : null}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedEnrollment(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
