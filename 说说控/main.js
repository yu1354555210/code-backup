import Vue from 'vue'
import App from './App'
// 在main.js注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import store from '@/store'
import AES from '@/common/AES.js'; //aes解密
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false

// Vue.prototype.apiUrl = 'http://app1.qianr.com'; //测试接口
Vue.prototype.apiUrl = 'https://app1-api.qianr.com'
Vue.prototype.signKey = '90470cab9b2b45aaae0757197d9933a9'

Vue.prototype.AES = AES
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
