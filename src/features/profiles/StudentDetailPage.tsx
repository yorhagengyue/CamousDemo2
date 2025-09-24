import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Student ID: {id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Student profile details will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { StudentDetailPage as Component };
