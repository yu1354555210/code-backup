import Vue from 'vue'
import App from './App'
// 在main.js注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import AES from '@/common/AES.js';
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.config.productionTip = false

Vue.prototype.apiUrl = 'https://kcb-api.qianr.com';
Vue.prototype.signKey = '90470cab9b2b45aaae0757197d9933a9';
Vue.prototype.AES = AES;

App.mpType = 'app'

const app = new Vue({
    ...App
})


app.$mount()
