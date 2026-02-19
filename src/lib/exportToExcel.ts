import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AuditEvent } from '@/types/audit';
import { AuditFilters } from '@/types/audit';
import { format } from 'date-fns';
import { getSubcategoryName, getCategoryName } from '@/constants/filterOptions';
import { AUDIT_HEADERS, AUDIT_FILTER_LABELS } from '@/constants/auditHeaders';

export async function exportToExcel(
  events: AuditEvent[],
  filters: AuditFilters,
  filename?: string
) {
  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('היסטוריית_פעולות', {
    views: [{ rightToLeft: true }]
  });

  const filterRows = [
    { label: AUDIT_FILTER_LABELS.EXPORT_DATE, value: format(new Date(), 'dd/MM/yyyy HH:mm') },
    { label: AUDIT_FILTER_LABELS.DATE_RANGE, value: getFilterDateRange(filters) },
    { label: AUDIT_FILTER_LABELS.FREE_SEARCH, value: filters.generalSearchObjects?.map(o => o.name).join(', ') || '-' },
    { label: AUDIT_FILTER_LABELS.CATEGORIES, value: filters.category?.map(c => getCategoryName(c)).join(', ') || 'הכל' },
    { label: AUDIT_FILTER_LABELS.ACTIONS, value: filters.action?.map(a => getSubcategoryName(a)).join(', ') || 'הכל' },
  ];

  let currentRow = 1;

  // Title for the report
  worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
  const titleCell = worksheet.getCell(`A${currentRow}`);
  titleCell.value = "דוח היסטוריית פעולות במיראז'";
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center' };
  currentRow += 2;

  // Add filter rows
  filterRows.forEach((row) => {
    const labelCell = worksheet.getCell(`A${currentRow}`);
    const valueCell = worksheet.getCell(`B${currentRow}`);

    labelCell.value = row.label;
    labelCell.font = { bold: true };
    valueCell.value = row.value;

    currentRow++;
  });

  currentRow += 1; // Spacing before table

  // --- 2. Define Columns and Headers ---
  // We need to handle merged headers, so we'll define the structure conceptually first

  const startRow = currentRow;
  const headerRow1 = worksheet.getRow(startRow);
  const headerRow2 = worksheet.getRow(startRow + 1);

  // Define the columns data mapping
  const columns = [
    { key: 'created_at', width: 22 },
    // Actor
    { key: 'actor_id', width: 25 },
    { key: 'actor_username', width: 20 },
    // Action
    { key: 'action', width: 25 },
    // Target
    { key: 'target_id', width: 25 },
    { key: 'target_name', width: 20 },
    // Resource
    { key: 'resource_id', width: 25 },
    { key: 'resource_name', width: 20 },
  ];

  // Set widths
  worksheet.columns = columns.map(c => ({ key: c.key, width: c.width }));

  // A: Date
  worksheet.getCell(`A${startRow}`).value = AUDIT_HEADERS.TIME;
  worksheet.mergeCells(`A${startRow}:A${startRow + 1}`);

  // B-C: Actor
  worksheet.getCell(`B${startRow}`).value = AUDIT_HEADERS.ACTOR;
  worksheet.mergeCells(`B${startRow}:C${startRow}`);

  // D: Action
  worksheet.getCell(`D${startRow}`).value = AUDIT_HEADERS.ACTION;
  worksheet.mergeCells(`D${startRow}:D${startRow + 1}`);

  // E-F: Target
  worksheet.getCell(`E${startRow}`).value = AUDIT_HEADERS.TARGET;
  worksheet.mergeCells(`E${startRow}:F${startRow}`);

  // G-H: Resource
  worksheet.getCell(`G${startRow}`).value = AUDIT_HEADERS.RESOURCE;
  worksheet.mergeCells(`G${startRow}:H${startRow}`);



  // --- Header Row 2 (Sub-headers) ---
  worksheet.getCell(`B${startRow + 1}`).value = 'מזהה';
  worksheet.getCell(`C${startRow + 1}`).value = 'שם';

  worksheet.getCell(`E${startRow + 1}`).value = 'מזהה';
  worksheet.getCell(`F${startRow + 1}`).value = 'שם';

  worksheet.getCell(`G${startRow + 1}`).value = 'מזהה';
  worksheet.getCell(`H${startRow + 1}`).value = 'שם';


  // Style Header Rows
  // Style Header Rows (commented out to avoid styling empty cells)
  // [headerRow1, headerRow2].forEach(row => {
  //   row.font = { bold: true, color: { argb: 'FFFFFF' } };
  //   row.fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: '4F81BD' },
  //   };
  //   row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  //   row.commit();
  // });

  // Explicitly style the cells in the merged ranges to ensure background color applies
  // (ExcelJS sometimes needs this for merged cells)
  for (let c = 1; c <= 8; c++) {
    const cell1 = worksheet.getCell(startRow, c);
    const cell2 = worksheet.getCell(startRow + 1, c);

    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    } as const;

    // @ts-ignore
    cell1.style = { ...cell1.style, ...headerStyle };
    // @ts-ignore
    cell2.style = { ...cell2.style, ...headerStyle };
  }

  // Default style for data cells
  // const defaultDataStyle = {
  //   alignment: { vertical: "top", wrapText: true, horizontal: "right" },
  // };

  currentRow += 2;

  // --- 3. Add Data ---
  events.forEach((event) => {
    const rowData = {
      created_at: format(new Date(event.created_at), 'dd/MM/yyyy HH:mm:ss'),
      actor_id: event.actor_id || '—',
      actor_username: event.actor_username || '—',
      action: getSubcategoryName(event.action),
      target_id: event.target_id || '—',
      target_name: event.target_name || '-',
      resource_id: event.resource_id || '—',
      resource_name: event.resource_name || '—',
    };

    // We map manually to ensure order matches columns
    const rowValues = columns.map(col => rowData[col.key as keyof typeof rowData]);
    const row = worksheet.addRow(rowValues);

    // Add borders to data cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'top', horizontal: 'right', wrapText: true };
    });
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create blob and save
  const exportFilename = filename || `היסטוריית_פעולות_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, exportFilename);
}

function getFilterDateRange(filters: AuditFilters): string {
  if (!filters.dateFrom && !filters.dateTo) return 'הכל';
  const from = filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yyyy') : 'התחלה';
  const to = filters.dateTo ? format(filters.dateTo, 'dd/MM/yyyy') : 'עד היום';
  return `${from} - ${to}`;
}
