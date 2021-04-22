// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import store from './store'
import apiConfig from '../config/api.config'
import 'url-search-params-polyfill'
import Swiper from '../static/js/swiper.min.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../config/plugins';
import VueClipboard from 'vue-clipboard2'
import vTopSwiper from '@/components/v-top-swiper.vue';
import gameHeader from '@/components/props-city-header.vue';
import {
  ToastPlugin,
  LoadingPlugin,
  WechatPlugin,
  AjaxPlugin,
  AlertPlugin ,
  XHeader
} from 'vux'
import Axios from 'axios'
import wx from 'weixin-js-sdk'

//手机控制台调试工具,在调试的时候开启
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// export default vConsole;

Vue.use(VueClipboard)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(VueRouter)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(AlertPlugin)
Vue.use(ElementUI)
Vue.component('x-header', XHeader)
Vue.component('v-top-swiper', vTopSwiper)
Vue.component('game-header', gameHeader)

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.prototype.Swiper = Swiper;

new Vue({
  router,
  mounted() {
    // if (isWeiXin()) {
    //   let link = window.location.href.split('#')[0];
    //   const isPro = Object.is(process.env.NODE_ENV, 'production');
    //   let baseUrl = isPro ? 'qr/share/index' : 'api/qr/share/index'
    //   Axios
    //     .get(baseUrl, {
    //       params: {
    //         url: link
    //       }
    //     })
    //     .then(data => {
    //       let wxdata = data.data.data.sign;
    //       let title = '手游宝盒H5';
    //       let imgUrl = 'https://h5.qianr.com/xd_static/img/icon.png';
    //       let desc = '玩游戏能赚钱，我已经赚了128元，快来和我一起赚吧';
    //       wxdata.jsApiList = [
    //         // 所有要调用的 API 都要加到这个列表中
    //         'onMenuShareTimeline', //分享到朋友圈
    //         'onMenuShareAppMessage', //分享给朋友
    //       ];
    //       wx.config({
    //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //         appId: wxdata.appId, // 必填，公众号的唯一标识
    //         timestamp: wxdata.timestamp, // 必填，生成签名的时间戳
    //         nonceStr: wxdata.nonceStr, // 必填，生成签名的随机串
    //         signature: wxdata.signature, // 必填，签名，见附录1
    //         jsApiList: wxdata.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //       });
    //       wx.ready(() => {
    //         //分享到朋友圈
    //         wx.onMenuShareTimeline({
    //           title: title, // 分享标题
    //           link: link, // 分享链接
    //           desc: desc, // 分享描述
    //           imgUrl: imgUrl, // 分享图标
    //           success: function() {
    //             // 用户确认分享后执行的回调函数
    //           },
    //           cancel: function() {
    //             // 用户取消分享后执行的回调函数
    //           }
    //         });
    //         //分享到朋友
    //         wx.onMenuShareAppMessage({
    //           title: title, // 分享标题
    //           desc: desc, // 分享描述
    //           link: link, // 分享链接
    //           imgUrl: imgUrl, // 分享图标
    //           type: '', // 分享类型,music、video或link，不填默认为link
    //           dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    //           success: function() {
    //             // 用户确认分享后执行的回调函数
    //           },
    //           cancel: function() {
    //             // 用户取消分享后执行的回调函数
    //           }
    //         });
    //       })
    //       wx.error(function(res) {
    //         console.log(res)
    //         // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    //       });
    //     })
    //     .catch(function(error) {});
    // }
  },
  store,
  render: h => h(App)
}).$mount('#app-box')

//友盟事件统计
Vue.prototype.cnzzTrackEvent = function(name) {
  // window._czc.push(['_trackEvent', name, "点击"])
}

Axios.defaults.baseURL = apiConfig.baseUrl;
Axios.defaults.headers.post['Content-Type'] = 'application/json';
// Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
// Axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.$ajax = Axios;
Vue.prototype.baseURL = apiConfig.baseUrl;

//包id
Vue.prototype.ch_id = 1;
//判断.初始化包id

