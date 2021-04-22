import Vue from 'vue'
import App from './App'
import store from '@/store'
import vLoginModel from '@/components/vLoginModel.vue'
//引入后注册使用
import Request from '@/js_sdk/luch-request/luch-request/index.js' // 全局挂载引入，配置相关在该index.js文件里修改
import jiuaiDebounce from '@/js_sdk/jiuai-debounce/jiuai-debounce.js'
import adVideoUtils from "./units/adVideoUtils.js";

Vue.prototype.$utils = {
  ...adVideoUtils,
};

const http = new Request();

Vue.prototype.$http = http
Vue.prototype.$jiuaiDebounce = jiuaiDebounce
Vue.component('v-login-model', vLoginModel)

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store

Vue.prototype.checkLogin = (callback) => {
	if (!store.getters.getLoginStatus) {
		store.commit('setLoginDialogStatus');
	} else {
		callback && callback();
	}
}

const app = new Vue({
	...App,
	store
})
app.$mount()
