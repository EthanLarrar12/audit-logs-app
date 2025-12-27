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
import { styles } from './Pagination.styles';

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

  if (total === 0) return null;

  return (
    <div className={styles.container}>
      {/* Results info */}
      <div className={styles.infoText}>
        מציג{' '}
        <span className={styles.highlight}>{startItem}</span> עד{' '}
        <span className={styles.highlight}>{endItem}</span> מתוך{' '}
        <span className={styles.highlight}>{total}</span> תוצאות
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Page size selector */}
        <div className={styles.pageSizeSelector}>
          <span className={styles.infoText}>שורות בעמוד</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className={styles.selectTrigger}>
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
        <div className={styles.infoText}>
          עמוד{' '}
          <span className={styles.highlight}>{page}</span> מתוך{' '}
          <span className={styles.highlight}>{totalPages}</span>
        </div>

        {/* Navigation buttons - reversed for RTL */}
        <div className={styles.navigation}>
          <Button
            variant="outline"
            size="icon"
            className={styles.navButton}
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={styles.navButton}
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={styles.navButton}
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={styles.navButton}
            onClick={() => goToPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
