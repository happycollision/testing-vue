export interface Row {
  [s: string]: string | number | Date;
}

export interface EditEvent {
  row: Row;
  column: string;
  value: string | number;
}
