import Vue from 'vue'
import App from './App'
import store from '@/store'
// 在main.js注册mescroll-body的全局组件 (mescroll-uni用的比较少,且遵循 easycom 规范,会自动按需引入)
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
import AES from '@/common/AES.js' //aes解密
import md5Libs from "uview-ui/libs/function/md5"
// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js')
let vuexStore = require("@/store/$u.mixin.js")
Vue.mixin(vuexStore)
Vue.mixin(mpShare)

Vue.component('mescroll-body', MescrollBody)

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

Vue.prototype.$store = store
Vue.prototype.AES = AES
Vue.prototype.signKey = '90470cab9b2b45aaae0757197d9933a9'
Vue.prototype.md5Libs = md5Libs

const app = new Vue({
	store,
	...App
})
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

app.$mount()
