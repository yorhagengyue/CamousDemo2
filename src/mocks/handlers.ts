import { http, HttpResponse } from 'msw';
import type { User, Message, Course, Enrollment, AttendanceRecord, LeaveRequest, KPI, AuditLog } from '../types';

// Import fixture data
import usersData from '../fixtures/users.json';
import messagesData from '../fixtures/messages.json';
import coursesData from '../fixtures/courses.json';
import enrollmentsData from '../fixtures/enrollments.json';
import attendanceData from '../fixtures/attendance.json';
import leavesData from '../fixtures/leaves.json';
import kpiData from '../fixtures/kpi.json';
import auditsData from '../fixtures/audits.json';

// Type the imported data
const users = usersData as User[];
const messages = messagesData as Message[];
const courses = coursesData as Course[];
const enrollments = enrollmentsData as Enrollment[];
const attendance = attendanceData as AttendanceRecord[];
const leaves = leavesData as LeaveRequest[];
const kpi = kpiData as KPI[];
const audits = auditsData as AuditLog[];

// In-memory storage for session data
let currentUser: User | null = null;
let sessionMessages = [...messages];
let sessionEnrollments = [...enrollments];
let sessionAttendance = [...attendance];
let sessionLeaves = [...leaves];
let sessionAudits = [...audits];

// Helper function to get current user from auth header or fallback
const getCurrentUser = (request: Request): User | null => {
  // Try to get user from stored session first
  if (currentUser) return currentUser;
  
  // For demo purposes, if no current user but we have an auth header or token,
  // default to the first user (Alice Tan - Student)
  const authHeader = request.headers.get('Authorization');
  if (authHeader || request.url.includes('api/')) {
    return users[0]; // Default to Alice Tan for demo
  }
  
  return null;
};

// Helper function to check permissions
const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  const rolePermissions: Record<string, string[]> = {
    Student: ['messages:read', 'attendance:read', 'leave:submit', 'course:enroll'],
    Teacher: ['messages:read', 'messages:write', 'attendance:read', 'attendance:mark', 'leave:approve', 'course:manage'],
    HOD: ['messages:read', 'messages:write', 'attendance:read', 'attendance:mark', 'leave:approve', 'course:manage', 'kpi:view'],
    Principal: ['messages:read', 'messages:write', 'kpi:view', 'admin:view'],
    Admin: ['admin:*', 'messages:read', 'messages:write', 'kpi:view', 'attendance:read', 'leave:approve']
  };

  const userPermissions = user.roles.flatMap(role => rolePermissions[role] || []);
  return userPermissions.includes(permission) || userPermissions.includes('admin:*');
};

// Helper function to add audit log
const addAuditLog = (actorId: string, action: string, resource: string, details?: any) => {
  const actor = users.find(u => u.id === actorId);
  const newAudit: AuditLog = {
    id: `audit-${Date.now()}`,
    actorId,
    actorName: actor?.name || 'Unknown',
    action,
    resource,
    ip: '192.168.1.100',
    timestamp: new Date().toISOString(),
    details
  };
  sessionAudits.unshift(newAudit);
};

