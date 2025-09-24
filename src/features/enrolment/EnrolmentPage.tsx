import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Course, Enrollment } from '@/types';
import { formatDate } from '@/utils/date';
import { useAuthStore } from '@/stores/authStore';

const EnrolmentPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/enrollments')
      ]);

      const [coursesData, enrollmentsData] = await Promise.all([
        coursesRes.json(),
        enrollmentsRes.json()
      ]);

      setCourses(coursesData);
      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error('Failed to fetch enrollment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const myEnrollments = enrollments.filter(e => e.studentId === user?.id);
  const enrolledCourses = courses.filter(c => 
    myEnrollments.some(e => e.courseId === c.id)
  );

  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credit, 0);
  const completedCourses = myEnrollments.filter(e => e.status === 'enrolled').length;
  const waitlistCourses = myEnrollments.filter(e => e.status === 'waitlist').length;

  // Mock enrollment tasks
  const enrollmentTasks = [
    {
      id: 'task-1',
      name: 'Semester 1 Core Subjects',
      description: 'Select your mandatory core subjects for the first semester',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-01-30T23:59:59Z',
      status: 'completed' as const,
      eligibleGrades: ['S1', 'S2', 'S3']
    },
    {
      id: 'task-2', 
      name: 'Elective Courses Selection',
      description: 'Choose from available elective courses to complete your study plan',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-15T23:59:59Z',
      status: 'ongoing' as const,
      eligibleGrades: ['S2', 'S3', 'S4']
    },
    {
      id: 'task-3',
      name: 'Advanced Track Selection',
      description: 'Select advanced level courses for specialized learning',
      startDate: '2024-02-16T00:00:00Z',
      endDate: '2024-03-01T23:59:59Z',
      status: 'upcoming' as const,
      eligibleGrades: ['S3', 'S4']
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('enrollment.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your course enrollments and track academic progress
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold mt-1">{totalCredits}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">out of 24 required</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold mt-1">{completedCourses}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">active this semester</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waitlist</p>
                <p className="text-2xl font-bold mt-1">{waitlistCourses}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">pending enrollment</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold mt-1">75%</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">toward graduation</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {t('enrollment.tasks')}
          </CardTitle>
          <CardDescription>Current and upcoming enrollment periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollmentTasks.map((task) => {
              const statusColors = {
                completed: 'border-green-200 bg-green-50',
                ongoing: 'border-blue-200 bg-blue-50',
                upcoming: 'border-gray-200 bg-gray-50'
              };
              
              const StatusIcon = task.status === 'completed' ? CheckCircle :
                              task.status === 'ongoing' ? Clock : AlertCircle;
              
              return (
                <div key={task.id} className={`p-4 border rounded-lg ${statusColors[task.status]}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${
                          task.status === 'completed' ? 'text-green-600' :
                          task.status === 'ongoing' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <h3 className="font-semibold">{task.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Period: {formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                        <span>Grades: {task.eligibleGrades.join(', ')}</span>
                      </div>
                    </div>
                    {task.status === 'ongoing' && (
                      <Link to="/courses">
                        <Button size="sm" className="ml-4">
                          Select Courses
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* My Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            {t('enrollment.myEnrollments')}
          </CardTitle>
          <CardDescription>Your enrolled courses this semester</CardDescription>
        </CardHeader>
        <CardContent>
          {enrolledCourses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledCourses.map((course) => {
                const enrollment = myEnrollments.find(e => e.courseId === course.id);
                return (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.grade} • {course.credit} credits</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        enrollment?.status === 'enrolled' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {enrollment?.status || 'enrolled'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Enrolled: {formatDate(enrollment?.enrolledAt || '')}
                      </div>
                      <Link to={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses enrolled yet</p>
              <Link to="/courses">
                <Button className="mt-4">
                  Browse Courses
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { EnrolmentPage as Component };