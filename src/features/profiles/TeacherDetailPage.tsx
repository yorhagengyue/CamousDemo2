import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeacherDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Teacher ID: {id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Teacher profile details will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { TeacherDetailPage as Component };
