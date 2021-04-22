import Vue from 'vue'
import App from './App'
import store from './store'  
import { http } from '@/js_sdk/luch-request/index.js' // 全局挂载引入，配置相关在该index.js文件里修改

Vue.prototype.$http = http
Vue.prototype.$store = store;
Vue.prototype.$version = '1.0.0';
Vue.prototype.$package_name = 'com.nzhy.xfjzuni';

import home from './pages/home/index'
Vue.component('home',home)

import classify from './pages/classify/index'
Vue.component('classify',classify)

import mine from './pages/mine/index'
Vue.component('mine',mine)

import noData from './components/no-data.vue'
Vue.component('no-data',noData)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
