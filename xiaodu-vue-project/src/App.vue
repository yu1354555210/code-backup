<template>
  <div id="app">
    <view-box :body-padding-bottom="$store.state.isShowTabBar==true?'':0">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </view-box>
    <tabbar v-model="index" v-show="$store.state.isShowTabBar">
      <tabbar-item
        link="/"
        selected
        :selected="$route.name === 'home'"
        @on-item-click="cnzzTrackEvent('游戏')"
      >
        <img slot="icon" src="./assets/img/icon-tabbar-game.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-game-cur.png">
        <span slot="label">游戏</span>
      </tabbar-item>
      <tabbar-item
        link="/game-gift"
        :selected="$route.name === 'game-gift'"
        @on-item-click="cnzzTrackEvent('礼包')"
      >
        <img slot="icon" src="./assets/img/icon-tabbar-gift.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-gift-cur.png">
        <span slot="label">礼包</span>
      </tabbar-item>
      <tabbar-item
        link="/game-malls"
        :selected="$route.name === 'game-malls'"
        @on-item-click="cnzzTrackEvent('商城')"
      >
        <img slot="icon" src="./assets/img/icon-tabbar-malls.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-malls-cur.png">
        <span slot="label">商城</span>
      </tabbar-item>
      <tabbar-item
        link="/game-malls-activity"
        :selected="$route.name === 'game-malls-activity'"
        @on-item-click="cnzzTrackEvent('活动')"
      >
        <img slot="icon" src="./assets/img/icon-tabbar-news.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-news-cur.png">
        <span slot="label">活动</span>
      </tabbar-item>
      <tabbar-item
        link="/game-mine"
        :selected="$route.name === 'game-mine'"
        @on-item-click="cnzzTrackEvent('我的')"
      >
        <img slot="icon" src="./assets/img/icon-tabbar-my.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-my-cur.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, ViewBox } from "vux";
export default {
  name: "app",
  data() {
    return {
      index: 0,
      showDot: false,
    };
  },
  mounted() {
    var getShowDot = this.getCookie("showDot");
    getShowDot === "true" ? (this.showDot = true) : (this.showDot = false);

    //友盟统计
    const script = document.createElement("script");
    script.src =
      "https://s96.cnzz.com/z_stat.php?id=1275438492&web_id=1275438492";
    script.language = "JavaScript";
    document.body.appendChild(script);
  },
  watch: {
    $route() {
      //友盟统计
      if (window._czc) {
        let location = window.location;
        let contentUrl = location.pathname + location.hash;
        let refererUrl = "/";
        window._czc.push(["_trackPageview", contentUrl, refererUrl]);
        window._czc.push(["_setAccount", "1275438492"]);
      }
    }
  },
  computed: {},
  methods: {
    cnzzTrackEvent(name){
      window._czc.push(['_trackEvent', `底部菜单-${name}`, '点击'])
    },
    setCookie(name, value) {
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
    },
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    }
  },
  components: {
    Tabbar,
    TabbarItem,
    ViewBox
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "./assets/css/style.less";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/center.less";
#app {
  height: 100%;
}
</style>
