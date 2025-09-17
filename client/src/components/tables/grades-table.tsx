import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gradesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GradeForm from "@/components/forms/grade-form";
import type { GradeWithDetails, Student, Course } from "@/types";

interface GradesTableProps {
  grades: GradeWithDetails[];
  isLoading: boolean;
  onRefetch: () => void;
}

export default function GradesTable({ grades, isLoading, onRefetch }: GradesTableProps) {
  const { toast } = useToast();
  const [editingGrade, setEditingGrade] = useState<GradeWithDetails | null>(null);
  const [deletingGrade, setDeletingGrade] = useState<GradeWithDetails | null>(null);

  const deleteMutation = useMutation({
    mutationFn: gradesApi.delete,
    onSuccess: () => {
      toast({ title: "Grade deleted successfully" });
      setDeletingGrade(null);
      onRefetch();
    },
    onError: () => {
      toast({ title: "Failed to delete grade", variant: "destructive" });
    },
  });

  const getLetterGradeColor = (letterGrade: string) => {
    switch (letterGrade) {
      case "A":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "B":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "C":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "D":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "F":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full" data-testid="table-grades-loading">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto" data-testid="table-grades">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Letter</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <BarChart3 className="h-8 w-8 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No grades found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade) => (
                <TableRow key={grade.id} data-testid={`row-grade-${grade.id}`}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                        alt="Student avatar" 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium" data-testid={`text-student-name-${grade.id}`}>
                          {grade.student?.firstName} {grade.student?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {grade.student?.studentId}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium" data-testid={`text-course-name-${grade.id}`}>
                        {grade.course?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {grade.course?.courseId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-lg" data-testid={`text-grade-${grade.id}`}>
                      {grade.grade || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {grade.letterGrade ? (
                      <Badge 
                        variant="secondary" 
                        className={getLetterGradeColor(grade.letterGrade)}
                        data-testid={`badge-letter-grade-${grade.id}`}
                      >
                        {grade.letterGrade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{grade.semester} {grade.year}</TableCell>
                  <TableCell className="text-sm">
                    {grade.createdAt 
                      ? new Date(grade.createdAt).toLocaleDateString()
                      : "N/A"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGrade(grade)}
                        data-testid={`button-edit-${grade.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingGrade(grade)}
                        data-testid={`button-delete-${grade.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {grades.length} grade(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingGrade} onOpenChange={() => setEditingGrade(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
          </DialogHeader>
          {editingGrade && (
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">
                  {editingGrade.student?.firstName} {editingGrade.student?.lastName}
                </p>
                <p className="text-muted-foreground">{editingGrade.course?.name}</p>
              </div>
              {/* Note: We would need to modify GradeForm to accept initial values for editing */}
              <p className="text-sm text-muted-foreground">
                Grade editing functionality would require modifying the GradeForm component to accept initial values.
              </p>
              <Button onClick={() => setEditingGrade(null)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingGrade} onOpenChange={() => setDeletingGrade(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Grade?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the grade record for{" "}
              <strong>{deletingGrade?.student?.firstName} {deletingGrade?.student?.lastName}</strong>{" "}
              in <strong>{deletingGrade?.course?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingGrade && deleteMutation.mutate(deletingGrade.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Grade"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
