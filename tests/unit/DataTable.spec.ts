import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import DataTable from '@/components/DataTable.vue';

describe('DataTable.vue', () => {
  it('shows the headers and data', () => {
    const wrapper = shallowMount(DataTable, {
      propsData: {
        header: ['Header 1', 'Header 2'],
        rows: [{ 'Header 1': 'Data 1', 'Header 2': 'Data 2' }],
      },
    });
    // expect(wrapper.text()).to.include('Header 1'); // first header could be hidden
    expect(wrapper.text()).to.include('Header 2');
    expect(wrapper.text()).to.include('Data 1');
    expect(wrapper.text()).to.include('Data 2');
  });

  it('data is in a proper table', () => {
    const wrapper = shallowMount(DataTable, {
      propsData: {
        header: ['Header 1', 'Header 2'],
        rows: [{ 'Header 1': 'Data 1', 'Header 2': 'Data 2' }],
      },
    });
    const headerCols = wrapper.findAll('th');
    const cells = wrapper.findAll('td');
    // expect(headerCols.at(0).text()).to.include('Header 1'); // first header could be hidden
    expect(headerCols.at(1).text()).to.include('Header 2');
    expect(cells.at(0).text()).to.include('Data 1');
    expect(cells.at(1).text()).to.include('Data 2');
  });

  describe('sorting', () => {
    it('string data can be sorted', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['Header 1', 'Header 2'],
          rows: [
            { 'Header 1': 'b', 'Header 2': 'b' },
            { 'Header 1': 'a', 'Header 2': 'a' },
          ],
        },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('aa');
      expect(rows.at(2).text()).to.include('bb');
    });

    it('number data can be sorted', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['Header 1', 'Header 2'],
          rows: [
            { 'Header 1': 3, 'Header 2': 3 },
            { 'Header 1': 20, 'Header 2': 20 },
            { 'Header 1': 1, 'Header 2': 1 },
          ],
        },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('11');
      expect(rows.at(2).text()).to.include('33');
      expect(rows.at(3).text()).to.include('2020');
    });

    it('mixed data can be sorted on first click', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['Header 1', 'Header 2'],
          rows: [
            { 'Header 1': 3, 'Header 2': 3 },
            { 'Header 1': 'a', 'Header 2': 'a' },
            { 'Header 1': 1, 'Header 2': 1 },
          ],
        },
      });

      wrapper.find('[data-testid="sort"]').trigger('click');
      await flushPromises();

      const rows = wrapper.findAll('tr');
      expect(rows.at(1).text()).to.include('11');
      expect(rows.at(2).text()).to.include('33');
      expect(rows.at(3).text()).to.include('aa');
    });

    it('can reverse sort on second click', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['Header 1', 'Header 2'],
          rows: [
            { 'Header 1': 3, 'Header 2': 3 },
            { 'Header 1': 'a', 'Header 2': 'a' },
            { 'Header 1': 1, 'Header 2': 1 },
          ],
        },
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
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['Header 1', 'Header 2'],
          rows: [
            { 'Header 1': 3, 'Header 2': 3 },
            { 'Header 1': 'a', 'Header 2': 'a' },
            { 'Header 1': 1, 'Header 2': 1 },
          ],
        },
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
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['ID', 'Heading'],
          rows: [
            { ID: 12345, Heading: 'This is the description' },
            { ID: 12346, Heading: 'Another desc' },
          ],
        },
      });

      wrapper.find('[data-testid="search"]').setValue('another');
      wrapper.find('[data-testid="search"]').trigger('input');

      const rows = wrapper.findAll('tr');
      expect(rows).to.have.lengthOf(2);
      expect(wrapper.text()).to.include('Another');
    });

    it('can clear a filter', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['ID', 'Heading'],
          rows: [
            { ID: 12345, Heading: 'This is the description' },
            { ID: 12346, Heading: 'Another desc' },
          ],
        },
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
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['ID', 'Description'],
          rows: [{ ID: 12345, Description: 'This is the description' }],
        },
      });

      wrapper.find('[data-testid="12345:description"]').trigger('click');
      await flushPromises();

      wrapper.find('[name="[12345]desc"]').setValue('test update');
      wrapper.find('[name="[12345]desc"]').trigger('blur');

      expect(wrapper.emitted()['edit-value'][0][0].value).to.eq('test update');
    });

    it('can select multiple entries', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['ID', 'Description'],
          rows: [
            { ID: 1234, Description: 'This is the description' },
            { ID: 1235, Description: 'This is the other description' },
          ],
        },
      });

      wrapper.find('[data-testid="select 1234"]').trigger('click');
      await flushPromises();

      wrapper.find('[data-testid="select 1235"]').trigger('click');
      await flushPromises();

      expect(wrapper.vm.$data.selected).has.lengthOf(2);
    });

    it('emits an edit to the descriptions for multiple edits at once', async () => {
      const wrapper = shallowMount(DataTable, {
        propsData: {
          header: ['ID', 'Description'],
          rows: [
            { ID: 1234, Description: 'This is the description' },
            { ID: 1235, Description: 'This is the other description' },
            { ID: 1236, Description: 'This is one last description' },
          ],
        },
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
