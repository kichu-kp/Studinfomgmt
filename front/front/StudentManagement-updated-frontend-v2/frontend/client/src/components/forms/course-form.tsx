import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { InsertCourse, Course } from "@/types";

interface CourseFormProps {
  course?: Course;
  onSuccess?: () => void;
}

export default function CourseForm({ course, onSuccess }: CourseFormProps) {
  const { toast } = useToast();

  const formSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
    name: z.string().min(1, "Course name is required"),
    description: z.string().optional(),
    instructor: z.string().min(1, "Instructor is required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    credits: z.number().min(1, "Credits must be at least 1"),
    isActive: z.boolean(),
  });

  const form = useForm<InsertCourse>({
    resolver: zodResolver(formSchema),
    defaultValues: course ? {
      courseId: course.courseId,
      name: course.name,
      description: course.description || "",
      instructor: course.instructor,
      capacity: course.capacity,
      credits: course.credits,
      isActive: course.isActive,
    } : {
      courseId: "",
      name: "",
      description: "",
      instructor: "",
      capacity: 30,
      credits: 3,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      toast({ title: "Course created successfully" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Failed to create course", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertCourse) => 
      course ? coursesApi.update(course.id, data) : Promise.reject("No course ID"),
    onSuccess: () => {
      toast({ title: "Course updated successfully" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Failed to update course", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertCourse) => {
    if (course) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-course">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course ID</FormLabel>
                <FormControl>
                  <Input placeholder="CS101" {...field} data-testid="input-courseId" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science 101" {...field} data-testid="input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Introduction to programming concepts using Python..." 
                  {...field} 
                  data-testid="input-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Sarah Wilson" {...field} data-testid="input-instructor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="30" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    data-testid="input-capacity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="6" 
                    placeholder="3" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    data-testid="input-credits"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Course</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Students can enroll in active courses
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-isActive"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-submit">
          {isLoading ? "Saving..." : course ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}
