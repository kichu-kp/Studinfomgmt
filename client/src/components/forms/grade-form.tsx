import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { gradesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { InsertGrade, Student, Course } from "@/types";

interface GradeFormProps {
  students: Student[];
  courses: Course[];
  onSuccess?: () => void;
  showSubmitButton?: boolean;
}

const getLetterGrade = (numericGrade: number): string => {
  if (numericGrade >= 90) return "A";
  if (numericGrade >= 80) return "B";
  if (numericGrade >= 70) return "C";
  if (numericGrade >= 60) return "D";
  return "F";
};

export default function GradeForm({ 
  students, 
  courses, 
  onSuccess, 
  showSubmitButton = false 
}: GradeFormProps) {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const formSchema = z.object({
    studentId: z.string().min(1, "Student is required"),
    courseId: z.string().min(1, "Course is required"),
    grade: z.number().min(0).max(100).optional(),
    letterGrade: z.string().optional(),
    semester: z.string().min(1, "Semester is required"),
    year: z.number().min(2020).max(2030),
  });

  const form = useForm<InsertGrade>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
      grade: undefined,
      letterGrade: "",
      semester: "Spring",
      year: currentYear,
    },
  });

  const createMutation = useMutation({
    mutationFn: gradesApi.create,
    onSuccess: () => {
      toast({ title: "Grade submitted successfully" });
      form.reset({
        studentId: "",
        courseId: "",
        grade: undefined,
        letterGrade: "",
        semester: "Spring",
        year: currentYear,
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to submit grade", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: InsertGrade) => {
    // Auto-calculate letter grade if numeric grade is provided
    if (data.grade && !data.letterGrade) {
      data.letterGrade = getLetterGrade(data.grade);
    }
    createMutation.mutate(data);
  };

  const isLoading = createMutation.isPending;
  const gradeValue = form.watch("grade");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="form-grade">
        <div className={`grid gap-4 ${showSubmitButton ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1'}`}>
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
                        {student.firstName} {student.lastName}
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
                        {course.name}
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
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    placeholder="85.5" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    data-testid="input-grade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="letterGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Letter Grade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || (gradeValue ? getLetterGrade(gradeValue) : "")}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-letterGrade">
                      <SelectValue placeholder="Auto Calculate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showSubmitButton ? (
            <div className="flex items-end">
              <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-submit">
                {isLoading ? "Submitting..." : "Submit Grade"}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-semester">
                            <SelectValue placeholder="Select Semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="2020" 
                          max="2030" 
                          placeholder={currentYear.toString()} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-year"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full mt-4" data-testid="button-submit">
                {isLoading ? "Submitting..." : "Submit Grade"}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
