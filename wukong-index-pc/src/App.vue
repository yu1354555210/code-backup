<template>
  <div id="app">
    <app-header></app-header>
    <keep-alive><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import appHeader from '@/components/header.vue';
import appFooter from '@/components/footer.vue';
import { Tabbar, TabbarItem, ViewBox } from 'vux';
import { mapMutations } from 'vuex';
const IE11RouterFix = {
  methods: {
    hashChangeHandler: function() {
      this.$router.push(window.location.hash.substring(1, window.location.hash.length));
    },
    isIE11: function() {
      return !!window.MSInputMethodContext && !!document.documentMode;
    }
  },
  mounted: function() {
    if (this.isIE11()) {
      window.addEventListener('hashchange', this.hashChangeHandler);
    }
  },
  destroyed: function() {
    if (this.isIE11()) {
      window.removeEventListener('hashchange', this.hashChangeHandler);
    }
  }
};
export default {
  name: 'app',
  mixins: [IE11RouterFix],
  data() {
    return {
      index: 0,
      showDot: false,
      link: '',
      redirect: ''
    };
  },
  mounted() {
    // //友盟统计
    // const script = document.createElement("script");
    // script.src =
    //   "https://s96.cnzz.com/z_stat.php?id=1277666363&web_id=1277666363";
    // script.language = "JavaScript";
    // document.body.appendChild(script);
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      window.addEventListener(
        'hashchange',
        () => {
          let currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath); // 主动更改路由界面
          }
        },
        false
      );
    }
  },
  watch: {
    $route() {
      //友盟统计
      // if (window._czc) {
      //   let location = window.location;
      //   let contentUrl = location.pathname + location.hash;
      //   let refererUrl = "/";
      //   window._czc.push(["_trackPageview", contentUrl, refererUrl]);
      //   window._czc.push(["_setAccount", "1277666363"]);
      // }
    }
  },
  computed: {},
  methods: {
    ...mapMutations(['switch_login_dialog', 'switch_form_dialog', 'switch_redirect']),
    cnzzTrackEvent(name) {
      // window._czc.push(["_trackEvent", `底部菜单-${name}`, "点击"]);
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
      document.cookie = name + '=' + value + ';expires=' + leftTime.toGMTString();
    },
    getCookie(name) {
      var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    isLogin() {
      if (this.$store.getters.getLoginStatus) {
        if (this.index == 1) {
          if (this.isWeiXin()) {
            this.redirect = '/inviteIndex';
            this.cnzzTrackEvent('赚钱');
          } else {
            this.$vux.toast.text('请在微信浏览器打开');
            this.index = 0;
            this.redirect = '/';
          }
        } else if (this.index == 2) {
          this.redirect = '/game-mine';
          this.cnzzTrackEvent('我的');
        }
        this.$router.push(this.redirect);
      } else {
        if (this.index == 0) {
          this.redirect = '/';
          this.cnzzTrackEvent('游戏');
        } else if (this.index == 1) {
          if (this.isWeiXin()) {
            this.redirect = '/inviteIndex';
            this.cnzzTrackEvent('赚钱');
          } else {
            this.$vux.toast.text('请在微信浏览器打开');
            this.index = 0;
            this.redirect = '/';
            return;
          }
        } else if (this.index == 2) {
          this.redirect = '/game-mine';
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
    ViewBox,
    appHeader,
    appFooter
  }
};
</script>

<style lang="less">
@import './assets/css/reset.less';
@import '../static/css/swiper.min.css';
@import './assets/css/style.less';
body {
  .weui-toast {
    top: 50%;
  }
}
</style>
<style lang="stylus">
  .wrapper
    .el-dialog__body
      text-align center
      p
        text-align center
        line-height 30px
      img
        width 80%
        height 80%
        margin 0 auto
      h4
        text-align center
      .wechat-box
        margin-top 10px
        display flex
        justify-content center
    .dialog-success
      .el-button
        width 30%
        margin-top 10px
</style>
