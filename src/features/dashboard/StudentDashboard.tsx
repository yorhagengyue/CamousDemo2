import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Bell,
  User as UserIcon,
  GraduationCap,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { User, Message, Course, LeaveRequest, AttendanceRecord } from '@/types';
import { formatDate, isToday, formatTime } from '@/utils/date';
import additionalData from '@/fixtures/additional-data.json';

interface StudentDashboardProps {
  user: User;
}

export const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [messagesRes, coursesRes, leavesRes, attendanceRes] = await Promise.all([
          fetch('/api/messages?type=inbox'),
          fetch('/api/courses'),
          fetch('/api/leaves'),
          fetch('/api/attendance?role=Student'),
        ]);

        // Check if responses are OK and contain JSON
        const [messagesData, coursesData, leavesData, attendanceData] = await Promise.all([
          messagesRes.ok ? messagesRes.json().catch(() => []) : [],
          coursesRes.ok ? coursesRes.json().catch(() => []) : [],
          leavesRes.ok ? leavesRes.json().catch(() => []) : [],
          attendanceRes.ok ? attendanceRes.json().catch(() => []) : [],
        ]);

        setMessages(messagesData || []);
        setCourses(coursesData || []);
        setLeaves(leavesData || []);
        setAttendance(attendanceData || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use fallback data from fixtures
        import('@/fixtures/messages.json').then(data => setMessages(data.default || []));
        import('@/fixtures/courses.json').then(data => setCourses(data.default || []));
        import('@/fixtures/leaves.json').then(data => setLeaves(data.default || []));
        import('@/fixtures/attendance.json').then(data => setAttendance(data.default || []));
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to allow MSW to fully initialize
    setTimeout(fetchDashboardData, 100);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const unreadMessages = messages.filter(m => !m.readBy.includes(user.id));
  const todayAttendance = attendance.filter(a => isToday(a.date));
  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const enrolledCourses = courses.filter(c => c.enrolled > 0); // Simplified for demo
  const { quickStats, upcomingDeadlines, classSchedule, recentActivities } = additionalData;

  return (
    <div className="space-y-8">
      {/* Student Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900/50 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <span>Class: {user.className || 'S3-01'}</span>
              <span>•</span>
              <span>Student ID: {user.id}</span>
              <span>•</span>
              <span>Grade: {user.grade || 'Secondary 3'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">School Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Present</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Statistics Cards - Soft Color Palette */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Card - Soft Purple */}
        <Card className="border-0 bg-gradient-to-br from-purple-200/60 via-purple-300/60 to-purple-400/60 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">15%</span>
                </div>
                <p className="text-3xl font-bold mb-1">96.8%</p>
                <p className="text-sm text-slate-700/90 font-medium">Attendance</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Card - Soft Yellow */}
        <Card className="border-0 bg-gradient-to-br from-yellow-200/60 via-amber-300/60 to-orange-300/60 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">3%</span>
                </div>
                <p className="text-3xl font-bold mb-1">{enrolledCourses.length}</p>
                <p className="text-sm text-slate-700/90 font-medium">Courses</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Card - Soft Blue */}
        <Card className="border-0 bg-gradient-to-br from-blue-200/60 via-cyan-300/60 to-teal-300/60 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">3%</span>
                </div>
                <p className="text-3xl font-bold mb-1">{unreadMessages.length}</p>
                <p className="text-sm text-slate-700/90 font-medium">Messages</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <MessageSquare className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Card - Soft Green */}
        <Card className="border-0 bg-gradient-to-br from-emerald-200/60 via-green-300/60 to-teal-300/60 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">5%</span>
                </div>
                <p className="text-3xl font-bold mb-1">B+</p>
                <p className="text-sm text-slate-700/90 font-medium">Grade Average</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Award className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Schedule - Modern Calendar View */}
        <Card className="lg:col-span-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Weekly Schedule
              </CardTitle>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                September 2024
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Schedule Blocks - Soft Color Palette */}
            <div className="grid grid-cols-5 gap-3 h-64">
              {/* Monday */}
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-orange-200/70 to-orange-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-orange-300/30">
                  <div className="font-semibold">Math</div>
                  <div className="text-slate-700/80">Room 101</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-200/70 to-emerald-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-emerald-300/30">
                  <div className="font-semibold">Science</div>
                  <div className="text-slate-700/80">Room 201</div>
                </div>
              </div>
              
              {/* Tuesday */}
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-blue-200/70 to-blue-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-blue-300/30">
                  <div className="font-semibold">English</div>
                  <div className="text-slate-700/80">Room 102</div>
                </div>
                <div className="bg-gradient-to-br from-purple-200/70 to-purple-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-purple-300/30">
                  <div className="font-semibold">History</div>
                  <div className="text-slate-700/80">Room 301</div>
                </div>
              </div>
              
              {/* Wednesday */}
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-emerald-200/70 to-emerald-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-emerald-300/30">
                  <div className="font-semibold">Science</div>
                  <div className="text-slate-700/80">Lab 1</div>
                </div>
                <div className="bg-gradient-to-br from-orange-200/70 to-orange-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-orange-300/30">
                  <div className="font-semibold">Math</div>
                  <div className="text-slate-700/80">Room 101</div>
                </div>
              </div>
              
              {/* Thursday */}
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-purple-200/70 to-purple-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-purple-300/30">
                  <div className="font-semibold">Art</div>
                  <div className="text-slate-700/80">Studio A</div>
                </div>
                <div className="bg-gradient-to-br from-blue-200/70 to-blue-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-blue-300/30">
                  <div className="font-semibold">English</div>
                  <div className="text-slate-700/80">Room 102</div>
                </div>
              </div>
              
              {/* Friday */}
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-emerald-200/70 to-emerald-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-emerald-300/30">
                  <div className="font-semibold">PE</div>
                  <div className="text-slate-700/80">Gym</div>
                </div>
                <div className="bg-gradient-to-br from-orange-200/70 to-orange-300/70 text-slate-800 p-3 rounded-xl text-xs font-medium border border-orange-300/30">
                  <div className="font-semibold">Math</div>
                  <div className="text-slate-700/80">Room 101</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages - Modern Message List */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Messages
              </CardTitle>
              <Link to="/messages" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Items - Inspired by reference design */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  DR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Dr. Lila Ramirez</p>
                    <span className="text-xs text-slate-500">9:00 AM</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    Please ensure the monthly attendance report is accurate before the April 30th deadline.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  HM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Ms. Heather Morris</p>
                    <span className="text-xs text-slate-500">10:15 AM</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    Don't forget the staff training on digital tools scheduled for May 5th at 3 PM.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  CJ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Mr. Carl Jenkins</p>
                    <span className="text-xs text-slate-500">2:00 PM</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    Budget review meeting for the next fiscal year is on Monday.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 成绩管理 - Grade Management */}
        <Card className="border-emerald-200/50 dark:border-emerald-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-emerald-600" />
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 mb-1">B+</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Semester Average</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Mathematics</span>
                  <span className="font-medium text-slate-900 dark:text-white">A-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">English</span>
                  <span className="font-medium text-slate-900 dark:text-white">B+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Science</span>
                  <span className="font-medium text-slate-900 dark:text-white">A</span>
                </div>
              </div>
            </div>
            <Link to="/reports" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Grade Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 选课管理 - Course Selection */}
        <Card className="border-purple-200/50 dark:border-purple-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              Course Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{enrolledCourses.length}/7</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Selected/Total Courses</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Core Subjects</span>
                  <span className="font-medium text-slate-900 dark:text-white">5/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Electives</span>
                  <span className="font-medium text-slate-900 dark:text-white">2/2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Status</span>
                  <span className="text-green-600 font-medium text-sm">Completed</span>
                </div>
              </div>
            </div>
            <Link to="/enrolment" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Manage Selection
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classSchedule.map((class_, index) => (
                <div key={class_.id} className="flex items-center p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{class_.courseName}</p>
                    <p className="text-sm text-gray-600">{class_.time} • {class_.location}</p>
                    <p className="text-xs text-gray-500">{class_.teacher}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {class_.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 3).map((deadline) => {
                const priorityColors = {
                  high: 'border-red-200 bg-red-50',
                  medium: 'border-yellow-200 bg-yellow-50',
                  low: 'border-green-200 bg-green-50'
                };
                
                return (
                  <div key={deadline.id} className={`p-3 border rounded-lg ${priorityColors[deadline.priority]}`}>
                    <p className="font-medium text-sm">{deadline.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{deadline.course}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {formatDate(deadline.dueDate)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest academic activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.slice(0, 4).map((activity) => {
                const statusColors = {
                  completed: 'text-green-600 bg-green-100',
                  approved: 'text-blue-600 bg-blue-100',
                  unread: 'text-orange-600 bg-orange-100'
                };
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50/50 rounded-lg transition-colors">
                    <div className={`p-1 rounded-full ${statusColors[activity.status]}`}>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* 快捷操作 - Quick Actions */}
        <Card className="border-slate-200/50 dark:border-slate-700/30">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-slate-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Common functions and services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/leaves" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-12 text-left">
                <FileText className="h-4 w-4 mr-3 text-orange-600" />
                <div>
                  <div className="font-medium">Apply for Leave</div>
                  <div className="text-xs text-slate-500">Sick leave, personal leave</div>
                </div>
              </Button>
            </Link>
            <Link to="/enrolment" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-12 text-left">
                <BookOpen className="h-4 w-4 mr-3 text-purple-600" />
                <div>
                  <div className="font-medium">Course Management</div>
                  <div className="text-xs text-slate-500">View and modify selections</div>
                </div>
              </Button>
            </Link>
            <Link to="/attendance" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-12 text-left">
                <CheckCircle className="h-4 w-4 mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Attendance Records</div>
                  <div className="text-xs text-slate-500">View attendance status</div>
                </div>
              </Button>
            </Link>
            <Link to="/messages" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start h-12 text-left">
                <MessageSquare className="h-4 w-4 mr-3 text-amber-600" />
                <div>
                  <div className="font-medium">School Messages</div>
                  <div className="text-xs text-slate-500">Notices and announcements</div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 政府中学专属功能区 - Government Secondary School Features */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 学生数据档案 - Student Data Profile */}
        <Card className="border-blue-200/50 dark:border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Enrollment Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Admission Year</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">2022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Parent Contact</span>
                <span className="text-sm font-medium text-blue-600">Linked</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Emergency Contact</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Ms. Zhang</span>
              </div>
            </div>
            <Link to="/profiles/students" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Detailed Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 教师资源 - Teacher Resources */}
        <Card className="border-indigo-200/50 dark:border-indigo-800/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
              Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-white text-sm">Mathematics Materials</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mr. Lee • 15 files</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-white text-sm">English Listening Materials</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ms. Wang • 8 audio files</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-white text-sm">Science Lab Instructions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dr. Chen • 3 videos</p>
              </div>
            </div>
            <Link to="/courses" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Browse All Resources
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 数据大屏入口 - Data Dashboard */}
        <Card className="border-green-200/50 dark:border-green-800/30">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Learning Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-600 mb-1">87.5%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Monthly Learning Progress</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Assignment Submission</span>
                  <span className="font-medium text-green-600">98%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Class Participation</span>
                  <span className="font-medium text-blue-600">Good</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Study Hours</span>
                  <span className="font-medium text-slate-900 dark:text-white">28.5h</span>
                </div>
              </div>
            </div>
            <Link to="/reports" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Detailed Learning Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Modern Attendance Visualization - SchoolHub Style */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Weekly Attendance
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Absent</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Attendance Grid - Visual Calendar Style */}
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({length: 14}, (_, i) => {
                  const isPresent = Math.random() > 0.1;
                  const dayNumber = (i % 7) + 15;
                  return (
                    <div key={i} className="aspect-square relative">
                      <div className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer ${
                        isPresent 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}>
                        <div className="text-center">
                          <div className="text-xs font-bold">{dayNumber}</div>
                          {isPresent ? (
                            <CheckCircle className="h-3 w-3 mx-auto mt-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-lg font-bold text-blue-600">95%</div>
                <div className="text-xs text-slate-500">Overall Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Subject Grades */}
              <div className="space-y-4">
                {[
                  { subject: 'Mathematics', grade: 'A-', color: 'from-blue-400 to-blue-500', score: 88 },
                  { subject: 'English', grade: 'B+', color: 'from-emerald-400 to-emerald-500', score: 82 },
                  { subject: 'Science', grade: 'A', color: 'from-purple-400 to-purple-500', score: 92 },
                  { subject: 'History', grade: 'B', color: 'from-orange-400 to-orange-500', score: 78 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                      {item.grade}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">{item.subject}</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.score}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{width: `${item.score}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  B+
                </div>
                <div className="text-xs text-slate-500">Semester Average</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};