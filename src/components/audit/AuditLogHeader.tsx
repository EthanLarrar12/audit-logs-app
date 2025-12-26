import { RefreshCw, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditLogHeaderProps {
  totalEvents: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export function AuditLogHeader({ totalEvents, onRefresh, isLoading }: AuditLogHeaderProps) {
  // TODO: Implement export functionality
  const handleExport = () => {
    console.log('TODO: Implement export to CSV/JSON');
  };

  return (
    <header className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
            <p className="text-sm text-muted-foreground">
              {totalEvents} events recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
}
