import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  UserCheck, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Award,
  BarChart3,
  ChevronRight,
  Plus,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { User, Message, LeaveRequest } from '@/types';

interface TeacherDashboardProps {
  user: User;
}

export const TeacherDashboard = ({ user }: TeacherDashboardProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [messagesRes, leavesRes] = await Promise.all([
          fetch('/api/messages'),
          fetch('/api/leaves?status=pending'),
        ]);

        const [messagesData, leavesData] = await Promise.all([
          messagesRes.ok ? messagesRes.json().catch(() => []) : [],
          leavesRes.ok ? leavesRes.json().catch(() => []) : [],
        ]);

        setMessages(messagesData || []);
        setLeaves(leavesData || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use fallback data
        import('@/fixtures/messages.json').then(data => setMessages(data.default || []));
        import('@/fixtures/leaves.json').then(data => setLeaves(data.default || []));
      } finally {
        setLoading(false);
      }
    };

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

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const todayClasses = 3; // Mock data for demo
  const studentsToMark = 25; // Mock data for demo

  return (
    <div className="space-y-8">
      {/* Hero Banner - Teacher Welcome */}
      <Card className="border-0 bg-gradient-to-r from-cyan-200/70 via-blue-200/70 to-indigo-200/70 text-slate-800 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Your teaching classes are increasing</h2>
              <p className="text-lg opacity-90 mb-4">Great about 30% than last year</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>teacher@education.gov.sg</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>+65 1234 5678</span>
                </div>
              </div>
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-white/30 rounded-xl flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-slate-700" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards - Soft Color Palette */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Classes - Soft Purple */}
        <Card className="border-0 bg-gradient-to-br from-purple-200/50 via-purple-300/50 to-purple-400/50 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">15%</span>
                </div>
                <p className="text-3xl font-bold mb-1">147</p>
                <p className="text-sm text-slate-700/90 font-medium">Total Classes</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Students - Soft Yellow */}
        <Card className="border-0 bg-gradient-to-br from-yellow-200/50 via-amber-300/50 to-orange-300/50 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">5%</span>
                </div>
                <p className="text-3xl font-bold mb-1">3,250</p>
                <p className="text-sm text-slate-700/90 font-medium">Total Students</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Users className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Hours - Soft Blue */}
        <Card className="border-0 bg-gradient-to-br from-blue-200/50 via-cyan-300/50 to-teal-300/50 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">10%</span>
                </div>
                <p className="text-3xl font-bold mb-1">104,687</p>
                <p className="text-sm text-slate-700/90 font-medium">Total Hours</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Clock className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Income - Soft Green */}
        <Card className="border-0 bg-gradient-to-br from-emerald-200/50 via-green-300/50 to-teal-300/50 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-slate-700/80" />
                  <span className="text-xs font-medium text-slate-700/80">23%</span>
                </div>
                <p className="text-3xl font-bold mb-1">$1,682,500</p>
                <p className="text-sm text-slate-700/90 font-medium">Total Income</p>
              </div>
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Award className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students to Mark */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.pendingAttendance')}
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentsToMark}</div>
          <p className="text-xs text-muted-foreground">
            students awaiting attendance
          </p>
          <div className="mt-4">
            <Link to="/attendance">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                Mark Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.pendingApprovals')}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
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
          <p className="text-xs text-muted-foreground">
            leave requests to review
          </p>
          <div className="mt-4">
            <Link to="/leave">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                Review Requests
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Messages
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{messages.length}</div>
          <p className="text-xs text-muted-foreground">
            total conversations
          </p>
          <div className="mt-4">
            <Link to="/messages">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                View Messages
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common teaching tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Link to="/attendance">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <UserCheck className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </Link>
          <Link to="/messages">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
          </Link>
          <Link to="/leave">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Review Leaves
            </Button>
          </Link>
          <Link to="/students">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              View Students
            </Button>
          </Link>
        </CardContent>
      </Card>
      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Student Attendance Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Student Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-40 h-40 mx-auto mb-6">
              {/* Donut Chart Simulation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/60 to-purple-300/60"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-200/60 to-yellow-300/60"></div>
              <div className="absolute inset-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">80%</div>
                  <div className="text-xs text-slate-500">Average</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-300/60 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-300/60 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">Absent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Performance Chart */}
        <Card className="lg:col-span-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Student Performance
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300/60 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Class 10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-300/60 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Class 11</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-300/60 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Class 12</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bar Chart Simulation */}
            <div className="grid grid-cols-5 gap-4 h-48 items-end">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="space-y-1 mb-2">
                    <div className={`bg-blue-200/60 rounded-t-lg transition-all duration-500 hover:bg-blue-300/60`} 
                         style={{height: `${60 + index * 15}px`}}></div>
                    <div className={`bg-yellow-200/60 rounded-lg transition-all duration-500 hover:bg-yellow-300/60`}
                         style={{height: `${40 + index * 10}px`}}></div>
                    <div className={`bg-purple-200/60 rounded-b-lg transition-all duration-500 hover:bg-purple-300/60`}
                         style={{height: `${50 + index * 12}px`}}></div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{day}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <div className="text-lg font-bold text-slate-700">75%</div>
              <div className="text-xs text-slate-500">Weekly Average</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Teaching Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks List */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Tasks
              </CardTitle>
              <Button size="sm" className="bg-cyan-400/80 hover:bg-cyan-500/80 text-slate-800 border-0">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Task"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                />
              </div>
              
              <div className="space-y-2">
                {[
                  { task: 'Grade Student Essays', date: 'April 24, 2024', completed: false, color: 'bg-slate-100' },
                  { task: 'Update Lesson Plans', date: 'April 25, 2024', completed: true, color: 'bg-cyan-100/60' },
                  { task: 'Attend Department Meeting', date: 'April 26, 2024', completed: true, color: 'bg-cyan-100/60' },
                  { task: 'Compile Reports for Parent-Teacher', date: 'April 28, 2024', completed: false, color: 'bg-slate-100' }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 ${item.color} rounded-lg`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      item.completed ? 'bg-cyan-400/80 border-cyan-400/80' : 'border-slate-300'
                    }`}>
                      {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {item.task}
                      </p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center">
                        <FileText className="h-3 w-3 text-slate-600" />
                      </button>
                      <button className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Activity Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Teaching Activity
              </CardTitle>
              <span className="text-sm text-slate-500">Monthly</span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Activity Line Chart */}
            <div className="h-48 relative">
              <svg className="w-full h-full">
                <path
                  d="M 20 150 Q 60 120 100 100 T 180 80 T 260 120 T 340 90"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  className="drop-shadow-sm"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(252, 211, 77)" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="rgb(251, 191, 36)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-4 left-4 text-sm font-bold text-slate-700">
                120 Hours
              </div>
              <div className="absolute top-4 right-4 text-xs text-slate-500">
                Sept 10, 2024
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-lg font-bold text-amber-600">120</div>
              <div className="text-xs text-slate-500">Working Hours</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
