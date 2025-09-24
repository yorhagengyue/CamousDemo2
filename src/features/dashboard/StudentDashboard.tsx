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
  Bell
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
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          const colorClasses = {
            green: 'text-green-600 bg-green-50',
            red: 'text-red-600 bg-red-50', 
            yellow: 'text-yellow-600 bg-yellow-50',
            blue: 'text-blue-600 bg-blue-50'
          }[stat.color];
          
          return (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <TrendIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendIcon className={`h-3 w-3 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Classes */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.todayClasses')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance.length}</div>
            <p className="text-xs text-gray-500">
              {todayAttendance.filter(a => a.status === 'present').length} attended
            </p>
            <div className="mt-4">
              <Link to="/attendance">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Unread Messages */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.unreadMessages')}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages.length}</div>
            <p className="text-xs text-gray-500">
              {messages.length} total messages
            </p>
            <div className="mt-4">
              <Link to="/messages">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Messages
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Course Enrollment */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-gray-500">
              courses this semester
            </p>
            <div className="mt-4">
              <Link to="/courses">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  View Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Leave Status */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.leaveStatus')}
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{pendingLeaves.length}</div>
              {pendingLeaves.length > 0 ? (
                <Clock className="h-4 w-4 text-yellow-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {pendingLeaves.length > 0 ? 'pending approval' : 'no pending leaves'}
            </p>
            <div className="mt-4">
              <Link to="/leave">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Manage Leaves
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
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
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/leave" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </Link>
            <Link to="/courses" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
            <Link to="/messages" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};