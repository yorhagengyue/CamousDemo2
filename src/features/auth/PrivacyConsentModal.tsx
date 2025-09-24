import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyConsentModal = ({
  isOpen,
  onAccept,
  onDecline,
}: PrivacyConsentModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={() => onDecline()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('login.privacyConsent')}</DialogTitle>
          <DialogDescription>
            {t('login.privacyMessage')}
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3">
          <p>
            This digital campus platform collects and processes the following data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal identification information (name, email, student/staff ID)</li>
            <li>Academic records and enrollment data</li>
            <li>Attendance and leave records</li>
            <li>System usage and activity logs</li>
            <li>Communication and messaging data</li>
          </ul>
          <p>
            Data is used for educational purposes, system administration, and improving user experience.
            You can revoke consent at any time through the Settings page.
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={onAccept}>
            {t('login.accept')}
          </Button>
          <Button type="button" variant="secondary" onClick={onDecline}>
            {t('login.decline')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
