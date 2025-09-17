import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, BookOpen } from "lucide-react";
import type { Course } from "@/types";

interface CoursesTableProps {
  courses: Course[];
  isLoading: boolean;
  onRefetch: () => void;
}

export default function CoursesTable({ courses, isLoading }: CoursesTableProps) {
  if (isLoading) {
    return (
      <div className="w-full" data-testid="table-courses-loading">
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
    <div className="overflow-x-auto" data-testid="table-courses">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <BookOpen className="h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No courses found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id} data-testid={`row-course-${course.id}`}>
                <TableCell className="font-mono text-sm">{course.courseId}</TableCell>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>0/{course.capacity}</TableCell>
                <TableCell>
                  <Badge variant={course.isActive ? "default" : "secondary"}>
                    {course.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-view-${course.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-edit-${course.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-delete-${course.id}`}
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
  );
}
