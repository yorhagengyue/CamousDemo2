import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Calendar,
  Award,
  ChevronLeft,
  Play,
  FileText,
  HelpCircle,
  User,
  MapPin,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const CourseDetailPage = () => {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id]);

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    
    setEnrolling(true);
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
          alert(`Successfully ${result.status === 'enrolled' ? 'enrolled' : 'added to waitlist'}!`);
          fetchCourse(course.id); // Refresh course data
        }
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="space-y-4">
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Course not found</p>
        <Link to="/courses">
          <Button variant="outline" className="mt-4">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  const enrollmentRate = (course.enrolled / course.capacity) * 100;
  const isAlmostFull = enrollmentRate > 90;
  const isFull = course.enrolled >= course.capacity;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Link to="/courses">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <CardDescription className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {course.grade}
                    </span>
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {course.credit} credits
                    </span>
                    <span className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      4.8 (124 reviews)
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {course.description || 'This course provides comprehensive coverage of the subject matter with hands-on learning experiences and practical applications. Students will develop both theoretical understanding and practical skills through interactive lessons, assignments, and projects.'}
              </p>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Explore the curriculum and learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              {course.chapters && course.chapters.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">
                        Chapter {index + 1}: {chapter.title}
                      </h3>
                      <div className="space-y-2">
                        {chapter.resources.map((resource) => {
                          const ResourceIcon = resource.type === 'video' ? Play : 
                                             resource.type === 'document' ? FileText : HelpCircle;
                          return (
                            <div key={resource.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                              <ResourceIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{resource.title}</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {resource.type}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Course content will be available after enrollment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p className="text-sm text-gray-600">System Teacher</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">12 weeks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p className="text-sm text-gray-600">Mon, Wed, Fri - 10:00 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">Room A-201</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-600">English</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Prerequisites</p>
                    <p className="text-sm text-gray-600">None</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">${Math.floor(Math.random() * 500) + 200}</h3>
                <p className="text-sm text-gray-600">Course Fee</p>
              </div>

              {user?.roles.includes('Student') && (
                <Button 
                  className="w-full mb-4" 
                  onClick={handleEnroll}
                  disabled={isFull || enrolling}
                >
                  {enrolling ? 'Enrolling...' : isFull ? 'Course Full' : 'Enroll Now'}
                </Button>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Enrollment Status:</span>
                  <span className={`font-medium ${
                    isFull ? 'text-red-600' : isAlmostFull ? 'text-yellow-600' : 'text-green-600'
                  }`}>
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

                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Full course access</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instructor support</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Course certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Students Enrolled:</span>
                <span className="font-medium">{course.enrolled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completion Rate:</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Grade:</span>
                <span className="font-medium">A-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Course Rating:</span>
                <span className="font-medium flex items-center">
                  <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
                  4.8/5
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Related Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">More courses coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { CourseDetailPage as Component };