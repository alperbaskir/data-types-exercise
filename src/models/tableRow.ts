
export interface TableRow {
  data: Record<string, string>;
  kids: Record<string, { records: TableRow[] }>;
  }
  

export default TableRow;