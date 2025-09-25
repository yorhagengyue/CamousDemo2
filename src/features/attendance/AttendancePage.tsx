import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AttendanceRecord } from '@/types';
import { formatDate, isToday } from '@/utils/date';
import { useAuthStore } from '@/stores/authStore';
import { downloadCSV } from '@/utils/export';

const AttendancePage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'mark' | 'history'>('overview');

  // Mock attendance marking state for teachers
  const [classToMark, setClassToMark] = useState('');
  const [studentsToMark, setStudentsToMark] = useState([
    { id: 'user-1', name: 'Alice Tan', status: 'present' as 'present' | 'absent' | 'late', reason: '' },
    { id: 'user-6', name: 'Bob Chen', status: 'present' as 'present' | 'absent' | 'late', reason: '' },
    { id: 'user-7', name: 'Carol Wong', status: 'present' as 'present' | 'absent' | 'late', reason: '' }
  ]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?role=${user?.roles[0]}`);
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const myAttendance = attendance.filter(a => a.personId === user?.id);
    const total = myAttendance.length;
    const present = myAttendance.filter(a => a.status === 'present').length;
    const late = myAttendance.filter(a => a.status === 'late').length;
    const absent = myAttendance.filter(a => a.status === 'absent').length;
    
    return {
      total,
      present,
      late,
      absent,
      attendanceRate: total > 0 ? ((present + late) / total * 100) : 0
    };
  };

  const submitAttendance = async () => {
    try {
      const attendanceRecords = studentsToMark.map(student => ({
        personId: student.id,
        status: student.status,
        reason: student.reason,
        date: new Date().toISOString().split('T')[0],
        lessonId: 'lesson-current',
        lessonName: classToMark
      }));

      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceRecords)
      });

      if (response.ok) {
        alert('Attendance marked successfully!');
        fetchAttendance();
      }
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  const exportAttendance = () => {
    const exportData = attendance.map(record => ({
      Date: formatDate(record.date),
      Student: 'Student Name', // Would be populated from user data
      Status: record.status,
      Lesson: record.lessonName || 'N/A',
      Reason: record.reason || 'N/A',
      'Marked By': 'Teacher Name', // Would be populated from user data
      'Marked At': record.markedAt ? formatDate(record.markedAt) : 'N/A'
    }));
    
    downloadCSV(exportData, `attendance-${selectedMonth}.csv`);
  };

  const stats = calculateStats();

  const renderStudentView = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.attendanceRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">this semester</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.present}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">out of {stats.total} classes</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.late}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">times this semester</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{stats.absent}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">times this semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              {t('attendance.myAttendance')}
            </div>
            <Button variant="outline" size="sm" onClick={exportAttendance}>
              <Download className="h-4 w-4 mr-2" />
              {t('attendance.export')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendance.filter(a => a.personId === user?.id).slice(0, 10).map((record) => {
              const StatusIcon = record.status === 'present' ? CheckCircle :
                               record.status === 'late' ? Clock : XCircle;
              const statusColors = {
                present: 'text-green-600 bg-green-100',
                late: 'text-yellow-600 bg-yellow-100',
                absent: 'text-red-600 bg-red-100'
              };

              return (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusColors[record.status]}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{record.lessonName || 'Class'}</p>
                      <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                      {record.reason && (
                        <p className="text-xs text-gray-500">Reason: {record.reason}</p>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                    {record.status}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t('attendance.markAttendance')}
          </CardTitle>
          <CardDescription>Select class and mark student attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Select Class</label>
            <select
              value={classToMark}
              onChange={(e) => setClassToMark(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose a class...</option>
              <option value="Mathematics (Advanced) - S3-01">Mathematics (Advanced) - S3-01</option>
              <option value="Physics (Core) - S3-01">Physics (Core) - S3-01</option>
              <option value="History (Singapore) - S3-01">History (Singapore) - S3-01</option>
            </select>
          </div>

          {classToMark && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Student Attendance</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStudentsToMark(prev => 
                    prev.map(s => ({ ...s, status: 'present' as const, reason: '' }))
                  )}
                >
                  Mark All Present
                </Button>
              </div>

              <div className="space-y-2">
                {studentsToMark.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">Student ID: {student.id}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {(['present', 'late', 'absent'] as const).map((status) => (
                        <Button
                          key={status}
                          variant={student.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            const newStudents = [...studentsToMark];
                            newStudents[index] = { ...student, status };
                            setStudentsToMark(newStudents);
                          }}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                    
                    {student.status !== 'present' && (
                      <Input
                        placeholder="Reason"
                        value={student.reason}
                        onChange={(e) => {
                          const newStudents = [...studentsToMark];
                          newStudents[index] = { ...student, reason: e.target.value };
                          setStudentsToMark(newStudents);
                        }}
                        className="w-32"
                      />
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={submitAttendance} className="w-full">
                Submit Attendance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
          <CardDescription>Latest attendance data for your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendance.slice(0, 8).map((record) => {
              const StatusIcon = record.status === 'present' ? CheckCircle :
                               record.status === 'late' ? Clock : XCircle;
              const statusColors = {
                present: 'text-green-600 bg-green-100',
                late: 'text-yellow-600 bg-yellow-100',
                absent: 'text-red-600 bg-red-100'
              };

              return (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusColors[record.status]}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{record.lessonName || 'Class'}</p>
                      <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                      <p className="text-xs text-gray-500">Student: System User</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                    {record.status}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const isTeacher = user?.roles.some(role => ['Teacher', 'HOD'].includes(role));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('attendance.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isTeacher ? 'Mark attendance and manage class records' : 'Track your attendance and academic progress'}
        </p>
      </div>

      {/* Tab Navigation */}
      {isTeacher && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'mark', label: 'Mark Attendance', icon: UserCheck },
            { id: 'history', label: 'History', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Content based on role and tab */}
      {isTeacher && activeTab === 'mark' ? renderTeacherView() : renderStudentView()}
    </div>
  );
};

export { AttendancePage as Component };