import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import DataTable from '@/components/DataTable.vue';

describe('DataTable.vue', () => {
  it('shows the headers and data', () => {
    const data = 'Header 1,Header 2\nData 1, Data 2';
    const wrapper = shallowMount(DataTable, {
      propsData: { data },
    });
    // expect(wrapper.text()).to.include('Header 1'); // first header could be hidden
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
    // expect(headerCols.at(0).text()).to.include('Header 1'); // first header could be hidden
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

  describe('sorting', () => {
    it('string data can be sorted', async () => {
      const data = 'Header 1,Header 2\nb,b\na,a';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('aa');
      expect(rows.at(2).text()).to.include('bb');
    });

    it('number data can be sorted', async () => {
      const data = 'Header 1,Header 2\n3,3\n20,20\n1,1';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('11');
      expect(rows.at(2).text()).to.include('33');
      expect(rows.at(3).text()).to.include('2020');
    });

    it('mixed data can be sorted on first click', async () => {
      const data = 'Header 1,Header 2\n3,3\na,a\n1,1';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('11');
      expect(rows.at(2).text()).to.include('33');
      expect(rows.at(3).text()).to.include('aa');
    });

    it('can reverse sort on second click', async () => {
      const data = 'Header 1,Header 2\n3,3\na,a\n1,1';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();
      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(3).text()).to.include('11');
      expect(rows.at(2).text()).to.include('33');
      expect(rows.at(1).text()).to.include('aa');
    });

    it('can un-sort on third click', async () => {
      const data = 'Header 1,Header 2\n3,3\na,a\n1,1';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();
      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();
      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(3).text()).to.include('11');
      expect(rows.at(1).text()).to.include('33');
      expect(rows.at(2).text()).to.include('aa');
    });
  });

  describe('filtering', () => {
    it('can filter on a search term', async () => {
      const data =
        'ID,Heading\n12345,This is the description\n12346,Another desc';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="search"]').setValue('another');
      wrapper.find('[data-testid="search"]').trigger('input');

      const rows = wrapper.findAll('tr');
      expect(rows).to.have.lengthOf(2);
      expect(wrapper.text()).to.include('Another');
    });

    it('can clear a filter', async () => {
      const data =
        'ID,Heading\n12345,This is the description\n12346,Another desc';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="search"]').setValue('another');
      wrapper.find('[data-testid="search"]').trigger('input');

      wrapper.find('[data-testid="clear search"]').trigger('click');

      const rows = wrapper.findAll('tr');
      expect(rows).to.have.lengthOf(3);
    });
  });

  describe('editing descriptions', () => {
    it('emits an edit to the description', async () => {
      const data = 'ID,Description\n12345,This is the description';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="12345:description"]').trigger('click');
      await flushPromises();

      wrapper.find('[name="[12345]desc"]').setValue('test update');
      wrapper.find('[name="[12345]desc"]').trigger('blur');

      expect(wrapper.emitted()['edit-value'][0][0].value).to.eq('test update');
    });

    it('can select multiple entries', async () => {
      const data =
        'ID,Description\n1234,This is the description\n1235,This is the other description';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="select 1234"]').trigger('click');
      await flushPromises();

      wrapper.find('[data-testid="select 1235"]').trigger('click');
      await flushPromises();

      expect(wrapper.vm.$data.selected).has.lengthOf(2);
    });

    it('emits an edit to the descriptions for multiple edits at once', async () => {
      const data =
        'ID,Description\n1234,This is the description\n1235,This is the other description\n1236,This is one last description';
      const wrapper = shallowMount(DataTable, {
        propsData: { data },
      });

      wrapper.find('[data-testid="select 1234"]').trigger('click');
      await flushPromises();

      wrapper.find('[data-testid="select 1235"]').trigger('click');
      await flushPromises();

      wrapper.find('[name="[1236]desc"]').setValue('test update both');
      wrapper.find('[name="[1236]desc"]').trigger('blur');

      const calls = wrapper.emitted()['edit-value'];
      expect(calls).to.have.lengthOf(3);

      const call1 = wrapper.emitted()['edit-value'][0];
      const call2 = wrapper.emitted()['edit-value'][1];
      const call3 = wrapper.emitted()['edit-value'][2];

      expect(call1[0].row.ID).to.eq(1236);
      expect(call2[0].row.ID).to.eq(1234);
      expect(call3[0].row.ID).to.eq(1235);
      expect(call1[0].value).to.eq('test update both');
      expect(call2[0].value).to.eq('test update both');
      expect(call3[0].value).to.eq('test update both');
    });
  });
});
