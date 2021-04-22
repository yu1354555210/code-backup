// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import apiConfig from '../config/api.config'
import store from './store'
import {
  ToastPlugin,
  LoadingPlugin
} from 'vux'
import Axios from 'axios'
//手机控制台调试工具,在调试的时候开启
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// export default vConsole;

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueRouter)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

adaptation(750);

//rem计算
function adaptation(size) {
  if (document.documentElement.clientWidth > size) {
    document.documentElement.style.fontSize = size / 7.5 + 'px';
  } else {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
  }
}

window.onresize = function () {
  adaptation(750);
}


Axios.defaults.baseURL = apiConfig.baseUrl;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
// Axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.$ajax = Axios;

store.dispatch('LoginInfo');


const isPro = Object.is(process.env.NODE_ENV, 'production')
let url = isPro ? "http://h5.binglue.com/index.html#/" : "http://172.16.2.248:8081/#/";
Vue.prototype.toUrl = url + "login?url=" + encodeURIComponent(window.location.href);

//友盟事件统计
Vue.prototype.cnzzTrackEvent = function (name) {
  window._czc.push(['_trackEvent', name, "点击"])
}

router.onError((error) => {
  console.log(error)
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});