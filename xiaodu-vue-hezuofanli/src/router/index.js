import Vue from 'vue'
import Router from 'vue-router'
import inviteIndex from '@/pages/invite-index'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'inviteIndex',
      component: inviteIndex,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/promotion',
      name: 'promotion',
      component: () =>
        import('@/pages/promotion.vue')
    },
    {
      path: '/cooperate',
      name: 'cooperate',
      component: () =>
        import('@/pages/cooperate.vue')
    },
    {
      path: '/income',
      name: 'income',
      component: () =>
        import('@/pages/income.vue')
    }, {
      path: '/inviteCash',
      name: 'inviteCash',
      component: () =>
        import('@/pages/invite-cash.vue')
    }, {
      path: '/index',
      name: 'index',
      component: () =>
        import('@/pages/index.vue')
    }, {
      path: '/inviteMakeMoney',
      name: 'inviteMakeMoney',
      component: () =>
        import('@/pages/invite-make-money.vue')
    }, {
      path: '/inviteXdQrcode',
      name: 'inviteXdQrcode',
      component: () =>
        import('@/pages/invite-xd-qrcode.vue')
    }, {
      path: '/inviteGxQrcode',
      name: 'inviteGxQrcode',
      component: () =>
        import('@/pages/invite-gx-qrcode.vue')
    }, {
      path: '/inviteIncomeRecord',
      name: 'inviteIncomeRecord',
      component: () =>
        import('@/pages/invite-income-record.vue')
    }, {
      path: '/inviteRecord',
      name: 'inviteRecord',
      component: () =>
        import('@/pages/invite-record.vue')
    },
  ]
})
