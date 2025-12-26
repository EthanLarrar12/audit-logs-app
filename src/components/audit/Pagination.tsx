import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationState } from '@/types/audit';

interface PaginationProps {
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
}

export function Pagination({ pagination, onPaginationChange }: PaginationProps) {
  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPaginationChange({ ...pagination, page: newPage });
    }
  };

  const setPageSize = (newSize: number) => {
    onPaginationChange({ ...pagination, pageSize: newSize, page: 1 });
  };

  // TODO: Integrate with API pagination
  // This should update query params and trigger a new API call
  // Example: GET /api/audit-events?page=2&pageSize=25

  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">{startItem}</span> to{' '}
        <span className="font-medium text-foreground">{endItem}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span> results
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="text-sm text-muted-foreground">
          Page{' '}
          <span className="font-medium text-foreground">{page}</span> of{' '}
          <span className="font-medium text-foreground">{totalPages}</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
