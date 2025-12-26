import { 
  Target, 
  User as UserIcon, 
  Database, 
  Key, 
  FileText, 
  Shield, 
  HardDrive,
  Clock,
  Folder
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TargetTypeBadgeProps {
  type: string | null;
  className?: string;
}

const targetConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  user: {
    icon: UserIcon,
    label: 'משתמש',
    className: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  },
  account: {
    icon: UserIcon,
    label: 'חשבון',
    className: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30',
  },
  storage: {
    icon: HardDrive,
    label: 'אחסון',
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  },
  api_group: {
    icon: Key,
    label: 'קבוצת API',
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  },
  database: {
    icon: Database,
    label: 'מסד נתונים',
    className: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  },
  report: {
    icon: FileText,
    label: 'דוח',
    className: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
  },
  session: {
    icon: Clock,
    label: 'הפעלה',
    className: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
  },
  role: {
    icon: Shield,
    label: 'תפקיד',
    className: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
  },
};

const defaultConfig = {
  icon: Target,
  label: 'יעד',
  className: 'bg-muted text-muted-foreground border-border',
};

export function TargetTypeBadge({ type, className }: TargetTypeBadgeProps) {
  if (!type) {
    return (
      <span className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs text-muted-foreground',
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
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
