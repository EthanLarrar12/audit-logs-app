import * as XLSX from 'xlsx';
import { AuditEvent } from '@/types/audit';
import { format } from 'date-fns';

export function exportToExcel(events: AuditEvent[], filename?: string) {
  // Transform events to flat structure for Excel
  const data = events.map((event) => ({
    'מזהה אירוע': event.id,
    'תאריך ושעה': format(new Date(event.created_at), 'dd/MM/yyyy HH:mm:ss'),
    'סוג שחקן': translateActorType(event.actor_type),
    'מזהה שחקן': event.actor_id || '—',
    'כתובת IP': event.actor_ip || '—',
    'פעולה': event.action,
    'סוג משאב': event.resource_type,
    'מזהה משאב': event.resource_id,
    'סוג יעד': event.target_type || '—',
    'מזהה יעד': event.target_id || '—',
    'תוצאה': event.outcome === 'success' ? 'הצלחה' : 'כישלון',
    'מזהה בקשה': event.request_id || '—',
    'מזהה מעקב': event.trace_id || '—',
    'מצב לפני': event.before_state ? JSON.stringify(event.before_state) : '—',
    'מצב אחרי': event.after_state ? JSON.stringify(event.after_state) : '—',
    'הקשר': event.context ? JSON.stringify(event.context) : '—',
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wch: 38 }, // מזהה אירוע
    { wch: 20 }, // תאריך ושעה
    { wch: 10 }, // סוג שחקן
    { wch: 20 }, // מזהה שחקן
    { wch: 15 }, // כתובת IP
    { wch: 20 }, // פעולה
    { wch: 15 }, // סוג משאב
    { wch: 25 }, // מזהה משאב
    { wch: 12 }, // סוג יעד
    { wch: 20 }, // מזהה יעד
    { wch: 10 }, // תוצאה
    { wch: 15 }, // מזהה בקשה
    { wch: 15 }, // מזהה מעקב
    { wch: 30 }, // מצב לפני
    { wch: 30 }, // מצב אחרי
    { wch: 30 }, // הקשר
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'יומן ביקורת');

  // Generate filename with timestamp
  const exportFilename =
    filename || `יומן_ביקורת_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;

  // Download the file
  XLSX.writeFile(workbook, exportFilename);
}

function translateActorType(type: 'user' | 'system' | 'service'): string {
  const translations = {
    user: 'משתמש',
    system: 'מערכת',
    service: 'שירות',
  };
  return translations[type];
}
