import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      name: 'home',
      meta: {
        isShowTabBar: true,
        keepAlive: true
      },
      component: () =>
        import('@/views/index.vue')
    },
    {
      path: '/game-detail/:id',
      name: 'game-detail',
      meta: {
        keepAlive: true
      },
      component: () =>
        import('@/views/game-detail.vue')
    },
    {
      path: '/game-gift',
      name: 'game-gift',
      meta: {
        isShowTabBar: true,
        keepAlive: true
      },
      component: () =>
        import('@/views/game-gift.vue')
    },
    {
      path: '/game-news',
      name: 'game-news',
      component: () =>
        import('@/views/game-news.vue')
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () =>
        import('@/views/article.vue'),
    },
    {
      path: '/game-mine',
      name: 'game-mine',
      meta: {
        requireAuth: true,
        isShowTabBar: true
      },
      component: () =>
        import('@/views/game-mine.vue'),
    },
    {
      path: '/bind-phone',
      name: 'bind-phone',
      component: () =>
        import('@/views/bind-phone.vue')
    },
    {
      path: '/bind-user-name',
      name: 'bind-user-name',
      component: () =>
        import('@/views/bind-user-name.vue')
    },
    {
      path: '/real-name',
      name: 'real-name',
      component: () =>
        import('@/views/real-name.vue')
    },
    {
      path: '/change-pwd',
      name: 'change-pwd',
      component: () =>
        import('@/views/change-pwd.vue')
    },
    {
      path: '/service-content',
      name: 'service-content',
      component: () =>
        import('@/views/service-content.vue')
    },
    {
      path: '/fcm',
      name: 'fcm',
      component: () =>
        import('@/views/fcm.vue')
    },
    {
      path: '/my-gift',
      name: 'my-gift',
      component: () =>
        import('@/views/my-gift.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import('@/views/login.vue')
    },
    {
      path: '/user-agreement',
      name: 'user-agreement',
      component: () =>
        import('@/views/user-agreement.vue')
    }, {
      path: '/change-username',
      name: 'change-username',
      component: () =>
        import('@/views/change-username.vue')
    }, {
      path: '/game-malls',
      name: 'game-malls',
      meta: {
        isShowTabBar: true
      },
      component: () =>
        import('@/views/game-malls.vue')
    }, {
      path: '/game-malls-category',
      name: 'game-malls-category',
      component: () =>
        import('@/views/game-malls-category.vue')
    }, {
      path: '/goods-detail/:id',
      name: 'goods-detail',
      component: () =>
        import('@/views/goods-detail.vue')
    }, {
      path: '/game-malls-activity',
      name: 'game-malls-activity',
      meta: {
        isShowTabBar: true
      },
      component: () =>
        import('@/views/game-malls-activity.vue')
    }, {
      path: '/game-setting',
      name: 'game-setting',
      component: () =>
        import('@/views/game-setting.vue')
    }, {
      path: '/game-address',
      name: 'game-address',
      component: () =>
        import('@/views/game-address.vue')
    }, {
      path: '/my-diamond',
      name: 'my-diamond',
      component: () =>
        import('@/views/my-diamond.vue')
    }, {
      path: '/my-orders',
      name: 'my-orders',
      component: () =>
        import('@/views/my-orders.vue')
    }, {
      path: '/orders-detail',
      name: 'orders-detail',
      component: () =>
        import('@/views/orders-detail.vue')
    }, {
      path: '/my-focus',
      name: 'my-focus',
      component: () =>
        import('@/views/my-focus.vue')
    }, {
      path: '/game-open-server',
      name: 'game-open-server',
      component: () =>
        import('@/views/game-open-server.vue')
    }, {
      path: '/search',
      name: 'search',
      meta: {
        keepAlive: true
      },
      component: () =>
        import('@/views/search.vue')
    }, {
      path: '/author',
      name: 'author',
      component: () =>
        import('@/views/author.vue')
    },
    {
      path: '/inviteIndex',
      name: 'inviteIndex',
      meta: {
        keepAlive: true,
        isShowTabBar: true
      },
       component: () =>
         import('@/rebate/invite-index.vue')
    }, {
      path: '/promotion',
      name: 'promotion',
      component: () =>
        import('@/rebate/promotion.vue')
    }, {
      path: '/cooperate',
      name: 'cooperate',
      component: () =>
        import('@/rebate/cooperate.vue')
    }, {
      path: '/income',
      name: 'income',
      component: () =>
        import('@/rebate/income.vue')
    }, {
      path: '/inviteCash',
      name: 'inviteCash',
      component: () =>
        import('@/rebate/invite-cash.vue')
    }, {
      path: '/inviteMakeMoney',
      name: 'inviteMakeMoney',
      component: () =>
        import('@/rebate/invite-make-money.vue')
    }, {
      path: '/inviteXdQrcode',
      name: 'inviteXdQrcode',
      component: () =>
        import('@/rebate/invite-xd-qrcode.vue')
    }, {
      path: '/inviteGxQrcode',
      name: 'inviteGxQrcode',
      component: () =>
        import('@/rebate/invite-gx-qrcode.vue')
    }, {
      path: '/inviteIncomeRecord',
      name: 'inviteIncomeRecord',
      component: () =>
        import('@/rebate/invite-income-record.vue')
    }, {
      path: '/inviteRecord',
      name: 'inviteRecord',
      component: () =>
        import('@/rebate/invite-record.vue')
    },
  ]
})