export const handlers = [
  // Authentication endpoints
  http.post('/api/login', async ({ request }) => {
    const { provider, roleOverride } = await request.json() as { 
      provider: 'Google' | 'Singpass'; 
      roleOverride?: string;
    };
    
    // For demo purposes, simulate login based on provider
    let user: User;
    
    if (roleOverride) {
      // Find user with the specified role for demo
      user = users.find(u => u.roles.includes(roleOverride as any)) || users[0];
    } else {
      // Default login logic
      user = provider === 'Google' 
        ? users.find(u => u.identities?.some(i => i.provider === 'Google')) || users[0]
        : users.find(u => u.identities?.some(i => i.provider === 'Singpass')) || users[1];
    }
    
    currentUser = user;
    addAuditLog(user.id, 'login', '/login', { provider });
    
    return HttpResponse.json({ 
      user, 
      token: 'mock-jwt-token',
      permissions: user.roles.flatMap(role => {
        const rolePermissions: Record<string, string[]> = {
          Student: ['messages:read', 'attendance:read', 'leave:submit', 'course:enroll'],
          Teacher: ['messages:read', 'messages:write', 'attendance:read', 'attendance:mark', 'leave:approve', 'course:manage'],
          HOD: ['messages:read', 'messages:write', 'attendance:read', 'attendance:mark', 'leave:approve', 'course:manage', 'kpi:view'],
          Principal: ['messages:read', 'messages:write', 'kpi:view', 'admin:view'],
          Admin: ['admin:*']
        };
        return rolePermissions[role] || [];
      })
    });
  }),

  http.get('/api/me', () => {
    if (!currentUser) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({ user: currentUser });
  }),

  http.post('/api/logout', () => {
    if (currentUser) {
      addAuditLog(currentUser.id, 'logout', '/logout');
      currentUser = null;
    }
    return HttpResponse.json({ success: true });
  }),

  // Messages endpoints
  http.get('/api/messages', ({ request }) => {
    const user = getCurrentUser(request);
    if (!user || !hasPermission(user, 'messages:read')) {
      return new HttpResponse(null, { status: 403 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    let userMessages = sessionMessages.filter(m => 
      m.recipients.includes(user.id) || m.senderId === user.id
    );

    if (type === 'inbox') {
      userMessages = userMessages.filter(m => m.recipients.includes(user.id));
    } else if (type === 'sent') {
      userMessages = userMessages.filter(m => m.senderId === user.id);
    }

    return HttpResponse.json(userMessages);
  }),

  http.post('/api/messages', async ({ request }) => {
    const user = getCurrentUser(request);
    if (!user || !hasPermission(user, 'messages:write')) {
      return new HttpResponse(null, { status: 403 });
    }

    const messageData = await request.json() as Partial<Message>;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      title: messageData.title!,
      body: messageData.body!,
      senderId: user.id,
      recipients: messageData.recipients!,
      createdAt: new Date().toISOString(),
      readBy: [],
      type: messageData.type || 'direct'
    };

    sessionMessages.unshift(newMessage);
    addAuditLog(user.id, 'send_message', '/api/messages', {
      recipientCount: newMessage.recipients.length,
      messageType: newMessage.type
    });

    return HttpResponse.json(newMessage);
  }),

  http.patch('/api/messages/:id/read', ({ params, request }) => {
    const user = getCurrentUser(request);
    if (!user) {
      return new HttpResponse(null, { status: 401 });
    }

    const messageId = params.id as string;
    const message = sessionMessages.find(m => m.id === messageId);
    
    if (message && !message.readBy.includes(user.id)) {
      message.readBy.push(user.id);
    }

    return HttpResponse.json({ success: true });
  }),

  // Courses endpoints
  http.get('/api/courses', ({ request }) => {
    const url = new URL(request.url);
    const grade = url.searchParams.get('grade');
    
    let filteredCourses = courses;
    if (grade) {
      filteredCourses = courses.filter(c => c.grade === grade);
    }

    return HttpResponse.json(filteredCourses);
  }),

  http.get('/api/courses/:id', ({ params }) => {
    const courseId = params.id as string;
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(course);
  }),

  http.post('/api/enroll', async ({ request }) => {
    if (!currentUser || !hasPermission(currentUser, 'course:enroll')) {
      return new HttpResponse(null, { status: 403 });
    }

    const { courseId } = await request.json() as { courseId: string };
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return new HttpResponse(null, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = sessionEnrollments.find(e => 
      e.studentId === currentUser!.id && e.courseId === courseId
    );

    if (existingEnrollment) {
      return HttpResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }

    // Determine enrollment status based on capacity
    const enrolledCount = sessionEnrollments.filter(e => 
      e.courseId === courseId && e.status === 'enrolled'
    ).length;

    const newEnrollment: Enrollment = {
      id: `enroll-${Date.now()}`,
      studentId: currentUser.id,
      courseId,
      status: enrolledCount < course.capacity ? 'enrolled' : 'waitlist',
      enrolledAt: new Date().toISOString()
    };

    sessionEnrollments.push(newEnrollment);
    addAuditLog(currentUser.id, 'course_enrollment', '/api/enroll', {
      courseId,
      courseName: course.name,
      enrollmentStatus: newEnrollment.status
    });

    return HttpResponse.json(newEnrollment);
  }),

  // Attendance endpoints
  http.get('/api/attendance', ({ request }) => {
    const user = getCurrentUser(request);
    if (!user || !hasPermission(user, 'attendance:read')) {
      return new HttpResponse(null, { status: 403 });
    }

    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const date = url.searchParams.get('date');

    let filteredAttendance = sessionAttendance;

    if (role === 'Student') {
      filteredAttendance = filteredAttendance.filter(a => a.personId === user.id);
    }

    if (date) {
      filteredAttendance = filteredAttendance.filter(a => a.date === date);
    }

    return HttpResponse.json(filteredAttendance);
  }),

  http.post('/api/attendance/mark', async ({ request }) => {
    if (!currentUser || !hasPermission(currentUser, 'attendance:mark')) {
      return new HttpResponse(null, { status: 403 });
    }

    const attendanceRecords = await request.json() as Partial<AttendanceRecord>[];
    const newRecords = attendanceRecords.map(record => ({
      id: `att-${Date.now()}-${Math.random()}`,
      date: record.date!,
      personType: 'Student' as const,
      personId: record.personId!,
      status: record.status!,
      reason: record.reason,
      lessonId: record.lessonId,
      lessonName: record.lessonName,
      markedBy: currentUser!.id,
      markedAt: new Date().toISOString()
    }));

    sessionAttendance.push(...newRecords);
    addAuditLog(currentUser.id, 'mark_attendance', '/api/attendance/mark', {
      studentsMarked: newRecords.length,
      lessonId: newRecords[0]?.lessonId
    });

    return HttpResponse.json(newRecords);
  }),

  // Leave endpoints
  http.get('/api/leaves', ({ request }) => {
    const user = getCurrentUser(request);
    if (!user) {
      return new HttpResponse(null, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let userLeaves = sessionLeaves;

    // Filter based on user role
    if (user.roles.includes('Student')) {
      userLeaves = userLeaves.filter(l => l.applicantId === user.id);
    } else if (user.roles.includes('Teacher') || user.roles.includes('HOD')) {
      // Teachers and HODs can see leaves they need to approve or have approved
      userLeaves = userLeaves.filter(l => 
        l.applicantId === user.id || 
        l.approverId === user.id ||
        l.status === 'pending'
      );
    }

    if (status) {
      userLeaves = userLeaves.filter(l => l.status === status);
    }

    return HttpResponse.json(userLeaves);
  }),

  http.post('/api/leaves', async ({ request }) => {
    if (!currentUser || !hasPermission(currentUser, 'leave:submit')) {
      return new HttpResponse(null, { status: 403 });
    }

    const leaveData = await request.json() as Partial<LeaveRequest>;
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      applicantId: currentUser.id,
      applicantRole: currentUser.roles.includes('Student') ? 'Student' : 'Teacher',
      type: leaveData.type!,
      start: leaveData.start!,
      end: leaveData.end!,
      reason: leaveData.reason!,
      status: 'pending',
      attachments: leaveData.attachments || []
    };

    sessionLeaves.unshift(newLeave);
    addAuditLog(currentUser.id, 'submit_leave', '/api/leaves', {
      leaveType: newLeave.type,
      duration: `${Math.ceil((new Date(newLeave.end).getTime() - new Date(newLeave.start).getTime()) / (1000 * 60 * 60 * 24))} days`
    });

    return HttpResponse.json(newLeave);
  }),

  http.post('/api/leaves/:id/:action', async ({ params, request }) => {
    if (!currentUser || !hasPermission(currentUser, 'leave:approve')) {
      return new HttpResponse(null, { status: 403 });
    }

    const leaveId = params.id as string;
    const action = params.action as 'approve' | 'reject';
    const { comment } = await request.json() as { comment?: string };

    const leave = sessionLeaves.find(l => l.id === leaveId);
    if (!leave) {
      return new HttpResponse(null, { status: 404 });
    }

    leave.status = action === 'approve' ? 'approved' : 'rejected';
    leave.approverId = currentUser.id;
    leave.decidedAt = new Date().toISOString();
    leave.approverComment = comment;

    addAuditLog(currentUser.id, `${action}_leave`, `/api/leaves/${leaveId}/${action}`, {
      leaveId,
      applicantId: leave.applicantId
    });

    return HttpResponse.json(leave);
  }),

  // KPI endpoints
  http.get('/api/kpi', ({ request }) => {
    if (!currentUser || !hasPermission(currentUser, 'kpi:view')) {
      return new HttpResponse(null, { status: 403 });
    }

    const url = new URL(request.url);
    const range = url.searchParams.get('range') || 'week';
    
    // Filter KPI data based on range
    let filteredKPI = kpi;
    const now = new Date();
    
    if (range === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredKPI = kpi.filter(k => new Date(k.date) >= weekAgo);
    } else if (range === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredKPI = kpi.filter(k => new Date(k.date) >= monthAgo);
    }

    addAuditLog(currentUser.id, 'view_reports', '/api/kpi', { range });
    return HttpResponse.json(filteredKPI);
  }),

  // Admin endpoints
  http.get('/api/audits', ({ request }) => {
    if (!currentUser || !hasPermission(currentUser, 'admin:*')) {
      return new HttpResponse(null, { status: 403 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let filteredAudits = sessionAudits;

    if (search) {
      filteredAudits = filteredAudits.filter(a => 
        a.actorName.toLowerCase().includes(search.toLowerCase()) ||
        a.action.toLowerCase().includes(search.toLowerCase()) ||
        a.resource.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json(filteredAudits.slice(0, limit));
  }),

  http.get('/api/users', () => {
    if (!currentUser || !hasPermission(currentUser, 'admin:*')) {
      return new HttpResponse(null, { status: 403 });
    }

    return HttpResponse.json(users);
  }),

  http.post('/api/admin/identity/:action', async ({ params, request }) => {
    if (!currentUser || !hasPermission(currentUser, 'admin:*')) {
      return new HttpResponse(null, { status: 403 });
    }

    const action = params.action as 'bind' | 'unbind';
    const { userId, provider } = await request.json() as { 
      userId: string; 
      provider: 'Google' | 'Singpass';
    };

    const user = users.find(u => u.id === userId);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    addAuditLog(currentUser.id, 'identity_binding', `/api/admin/identity/${action}`, {
      userId,
      provider,
      action
    });

    return HttpResponse.json({ success: true });
  })
];
