import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { enrollmentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { InsertEnrollment, Student, Course } from "@/types";

interface EnrollmentFormProps {
  students: Student[];
  courses: Course[];
  onSuccess?: () => void;
  showSubmitButton?: boolean;
}

export default function EnrollmentForm({ 
  students, 
  courses, 
  onSuccess, 
  showSubmitButton = false 
}: EnrollmentFormProps) {
  const { toast } = useToast();

  const formSchema = z.object({
    studentId: z.string().min(1, "Student is required"),
    courseId: z.string().min(1, "Course is required"),
  });

  const form = useForm<InsertEnrollment>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: enrollmentsApi.create,
    onSuccess: () => {
      toast({ title: "Student enrolled successfully" });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to enroll student", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: InsertEnrollment) => {
    createMutation.mutate(data);
  };

  const isLoading = createMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="form-enrollment">
        <div className={`grid gap-4 ${showSubmitButton ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-student">
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-course">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.courseId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showSubmitButton && (
            <div className="flex items-end">
              <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-enroll">
                {isLoading ? "Enrolling..." : "Enroll Student"}
              </Button>
            </div>
          )}
        </div>

        {!showSubmitButton && (
          <Button type="submit" disabled={isLoading} className="w-full mt-4" data-testid="button-enroll">
            {isLoading ? "Enrolling..." : "Enroll Student"}
          </Button>
        )}
      </form>
    </Form>
  );
}
