import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import DataTable from '@/components/DataTable.vue';

describe('DataTable.vue', () => {
  it('shows the headers and data', () => {
    const data = 'Header 1,Header 2\nData 1, Data 2';
    const wrapper = shallowMount(DataTable, {
      propsData: { data },
    });
    expect(wrapper.text()).to.include('Header 1');
    expect(wrapper.text()).to.include('Header 2');
    expect(wrapper.text()).to.include('Data 1');
    expect(wrapper.text()).to.include('Data 2');
  });

  it('data is in a proper table', () => {
    const data = 'Header 1,Header 2\nData 1, Data 2';
    const wrapper = shallowMount(DataTable, {
      propsData: { data },
    });
    const headerCols = wrapper.findAll('th');
    const cells = wrapper.findAll('td');
    expect(headerCols.at(0).text()).to.include('Header 1');
    expect(headerCols.at(1).text()).to.include('Header 2');
    expect(cells.at(0).text()).to.include('Data 1');
    expect(cells.at(1).text()).to.include('Data 2');
  });

  it('data is properly escaped', () => {
    const data = 'Header 1,Header 2\n"Data 1 with, quotes", Data 2';
    const wrapper = shallowMount(DataTable, {
      propsData: { data },
    });
    const cells = wrapper.findAll('td');
    expect(cells.at(0).text()).to.include('Data 1 with, quotes');
  });

  it('data can be sorted', (done) => {
    const data = 'Header 1,Header 2\n3,3\n20,20\nb,b\na,a\n1,1';
    const wrapper = shallowMount(DataTable, {
      propsData: { data },
    });

    wrapper.find('button').trigger('click');

    wrapper.vm.$nextTick(() => {
      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('11');
      expect(rows.at(2).text()).to.include('33');
      expect(rows.at(3).text()).to.include('2020');
      expect(rows.at(4).text()).to.include('bb');
      expect(rows.at(5).text()).to.include('aa');
      done();
    });
  });
});
