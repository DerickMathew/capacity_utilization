import Vue from 'vue'
import Router from 'vue-router'
import CapacityUtilization from '@/components/CapacityUtilization'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Capacity Utilization',
      component: CapacityUtilization
    }
  ]
})
