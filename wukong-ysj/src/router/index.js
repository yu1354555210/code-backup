import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      name: 'home',
      meta: {
        keepAlive: true
      },
      component: () =>
        import('@/views/index.vue')
    },{
      path: '/login',
      name: 'login',
      component: () =>
        import('@/views/login.vue')
    },{
      path: '/pay',
      name: 'pay',
      meta: {
        requireAuth: true,
      },
      component: () =>
        import('@/views/pay.vue')
    },{
      path: '/pay-gift',
      name: 'pay-gift',
      meta: {
        requireAuth: true,
      },
      component: () =>
        import('@/views/pay-gift.vue')
    },{
      path: '/rebate',
      name: 'rebate',
      meta: {
        requireAuth: true,
      },
      component: () =>
        import('@/views/rebate.vue')
    },{
      path: '/find-pwd',
      name: 'find-pwd',
      component: () =>
        import('@/views/find-pwd.vue')
    },{
      path: '/pay-agreement',
      name: 'pay-agreement',
      component: () =>
        import('@/views/pay-agreement.vue')
    },{
      path: '/agreement',
      name: 'agreement',
      component: () =>
        import('@/views/agreement.vue')
    },{
      path: '/auto-agreement',
      name: 'auto-agreement',
      component: () =>
        import('@/views/auto-agreement.vue')
    }

  ]
})

