import Vue from 'vue'
import ListingSelector from '@/components/ListingSelector'

describe('ListingSelector.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(ListingSelector);

    const vm = new Constructor().$mount();

    expect(vm.$el.querySelector('.hello h1').textContent)
  })
});
