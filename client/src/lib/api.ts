import { apiRequest } from "./queryClient";
import type { 
  Student, 
  Course, 
  Enrollment, 
  Grade, 
  InsertStudent, 
  InsertCourse, 
  InsertEnrollment, 
  InsertGrade,
  DashboardStats,
  EnrollmentWithDetails, 
  GradeWithDetails 
} from "@/types";

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest("GET", "/api/dashboard/stats");
    return response.json();
  },
};

// Students API
export const studentsApi = {
  getAll: async (params?: { query?: string; status?: string }): Promise<Student[]> => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append("query", params.query);
    if (params?.status) searchParams.append("status", params.status);
    
    const response = await apiRequest("GET", `/api/students?${searchParams.toString()}`);
    return response.json();
  },

  getById: async (id: string): Promise<Student> => {
    const response = await apiRequest("GET", `/api/students/${id}`);
    return response.json();
  },

  create: async (data: InsertStudent): Promise<Student> => {
    const response = await apiRequest("POST", "/api/students", data);
    return response.json();
  },

  update: async (id: string, data: Partial<InsertStudent>): Promise<Student> => {
    const response = await apiRequest("PUT", `/api/students/${id}`, data);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/students/${id}`);
  },
};

// Courses API
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await apiRequest("GET", "/api/courses");
    return response.json();
  },

  getById: async (id: string): Promise<Course> => {
    const response = await apiRequest("GET", `/api/courses/${id}`);
    return response.json();
  },

  create: async (data: InsertCourse): Promise<Course> => {
    const response = await apiRequest("POST", "/api/courses", data);
    return response.json();
  },

  update: async (id: string, data: Partial<InsertCourse>): Promise<Course> => {
    const response = await apiRequest("PUT", `/api/courses/${id}`, data);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/courses/${id}`);
  },
};

// Enrollments API
export const enrollmentsApi = {
  getAll: async (): Promise<EnrollmentWithDetails[]> => {
    const response = await apiRequest("GET", "/api/enrollments");
    return response.json();
  },

  getByStudent: async (studentId: string): Promise<Enrollment[]> => {
    const response = await apiRequest("GET", `/api/enrollments/student/${studentId}`);
    return response.json();
  },

  getByCourse: async (courseId: string): Promise<Enrollment[]> => {
    const response = await apiRequest("GET", `/api/enrollments/course/${courseId}`);
    return response.json();
  },

  create: async (data: InsertEnrollment): Promise<Enrollment> => {
    const response = await apiRequest("POST", "/api/enrollments", data);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/enrollments/${id}`);
  },
};

// Grades API
export const gradesApi = {
  getAll: async (): Promise<GradeWithDetails[]> => {
    const response = await apiRequest("GET", "/api/grades");
    return response.json();
  },

  getByStudent: async (studentId: string): Promise<Grade[]> => {
    const response = await apiRequest("GET", `/api/grades/student/${studentId}`);
    return response.json();
  },

  getByCourse: async (courseId: string): Promise<Grade[]> => {
    const response = await apiRequest("GET", `/api/grades/course/${courseId}`);
    return response.json();
  },

  create: async (data: InsertGrade): Promise<Grade> => {
    const response = await apiRequest("POST", "/api/grades", data);
    return response.json();
  },

  update: async (id: string, data: Partial<InsertGrade>): Promise<Grade> => {
    const response = await apiRequest("PUT", `/api/grades/${id}`, data);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/grades/${id}`);
  },
};
