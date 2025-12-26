import { FileSearch, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export function EmptyState({ hasFilters, onResetFilters, onRefresh }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <FileSearch className="w-8 h-8 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No audit events found
      </h3>
      
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        {hasFilters
          ? 'No events match your current filter criteria. Try adjusting your filters or clearing them to see all events.'
          : 'There are no audit events recorded yet. Events will appear here as system activity occurs.'}
      </p>

      <div className="flex gap-3">
        {hasFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Clear filters
          </Button>
        )}
        <Button onClick={onRefresh} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
