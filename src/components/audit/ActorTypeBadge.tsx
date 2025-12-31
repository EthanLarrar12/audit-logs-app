import { User, Server, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { styles } from './ActorTypeBadge.styles';

interface ActorTypeBadgeProps {
  type: 'user' | 'system' | 'service';
  className?: string;
}

const config = {
  user: {
    icon: User,
    label: 'משתמש',
    styleKey: 'user' as const,
  },
  system: {
    icon: Server,
    label: 'מערכת',
    styleKey: 'system' as const,
  },
  service: {
    icon: Cog,
    label: 'שירות',
    styleKey: 'service' as const,
  },
};

export function ActorTypeBadge({ type, className }: ActorTypeBadgeProps) {
  const { icon: Icon, label, styleKey } = config[type];

  return (
    <span
      className={cn(
        styles.baseBadge,
        styles[styleKey],
        className
      )}
    >
      <Icon className={styles.icon} />
      {label}
    </span>
  );
}