Vue.prototype.setCookie = function(name, value) {
  // 设置cookie到当天24点失效
  var curDate = new Date();
  //当前时间戳
  var curTamp = curDate.getTime();
  //当前日期
  var curDay = curDate.toLocaleDateString();
  var brow = $.browser;
  var curWeeHours = 0;
  //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
  curWeeHours = new Date(curDay).getTime() + 8 * 60 * 60 * 1000 - 1;
  //当日已经过去的时间（毫秒）
  var passedTamp = curTamp - curWeeHours;
  //当日剩余时间
  var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
  var leftTime = new Date();
  leftTime.setTime(leftTamp + curTamp);
  //创建cookie
  document.cookie =
    name + "=" + value + ";expires=" + leftTime.toGMTString();
}

//读取cookie
Vue.prototype.getCookie = function(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

//时间格式化
Vue.prototype.dateDiff = function(timestamp) {
  var arrTimestamp = (timestamp + "").split("");
  for (var start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = "0";
    }
  }
  timestamp = arrTimestamp.join("") * 1;

  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  // if (diffValue < 0) {
  //   return "不久前";
  // }

  // 计算差异时间的量级
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  // 数值补0方法
  var zero = function(value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function() {
      var date = new Date(timestamp);
      return (
        date.getFullYear() +
        "年" +
        zero(date.getMonth() + 1) +
        "月" +
        zero(date.getDate()) +
        "日"
      );
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  } else if (monthC <= -1) {
    return parseInt(Math.abs(monthC)) + "月后";
  } else if (weekC <= -1) {
    return parseInt(Math.abs(weekC)) + "周后";
  } else if (dayC <= -1) {
    return parseInt(Math.abs(dayC)) + "天后";
  } else if (hourC <= -1) {
    return parseInt(Math.abs(hourC)) + "小时后";
  } else if (minC <= -1) {
    return parseInt(Math.abs(minC)) + "分钟后";
  }
  return "刚刚";
}

//获取用户信息
function getUserInfo() {
  // store.dispatch('getUnitParams');
  store.dispatch('checkToken');
  // store.dispatch('isOpenid');
}
getUserInfo();

Vue.prototype.outLogin = function() {
  store.dispatch('outLogin');
}

//解决微信浏览器点击输入框后不能回弹的bug
function WxBrowerInput() {
  if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
    window.setTimeout(function() {
      document.activeElement.scrollIntoViewIfNeeded();
    }, 0);
  }
}

window.onresize = function() {
  WxBrowerInput();
  // device();
}

const defaultTitle = '悟空游戏工作室'

//点击个人中心判断是否登录
router.beforeEach((to, from, next) => {
  // // 传渠道id
  // if (to.query.xch_id) {
  //   next();
  //   return;
  // };

  // if (from.query.xch_id) {
  //   let toQuery = JSON.parse(JSON.stringify(to.query));
  //   toQuery.xch_id = from.query.xch_id;
  //   next({
  //     path: to.path,
  //     query: toQuery
  //   })
  // } else {
  //   next()
  // }
  document.title = to.meta.title ? to.meta.title : defaultTitle
  if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
    if (store.getters.getLoginStatus === false) {
      next({
        path: '/service',
        query: {
          redirect: to.fullPath
        }
      })
      Vue.$vux.toast.text('请先登录');
      // setTimeout(() => {
      //   store.commit("switch_redirect", to.fullPath);
      //   store.commit('switch_form_dialog', true)
      //   store.commit('switch_login_dialog', true)
      // }, 300);
    } else {
      next()
    }
  } else {
    next()
  }

})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  console.log(error);
  if (isChunkLoadFailed) {
      window.location.reload();
  } else {
      console.log(error)
  }
});



//判断是否是微信内置浏览器
function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return 1;
  } else {
    return 0;
  }
}

Vue.prototype.isWeiXin = function() {
  return isWeiXin();
}

// 解决调起手机软键盘页面被顶到底部再关闭软键盘页面底部留白的问题
Vue.prototype.inputLoseFocus = function() {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
}

Vue.prototype.isPc = function() {
  if (/(iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone)/i.test(navigator.userAgent)) {
    //移动端
    return false;
  } else {
    //电脑PC端
    return true;
  }
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

Vue.prototype.game_id = getQueryString('game_id') || 4;
