export interface Student {
  id: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  courseId?: string;
  name?: string;
  description?: string;
  credits?: number;
  instructor?: string;
  instructorEmail?: string;
}

export interface EnrollmentWithDetails {
  id: string;
  studentId?: string;
  courseId?: string;
  student?: Student;
  course?: Course;
  studentName?: string;
  courseName?: string;
  enrolledAt?: string; // ISO string
}


export interface GradeWithDetails {
  id: string;
  studentId?: string;
  courseId?: string;
  student?: Student;
  course?: Course;
  studentName?: string;
  courseName?: string;
  grade?: string | number;
  letterGrade?: string;
  semester?: string;
  year?: number;
  createdAt?: string;
}
