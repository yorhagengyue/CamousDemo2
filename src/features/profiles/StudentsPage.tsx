import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const StudentsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('navigation.students')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Student profiles and academic records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Student Directory
          </CardTitle>
          <CardDescription>Search and view student profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Student directory and profile management will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { StudentsPage as Component };
