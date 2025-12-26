import { User, Server, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActorTypeBadgeProps {
  type: 'user' | 'system' | 'service';
  className?: string;
}

const config = {
  user: {
    icon: User,
    label: 'User',
    className: 'bg-badge-user/15 text-badge-user border-badge-user/30',
  },
  system: {
    icon: Server,
    label: 'System',
    className: 'bg-badge-system/15 text-badge-system border-badge-system/30',
  },
  service: {
    icon: Cog,
    label: 'Service',
    className: 'bg-badge-service/15 text-badge-service border-badge-service/30',
  },
};

export function ActorTypeBadge({ type, className }: ActorTypeBadgeProps) {
  const { icon: Icon, label, className: badgeClass } = config[type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        badgeClass,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
