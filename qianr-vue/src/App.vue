<template>
  <div id="app">
    <view-box :body-padding-bottom="$store.state.isShowTabBar==true?'':0">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </view-box>
    <tabbar v-model="index" v-show="$store.state.isShowTabBar">
      <tabbar-item selected :selected="$route.name === 'home'" link="/">
        <img slot="icon" src="./assets/img/icon-tabbar-game.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-game-cur.png">
        <span slot="label">游戏</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'inviteIndex'" @on-item-click="isLogin">
        <img slot="icon" src="./assets/img/icon-tabbar-fl.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-fl-cur.png">
        <span slot="label">赚钱</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'game-mine'" @on-item-click="isLogin">
        <img slot="icon" src="./assets/img/icon-tabbar-mine.png">
        <img slot="icon-active" src="./assets/img/icon-tabbar-mine-cur.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, ViewBox } from "vux";
import { mapMutations } from "vuex";
export default {
  name: "app",
  data() {
    return {
      index: 0,
      showDot: false,
      link: "",
      redirect: ""
    };
  },
  mounted() {
    //友盟统计
    const script = document.createElement("script");
    script.src =
      "https://s96.cnzz.com/z_stat.php?id=1277666363&web_id=1277666363";
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
        window._czc.push(["_setAccount", "1277666363"]);
      }
    }
  },
  computed: {},
  methods: {
    ...mapMutations(["switch_login_dialog","switch_form_dialog","switch_redirect"]),
    cnzzTrackEvent(name) {
      window._czc.push(["_trackEvent", `底部菜单-${name}`, "点击"]);
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
    },
    isLogin() {
      if (this.$store.getters.getLoginStatus) {
        if (this.index == 1) {
          if(this.isWeiXin()){
            this.redirect = "/inviteIndex";
            this.cnzzTrackEvent('赚钱');
          }else{
            this.$vux.toast.text("请在微信浏览器打开");
            this.index = 0;
            this.redirect = "/";
          }
        } else if(this.index == 2){
          this.redirect = "/game-mine";
          this.cnzzTrackEvent('我的');
        }
        this.$router.push(this.redirect);
      } else {
        if (this.index == 0) {
          this.redirect = "/";
          this.cnzzTrackEvent('游戏');
        } else if (this.index == 1) {
          if(this.isWeiXin()){
            this.redirect = "/inviteIndex";
            this.cnzzTrackEvent('赚钱');
          }else{
            this.$vux.toast.text("请在微信浏览器打开");
            this.index = 0;
            this.redirect = "/";
            return;
          }
        } else if (this.index == 2) {
          this.redirect = "/game-mine";
          this.cnzzTrackEvent('我的');
        } else {
          this.$router.push(this.redirect);
        }
        this.index = 0;
        this.switch_login_dialog(true);
        this.switch_form_dialog(true);
        this.switch_redirect(this.redirect);
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
@import "./assets/css/form.less";
@import "./assets/css/reset.styl";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/center.less";
#app {
  height: 100%;
}
.weui-bar__item_on .weui-tabbar__label {
  color: #eb636d !important;
}
.weui-tabbar__label {
  font-size: 0.22rem !important;
  color: #646464 !important;
}
.vux_view_box_body{
  background-color: #000 !important;
}
.weui-tabbar {
  background-color: rgba(247, 247, 247, 0.99) !important;
  position: fixed !important;
}

ul,
li {
  list-style: none;
}
img {
  max-width: 100%;
  width: 100%;
}
* {
  box-sizing: border-box;
}
.radius {
  border-radius: 99px !important;
}
body {
  .vux-loading .weui-toast {
    width: 2rem;
    min-height: 2rem;
    top: 50%;
    left: 50%;
    bottom: auto;
    transform: translate(-50%, -50%);
  }

  .weui-toast {
    top: auto;
    bottom: 20%;
    white-space: nowrap;
    z-index: 33333;
    min-height: 2rem;
  }
  //更改toast默认位置
  .weui-toast.vux-toast-bottom {
    bottom: 10% !important;
  }
}
</style>
