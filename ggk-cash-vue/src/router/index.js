import Vue from 'vue'
import Router from 'vue-router'
import drawCash from '@/pages/draw-cash'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'draw-cash',
      component: drawCash,
      meta: {
        keepAlive: false
      }
    }, {
      path: '/wallet',
      name: 'wallet',
      component: () =>
        import('@/pages/wallet.vue')
    }, {
      path: '/cash-record',
      name: 'cash-record',
      component: () =>
        import('@/pages/cash-record.vue')
    }, {
      path: '/bind-phone',
      name: 'bind-phone',
      component: () =>
        import('@/pages/bind-phone.vue')
    }
  ]
})
