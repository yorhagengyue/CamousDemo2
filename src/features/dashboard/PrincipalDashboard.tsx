import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  TrendingUp,
  Activity,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { User, KPI } from '@/types';

interface PrincipalDashboardProps {
  user: User;
}

export const PrincipalDashboard = ({ user }: PrincipalDashboardProps) => {
  const { t } = useTranslation();
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const kpiRes = await fetch('/api/kpi?range=week');
        const kpiData = await kpiRes.json();
        setKpiData(kpiData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
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

  const latestKpi = kpiData[kpiData.length - 1] || {
    attendanceRate: 0,
    leaveRate: 0,
    enrollCount: 0,
    dau: 0,
    wau: 0,
    avgApprovalHours: 0,
    errorRate: 0,
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reports.attendanceRate')}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestKpi.attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              this week average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reports.activeUsers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestKpi.dau}</div>
            <p className="text-xs text-muted-foreground">
              daily active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reports.enrollmentCount')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestKpi.enrollCount}</div>
            <p className="text-xs text-muted-foreground">
              new enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reports.errorRate')}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestKpi.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              system error rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Active Users</span>
              <span className="font-medium">{latestKpi.dau}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Weekly Active Users</span>
              <span className="font-medium">{latestKpi.wau}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Approval Time</span>
              <span className="font-medium">{latestKpi.avgApprovalHours.toFixed(1)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="font-medium text-red-600">{latestKpi.errorRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/reports">
              <Button variant="outline" size="sm" className="w-full justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Reports
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm" className="w-full justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  System Management
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" size="sm" className="w-full justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  School Announcements
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
