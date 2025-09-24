import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical as Flask, GraduationCap, Wrench, Building, TestTube } from 'lucide-react';

const LabsPage = () => {
  const { t } = useTranslation();

  const phase2Features = [
    {
      icon: GraduationCap,
      title: t('labs.assessment'),
      description: 'Online exams, quizzes, and grading system'
    },
    {
      icon: Building,
      title: t('labs.assets'),
      description: 'School asset management and tracking'
    },
    {
      icon: Wrench,
      title: t('labs.maintenance'),
      description: 'Facility maintenance and repair requests'
    },
    {
      icon: TestTube,
      title: t('labs.laboratory'),
      description: 'Laboratory booking and equipment management'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('labs.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('labs.comingSoon')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {phase2Features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconComponent className="h-5 w-5 mr-2 text-muted-foreground" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Flask className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {t('labs.comingSoon')}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export { LabsPage as Component };
