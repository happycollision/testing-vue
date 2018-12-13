import { expect } from 'chai';
import { csvToTableData } from '../../src/utils/csv-conversion';

describe('conversion', () => {
  it('shows the headers and data', () => {
    const data = csvToTableData('Header 1,Header 2\nData 1, Data 2');
    expect(data.header).to.include('Header 1');
    expect(data.header).to.include('Header 2');
    expect(data.rows[0]).to.eql({
      'Header 1': 'Data 1',
      'Header 2': 'Data 2',
    });
  });

  it('data is properly escaped', () => {
    const data = csvToTableData(
      'Header 1,Header 2\n"Data 1 with, quotes", Data 2',
    );
    expect(data.rows[0]['Header 1']).to.eql('Data 1 with, quotes');
  });
});
