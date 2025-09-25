export type Role = 'Student' | 'Teacher' | 'HOD' | 'Principal' | 'Admin';

export interface User {
  id: string;
  name: string;
  roles: Role[];
  email?: string;
  grade?: string;
  className?: string;
  staffNo?: string;
  identities?: Array<{ 
    provider: 'Google' | 'Singpass'; 
    subject: string; 
    linkedAt: string;
  }>;
}

export interface Message {
  id: string;
  title: string;
  body: string;
  senderId: string;
  recipients: string[];
  createdAt: string;
  readBy: string[];
  type: 'announce' | 'direct' | string;
}

export interface Course {
  id: string;
  name: string;
  grade: string;
  credit: number;
  teacherId: string;
  capacity: number;
  enrolled: number;
  description?: string;
  chapters?: Array<{
    id: string;
    title: string;
    resources: Array<{
      id: string;
      title: string;
      type: 'video' | 'document' | 'quiz' | string;
      url: string;
    }>;
  }>;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: 'enrolled' | 'waitlist';
  enrolledAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  personType: 'Student' | 'Teacher' | string;
  personId: string;
  status: 'present' | 'absent' | 'late' | string;
  reason?: string;
  lessonId?: string;
  lessonName?: string;
  markedBy?: string;
  markedAt?: string;
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantRole: 'Student' | 'Teacher' | string;
  type: 'sick' | 'personal' | 'other' | string;
  start: string;
  end: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  approverId?: string;
  decidedAt?: string;
  approverComment?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export interface KPI {
  date: string;
  attendanceRate: number;
  leaveRate: number;
  enrollCount: number;
  dau: number;
  wau: number;
  avgApprovalHours: number;
  errorRate: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
}

export interface AppEvent {
  id: string;
  userId: string;
  type: 'page_view' | 'error' | 'action';
  path: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacherId: string;
  studentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  classId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EnrollmentTask {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  eligibleGrades: string[];
}
