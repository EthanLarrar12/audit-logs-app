import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutcomeBadgeProps {
  outcome: 'success' | 'failure';
  className?: string;
}

export function OutcomeBadge({ outcome, className }: OutcomeBadgeProps) {
  const isSuccess = outcome === 'success';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full',
        isSuccess
          ? 'bg-success/15 text-success border border-success/30'
          : 'bg-failure/15 text-failure border border-failure/30',
        className
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {isSuccess ? 'הצלחה' : 'כישלון'}
    </span>
  );
}
