import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import DataTable from '@/components/DataTable.vue';

describe('HelloWorld.vue', () => {
  it('shows the headers and data', () => {
    const data = 'Header 1;Header 2\nData 1; Data 2';
    const wrapper = shallowMount(DataTable, {
      propsData: { data },
    });
    expect(wrapper.text()).to.include('Header 1');
    expect(wrapper.text()).to.include('Header 2');
    expect(wrapper.text()).to.include('Data 1');
    expect(wrapper.text()).to.include('Data 2');
  });
});
