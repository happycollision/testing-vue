import { Row, EditEvent } from '@/types/table-types';

function convertIfNumber(str: string) {
  const asNum = parseFloat(str);
  const reconverted = asNum.toString();
  if (reconverted === str) {
    return asNum;
  }
  return str;
}

export function csvToTableData(csv: string) {
  const [head, ...tail] = csv.split('\n').map((line) =>
    line
      .split(',')
      .reduce(
        (a, c, i) => {
          if (i === 0) {
            return [c];
          }
          const aIndex = a.length - 1;
          const last = a[aIndex];
          const hadOpener = /^\s*"/.test(last);
          const hasCloser = /"\s*$/.test(c);
          if (hadOpener) {
            a[aIndex] = `${last},${c}`;
          }
          if (hadOpener && hasCloser) {
            a[aIndex] = a[aIndex].trim().substring(1, a[aIndex].length - 1);
          }
          if (!hadOpener && hasCloser) {
            throw new Error('closing quote found without opening quote');
          }
          if (!hadOpener && !hasCloser) {
            a.push(c);
          }
          return a;
        },
        [] as string[],
      )
      .map((cell) => cell.trim())
      .map((cell) => convertIfNumber(cell)),
  );
  const header = head.map((s) => s.toString());
  const rows = tail.map((r) => {
    let row: Row = {};
    header.map((h, i) => (row[h] = r[i]));
    row = convertDates(row);
    return row;
  });
  return { header, rows };
}

function convertDates(row: Row): Row {
  Object.getOwnPropertyNames(row).forEach((headerName) => {
    if (/date/i.test(headerName)) {
      try {
        const date = new Date(row[headerName]).toLocaleString();
        row[headerName] = date;
      } catch (e) {} // tslint:disable-line
    }
  });
  return row;
}

export function editCsvViaRowEdit(
  originalCsv: string,
  event: EditEvent,
): string {
  return originalCsv
    .split('\n')
    .map((row) => {
      const isEditedRow = row.indexOf(event.row.ID.toString()) > -1;
      if (isEditedRow) {
        const baseReplacementString = event.row[event.column].toString();
        const originalHasComma = baseReplacementString.indexOf(',') > -1;
        const replacementString = originalHasComma
          ? `"${baseReplacementString}"`
          : baseReplacementString;
        const newHasComma = event.value.toString().indexOf(',') > -1;
        const replaceWith = newHasComma
          ? `"${event.value}"`
          : event.value.toString();
        return row.replace(replacementString, replaceWith);
      }
      return row;
    })
    .join('\n');
}
