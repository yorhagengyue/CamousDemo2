import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronRight,
  GraduationCap,
  Award,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Course } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const CoursesPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
          alert(`Successfully ${result.status === 'enrolled' ? 'enrolled' : 'added to waitlist'}!`);
          fetchCourses(); // Refresh course data
        }
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || course.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const grades = ['all', ...Array.from(new Set(courses.map(c => c.grade)))];

  const renderCourseCard = (course: Course) => {
    const enrollmentRate = (course.enrolled / course.capacity) * 100;
    const isAlmostFull = enrollmentRate > 90;
    const isFull = course.enrolled >= course.capacity;
    
    return (
      <Card key={course.id} className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">{course.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {course.grade}
                </span>
                <span className="flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  {course.credit} credits
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium ml-1">4.8</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description || 'Course description not available.'}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Enrollment</span>
              <span className={`font-medium ${isFull ? 'text-red-600' : isAlmostFull ? 'text-yellow-600' : 'text-green-600'}`}>
                {course.enrolled}/{course.capacity}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(enrollmentRate, 100)}%` }}
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Teacher: System</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>12 weeks</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/courses/${course.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            
            {user?.roles.includes('Student') && (
              <Button 
                size="sm" 
                onClick={() => handleEnroll(course.id)}
                disabled={isFull}
                className="flex-1"
              >
                {isFull ? 'Full' : 'Enroll'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCourseListItem = (course: Course) => {
    const enrollmentRate = (course.enrolled / course.capacity) * 100;
    const isFull = course.enrolled >= course.capacity;
    
    return (
      <Card key={course.id} className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{course.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {course.description || 'Course description not available.'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {course.grade}
                </span>
                <span>{course.credit} credits</span>
                <span>{course.enrolled}/{course.capacity} enrolled</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center text-yellow-500 mb-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium ml-1">4.8</span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      enrollmentRate > 90 ? 'bg-red-500' : enrollmentRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(enrollmentRate, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>
                {user?.roles.includes('Student') && (
                  <Button 
                    size="sm" 
                    onClick={() => handleEnroll(course.id)}
                    disabled={isFull}
                  >
                    {isFull ? 'Full' : 'Enroll'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('courses.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Discover and enroll in courses that match your academic goals
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                  </option>
                ))}
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid/List */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredCourses.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {filteredCourses.map(course => 
                viewMode === 'grid' ? renderCourseCard(course) : renderCourseListItem(course)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No courses found matching your criteria</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('all');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export { CoursesPage as Component };