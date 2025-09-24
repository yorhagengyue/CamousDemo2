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
  ArrowRight
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Today's Classes */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Classes
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayClasses}</div>
          <p className="text-xs text-muted-foreground">
            classes scheduled
          </p>
          <div className="mt-4">
            <Link to="/attendance">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                Mark Attendance
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};
