import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserCheck, 
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { KPI } from '@/types';
import { formatDate } from '@/utils/date';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'term'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKpiData();
  }, [timeRange]);

  const fetchKpiData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/kpi?range=${timeRange}`);
      const data = await response.json();
      setKpiData(data);
    } catch (error) {
      console.error('Failed to fetch KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return { trend: 'neutral', change: 0 };
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const change = ((current - previous) / previous) * 100;
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(change)
    };
  };

  const latestKpi = kpiData[kpiData.length - 1] || {
    attendanceRate: 0,
    leaveRate: 0,
    enrollCount: 0,
    dau: 0,
    wau: 0,
    avgApprovalHours: 0,
    errorRate: 0,
  };

  const attendanceTrend = calculateTrend(kpiData.map(k => k.attendanceRate));
  const dauTrend = calculateTrend(kpiData.map(k => k.dau));
  const enrollmentTrend = calculateTrend(kpiData.map(k => k.enrollCount));
  const errorTrend = calculateTrend(kpiData.map(k => k.errorRate));

  const exportReport = () => {
    const reportData = kpiData.map(kpi => ({
      Date: formatDate(kpi.date),
      'Attendance Rate': `${kpi.attendanceRate.toFixed(1)}%`,
      'Leave Rate': `${kpi.leaveRate.toFixed(1)}%`,
      'Enrollment Count': kpi.enrollCount,
      'Daily Active Users': kpi.dau,
      'Weekly Active Users': kpi.wau,
      'Avg Approval Hours': kpi.avgApprovalHours.toFixed(1),
      'Error Rate': `${kpi.errorRate.toFixed(1)}%`
    }));
    
    import('@/utils/export').then(({ downloadCSV }) => {
      downloadCSV(reportData, `kpi-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
    });
  };

  const mockGradeComparison = [
    { grade: 'S1', attendanceRate: 96.2, students: 120 },
    { grade: 'S2', attendanceRate: 94.8, students: 115 },
    { grade: 'S3', attendanceRate: 92.1, students: 108 },
    { grade: 'S4', attendanceRate: 89.7, students: 98 }
  ];

  const mockLeaveTypes = [
    { type: 'Sick Leave', count: 45, percentage: 52 },
    { type: 'Personal Leave', count: 28, percentage: 32 },
    { type: 'Other', count: 14, percentage: 16 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('reports.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor key performance indicators and system health
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="term">This Term</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={fetchKpiData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('reports.attendanceRate')}</p>
                <p className="text-2xl font-bold mt-1">{latestKpi.attendanceRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-3 w-3 mr-1 ${attendanceTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-xs font-medium ${attendanceTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {attendanceTrend.change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('reports.activeUsers')}</p>
                <p className="text-2xl font-bold mt-1">{latestKpi.dau}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-3 w-3 mr-1 ${dauTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-xs font-medium ${dauTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {dauTrend.change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">daily active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('reports.enrollmentCount')}</p>
                <p className="text-2xl font-bold mt-1">{latestKpi.enrollCount}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-3 w-3 mr-1 ${enrollmentTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-xs font-medium ${enrollmentTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {enrollmentTrend.change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">new enrollments</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('reports.errorRate')}</p>
                <p className="text-2xl font-bold mt-1">{latestKpi.errorRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className={`h-3 w-3 mr-1 ${errorTrend.trend === 'down' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-xs font-medium ${errorTrend.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                {errorTrend.change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">system health</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grade Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              {t('reports.gradeComparison')}
            </CardTitle>
            <CardDescription>Attendance rates by grade level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGradeComparison.map((grade) => (
                <div key={grade.grade} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium">{grade.grade}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{grade.attendanceRate}%</span>
                      <span className="text-xs text-gray-500">{grade.students} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${grade.attendanceRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              {t('reports.leaveTypes')}
            </CardTitle>
            <CardDescription>Distribution of leave request types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaveTypes.map((leaveType, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
                return (
                  <div key={leaveType.type} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded ${colors[index]}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{leaveType.type}</span>
                        <span className="text-sm">{leaveType.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{leaveType.count} requests</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${colors[index]} h-2 rounded-full transition-all`}
                            style={{ width: `${leaveType.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              System Performance
            </CardTitle>
            <CardDescription>Platform health and usage metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">System Uptime</span>
                </div>
                <span className="font-bold text-green-600">99.9%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                <span className="font-bold text-blue-600">145ms</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">Database Health</span>
                </div>
                <span className="font-bold text-purple-600">Optimal</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-medium">Error Rate</span>
                </div>
                <span className="font-bold text-yellow-600">{latestKpi.errorRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
            <CardDescription>Comprehensive performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Weekly Active Users</p>
                  <p className="text-xl font-bold text-blue-600">{latestKpi.wau}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Approval Time</p>
                  <p className="text-xl font-bold text-green-600">{latestKpi.avgApprovalHours.toFixed(1)}h</p>
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Leave Approval Rate</p>
                <p className="text-xl font-bold text-purple-600">89.2%</p>
                <p className="text-xs text-gray-500 mt-1">last 30 days</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Course Completion Rate</p>
                <p className="text-xl font-bold text-orange-600">94.7%</p>
                <p className="text-xs text-gray-500 mt-1">current semester</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trend Analysis
          </CardTitle>
          <CardDescription>Performance trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Attendance improving</p>
                    <p className="text-xs text-gray-600">+2.3% increase this week</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">High user engagement</p>
                    <p className="text-xs text-gray-600">DAU consistently above target</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Approval times stable</p>
                    <p className="text-xs text-gray-600">Average 4.2 hours response</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium">Focus on S4 attendance</p>
                  <p className="text-xs text-gray-600">S4 grade shows lowest attendance rate (89.7%)</p>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium">Optimize leave process</p>
                  <p className="text-xs text-gray-600">Consider streamlining sick leave approvals</p>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium">Maintain error rate</p>
                  <p className="text-xs text-gray-600">Current error rate is within acceptable range</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ReportsPage as Component };