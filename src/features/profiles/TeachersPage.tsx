import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TeachersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('navigation.teachers')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Faculty profiles and information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Faculty Directory
          </CardTitle>
          <CardDescription>Search and view teacher profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Teacher directory will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { TeachersPage as Component };
