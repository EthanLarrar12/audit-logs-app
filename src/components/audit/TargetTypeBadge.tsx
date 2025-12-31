import {
  Target,
  User as UserIcon,
  Database,
  Key,
  FileText,
  Shield,
  HardDrive,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { styles } from './TargetTypeBadge.styles';

interface TargetTypeBadgeProps {
  type: string | null;
  className?: string;
}

type StyleKey = keyof typeof styles;

const targetConfig: Record<string, { icon: React.ElementType; label: string; styleKey: StyleKey }> = {
  user: {
    icon: UserIcon,
    label: 'משתמש',
    styleKey: 'user',
  },
  account: {
    icon: UserIcon,
    label: 'חשבון',
    styleKey: 'account',
  },
  storage: {
    icon: HardDrive,
    label: 'אחסון',
    styleKey: 'storage',
  },
  api_group: {
    icon: Key,
    label: 'קבוצת API',
    styleKey: 'api_group',
  },
  database: {
    icon: Database,
    label: 'מסד נתונים',
    styleKey: 'database',
  },
  report: {
    icon: FileText,
    label: 'דוח',
    styleKey: 'report',
  },
  session: {
    icon: Clock,
    label: 'הפעלה',
    styleKey: 'session',
  },
  role: {
    icon: Shield,
    label: 'תפקיד',
    styleKey: 'role',
  },
};

const defaultConfig = {
  icon: Target,
  label: 'יעד',
  styleKey: 'default' as StyleKey,
};

export function TargetTypeBadge({ type, className }: TargetTypeBadgeProps) {
  if (!type) {
    return (
      <span className={cn(
        styles.emptyBadge,
        className
      )}>
        —
      </span>
    );
  }

  const config = targetConfig[type] || { ...defaultConfig, label: type };
  const Icon = config.icon;

  return (
    <span
      className={cn(
        styles.baseBadge,
        styles[config.styleKey],
        className
      )}
    >
      <Icon className={styles.icon} />
      {config.label}
    </span>
  );
}
