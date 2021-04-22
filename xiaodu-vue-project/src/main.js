// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import store from './store'
import apiConfig from '../config/api.config'
import 'url-search-params-polyfill'
import {
  ToastPlugin,
  LoadingPlugin
} from 'vux'
import Axios from 'axios';

//手机控制台调试工具,在调试的时候开启
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// export default vConsole;

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(VueRouter)

FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

//返回顶部代码
Vue.prototype.upToTop = function () {
  let dom = document.getElementById('main-content');
  dom.scrollTop = 0;
}

/**
 * 显示登录弹窗
 */
Vue.prototype.loginPopupShow = function (routerName = '/') {
  router.push({
    path: '/login',
    query: {
      redirect: routerName
    }
  })
}

//显示礼包弹窗
Vue.prototype.giftShowFun = function (giftCode, giftDec) {
  this.giftCode = giftCode;
  this.giftDec = giftDec;
  store.commit('switch_gift_dialog', true);
}

//友盟事件统计
Vue.prototype.cnzzTrackEvent = function (name) {
  window._czc.push(['_trackEvent', name, "点击"])
}

function toGame(url, routerName) {
  Axios
    .get(url)
    .then(res => {
      if (res.data.status != 1) {
        if (res.data.status === 403) {
          router.push({
            path: '/login',
            query: {
              redirect: routerName
            }
          })
          store.commit('changeLogin', false);
          return;
        }
        this.$vux.toast.text(res.data.msg);
        return;
      } else {
        let play_link = res.data.data.play_link;
        if (store.getters.getLoginStatus === false) {
          router.push({
            path: '/login',
            query: {
              redirect: routerName
            }
          })
          localStorage.setItem("playUrl", play_link);
        } else {
          window.location.href = play_link;
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
}

Vue.prototype.playGame = function (url, routerName, gameId, category=null) {
  if (isWeiXin()) {
    let isOpenid = store.getters.getOpenid;
    if (isOpenid == null) {
      Axios.get("/xd-api/set-open-id", {
          params: {
            ch_id: this.ch_id,
            game_id: gameId
          }
        })
        .then(response => {
          if (response.data.status == 0) {
            toGame(url, routerName);
          } else {
            window.location.href = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else if (isOpenid == true) {
      toGame(url, routerName);
    }
  } else {
    toGame(url, routerName);
  }
  this.cnzzTrackEvent(category);
}

Axios.defaults.baseURL = apiConfig.baseUrl;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
Axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.$ajax = Axios;

//包id
Vue.prototype.ch_id = 1;
//判断.初始化包id

Vue.prototype.setChIDFromUrl = function () {
  let url = location.href;
  let key = 'ch_id';
  let regex = new RegExp("[&?]" + key + "=([^&#]*)", "i");
  let ret = url.match(regex);
  if (ret && ret.length > 1) {
    //设置全局的ch_id;
    this.ch_id = ret[1];
  }
}

Vue.prototype.setCookie = function (name, value) {
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
Vue.prototype.getCookie = function (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

//时间格式化
Vue.prototype.dateDiff = function (timestamp) {
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
  var zero = function (value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function () {
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
  store.dispatch('LoginInfo');
  store.dispatch('isOpenid');
  store.dispatch("myDiamond");
  store.dispatch("getAddressData");
}
getUserInfo();

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
  device();
}

//点击个人中心判断是否登录
router.beforeEach((to, from, next) => {
  // 传渠道id
  if (to.query.xch_id) {
    next();
    return;
  };

  if (from.query.xch_id) {
    let toQuery = JSON.parse(JSON.stringify(to.query));
    toQuery.xch_id = from.query.xch_id;
    next({
      path: to.path,
      query: toQuery
    })
  } else {
    next()
  }

  if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
    if (store.getters.getLoginStatus === false) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }

})

router.afterEach((to, from) => {
  //是否显示tabbar
  if (to.matched.some(res => res.meta.isShowTabBar)) {
    store.commit('changeShowTabBar', true);
  } else {
    store.commit('changeShowTabBar', false);
  }
})

router.onError((error) => {
  console.log(error)
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});


// 判断安卓或IOS给html标签增加class
function device() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid == true) {
    document.documentElement.setAttribute('class', 'app-android');
  }
  if (isiOS == true) {
    document.documentElement.setAttribute('class', 'app-ios');
  }
}
device();

//判断是否是微信内置浏览器
function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

Vue.prototype.isWeiXin = function () {
  return isWeiXin();
}
