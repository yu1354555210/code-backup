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
    }, {
      path: '/rebate',
      name: 'rebate',
      meta: {
        requireAuth: true,
      },
      component: () =>
        import('@/views/rebate.vue')
    }, {
      path: '/find-pwd',
      name: 'find-pwd',
      component: () =>
        import('@/views/find-pwd.vue')
    }, {
      path: '/pay',
      name: 'pay',
      meta: {
        title: '充值',
        requireAuth: true,
      },
      component: () =>
        import('@/views/pay.vue')
    },{
      path: '/pay-gift',
      name: 'pay-gift',
      meta: {
        title: '超值礼包',
        requireAuth: true,
      },
      component: () =>
        import('@/views/pay-gift.vue')
    }, {
      path: '/pay-agreement',
      name: 'pay-agreement',
      component: () =>
        import('@/views/pay-agreement.vue')
    }, {
      path: '/auto-agreement',
      name: 'auto-agreement',
      component: () =>
        import('@/views/auto-agreement.vue')
    }, {
      path: '/service',
      name: 'service',
      meta: {
        title: '服务中心'
      },
      component: () =>
        import('@/views/service.vue')
    }, {
      path: '/props-city',
      name: 'props-city',
      meta: {
        title: '悟空道聚城',
        keepAlive: true
      },
      component: () =>
        import('@/views/props-city.vue')
    }, {
      path: '/game-around-detail',
      name: 'game-around-detail',
      meta: {
        requireAuth: true,
        title: '游戏周边'
      },
      component: () =>
        import('@/views/game-around-detail.vue')
    }, {
      path: '/game-around-pay',
      name: 'game-around-pay',
      meta: {
        title: '游戏周边',
        requireAuth: true,
      },
      component: () =>
        import('@/views/game-around-pay.vue')
    }, {
      path: '/agreement',
      name: 'agreement',
      component: () =>
        import('@/views/agreement.vue')
    }, {
      path: '/change-pwd',
      name: 'change-pwd',
      meta: {
        requireAuth: true,
        title: '修改密码'
      },
      component: () =>
        import('@/views/change-pwd.vue')
    }, {
      path: '/change-mobile',
      name: 'change-mobile',
      meta: {
        requireAuth: true,
        title: '更改绑定手机'
      },
      component: () =>
        import('@/views/change-mobile.vue')
    }, {
      path: '/change-real-name',
      name: 'change-real-name',
      meta: {
        requireAuth: true,
        title: '更改实名信息'
      },
      component: () =>
        import('@/views/change-real-name.vue')
    },{
      path: '/login-history',
      name: 'login-history',
      meta: {
        requireAuth: true,
        title: '查看帐号登录历史'
      },
      component: () =>
        import('@/views/login-history.vue')
    },{
      path: '/activity',
      name: 'activity',
      meta: {
        title: '福利'
      },
      component: () =>
        import('@/views/activity.vue')
    },{
      path: '/order-list',
      name: 'order-list',
      meta: {
        requireAuth: true,
        title: '我的订单'
      },
      component: () =>
        import('@/views/order-list.vue')
    },
    {
      path: '*',
      redirect: '/'
    }

  ]
})
