<template>
  <div class="wrapper" id="main-content">
    <!-- 可关闭提示条 -->
    <mescroll-vue ref="mescroll" :up="mescrollUp" :down="mescrollDown" @init="mescrollInit">
      <div class="top-bar" v-if="downAppShow">
        <div class="top-bar-icon">
          <img src="../assets/img/logo.png" alt="">
        </div>
        <div class="top-bar-info">关注公众号
          <span>手游宝盒H5</span>，天天都赚钱
        </div>
        <button class="top-bar-btn" @click="switch_focus_dialog(true)">关注</button>
        <div class="icon-close" @click="downAppShowCookie"></div>
      </div>
      <div class="container">
        <div id="example" class="example-swiper">
          <swiper :options="swiperOption" v-if="slides.length>0">
            <swiper-slide v-for="(slide,i) in slides" :key="i">
              <a :href="slide.con_link" @click="cnzzTrackEvent(`首页轮播图-${slide.title}`)">
                <img :src="slide.src" alt="">
              </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination" v-if="slides.length>1"></div>
          </swiper>
        </div>
        <div class="section vux-1px-b" v-if="play_log.length>1">
          <div class="home-title">最近在玩</div>
          <swiper :options="swiperOption2" ref="mySwiper" class="home-list">
            <!-- <swiper-slide v-for="(slide,i) in 5" :key="i" class="game-item">
              <a href="javascript:;" @click="playGame(slide.play_link,$route.path,slide.game_id)">
                <img src="../assets/img/slide-img.png" alt="">
                <p v-text="">暗杀大将军</p>
              </a>
            </swiper-slide>-->
            <swiper-slide v-for="(slide,i) in play_log" :key="i" class="game-item">
              <a :href="slide.play_link">
                <img :src="slide.icon" alt="">
                <p v-text="slide.title" class="game-item-name"></p>
              </a>
            </swiper-slide>
          </swiper>
        </div>
        <div
          class="section"
          :class="gameList.length-1 == index?'':'vux-1px-b'"
          v-for="(item,index) in gameList"
          :key="index"
        >
          <div class="home-title" v-text="item.title"></div>
          <div class="home-list">
            <div class="game-item" v-for="(it,idx) in item.games" :key="idx">
              <a :href="it.game_link">
                <img :src="it.game_icon" alt="">
                <p class="game-item-name" v-text="it.title"></p>
                <p class="game-item-other">
                  <span v-text="it.player_num"></span>万人在玩
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
    <v-focus-popup v-if="focusPopup"></v-focus-popup>
    <!-- 登录弹窗 -->
    <v-login v-if="loginPopup"></v-login>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import vLogin from "../components/v-login";
import { Tab, TabItem, Badge, XButton } from "vux";
import Clipboard from "clipboard";
import { mapState, mapGetters, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import vFocusPopup from "@/components/v-focus-popup.vue";
export default {
  data() {
    return {
      xch_id: this.$route.query.xch_id || 1,
      isHeader: false,
      slides: [], //幻灯
      play_log: [], //最近在玩
      gameList: [],
      index: 0,
      downAppShow: false,
      serveTabIndex: 1,
      qrcodeShow: false,
      playUrl: null,
      recentDialog: false,
      mescroll: null,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        // 上拉加载的配置.
        use: false
        // isBounce: false
      },
      swiperOption2: {
        observer: true,
        observeParents: true,
        lazy: {
          loadPrevNext: true
        },
        watchSlidesProgress: true,
        // spaceBetween: 15,
        slidesPerView: "auto"
      },
      swiperOption: {
        // loop: true, // 循环
        speed: 500, //切换速度
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        },
        autoplay: {
          delay: 6000,
          stopOnLastSlide: false, // 切换到最后一个时不停止
          disableOnInteraction: false //用户操作swiper之后 不停止autoplay
        },
        watchSlidesProgress: true,
        observer: true,
        observeParents: true
      },
    };
  },
  computed: {
    ...mapState(["loginPopup", "focusPopup"]),
    ...mapGetters(["getLoginStatus", "getUserInfo", "getDiamond", "getOpenid"])
  },
  components: {
    Tab,
    TabItem,
    Badge,
    XButton,
    swiper,
    swiperSlide,
    MescrollVue,
    vFocusPopup,
    vLogin
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    ...mapMutations(["switch_focus_dialog", "switch_login_dialog"]),
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    getHomeData() {
      this.$ajax
        .get("/xd-api/game-page", {
          params: {
            xch_id: this.xch_id
          }
        })
        .then(response => {
          let data = response.data.data;
          this.slides = data.run_img;
          this.play_log = data.play_log;
          if (!localStorage.getItem("qrcode")) {
            window.localStorage.setItem("qrcode", data.wxmp.code_link);
          }
        })
        .catch(function(error) {});

      this.$ajax
        .get("qr/game-type/index", {
          params: {
            xch_id: this.xch_id
          }
        })
        .then(response => {
          let data = response.data.data;
          this.gameList = data;
        })
        .catch(error => {});
    },
    isApp() {
      // 如果关闭了一次app弹窗, 当天不再显示
      let isShowApp = this.getCookie("app");
      if (isShowApp == "false") {
        this.downAppShow = false;
      } else {
        this.downAppShow = true;
      }
    },
    downAppShowCookie() {
      this.downAppShow = false;
      this.setCookie("app", false);
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.isApp();
      let recentDialogStatus = localStorage.getItem("recentDialogStatus");
      recentDialogStatus == "false"
        ? (this.recentDialog = false)
        : (this.recentDialog = true);
    });
    var clipboard = new Clipboard(".copy-btn");
    clipboard.on("success", e => {
      this.$vux.toast.text("复制成功");
    });
  },
  activated() {
    this.getHomeData();
  }
};
</script>
<style lang="stylus" scoped>
.wrapper {
  height: 100%;
}

.container {
  padding: 0 0.25rem;
  overflow: hidden;
}

.home-title {
  font-size: 0.3rem;
  color: #000000;
  padding: 0.35rem 0;
  display: flex;
  align-items: center;

  &:before {
    display: inline-block;
    content: '';
    width: 0.12rem;
    height: 0.36rem;
    border-radius: 0.18rem;
    background-color: #eb636d;
    margin-right: 0.09rem;
  }
}

.home-list {
  overflow: hidden;
  width: 105%;
}

.game-item {
  width: 1.5rem;
  text-align: center;
  font-size: 0.24rem;
  color: #000;
  margin-right: 0.32rem;
  margin-bottom: 0.3rem;
  float: left;

  a {
    color: #000;
  }

  img {
    height: 1.5rem;
    border-radius: 0.24rem;
    margin-bottom: 0.05rem;
    box-shadow: 0 0 0.1rem rgba(167, 167, 167, 0.3);
  }

  p {
    line-height: 0.32rem;

    &.game-item-name {
      font-size: 0.24rem;
      white-space: nowrap;
      overflow: hidden;
    }

    &.game-item-other {
      font-size: 0.22rem;

      span {
        color: #ff4747;
      }
    }
  }
}

.top-bar {
  height: 0.8rem;
  padding: 0 0.25rem;
  background-color: #eb636d;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .top-bar-icon {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.1rem;

    img {
      height: 100%;
      vertical-align: top;
    }
  }

  .top-bar-info {
    font-size: 0.24rem;
    color: #fff;

    span {
      color: #fffd7a;
    }
  }

  .top-bar-btn {
    width: 0.98rem;
    height: 0.38rem;
    font-size: 0.24rem;
    color: #000000;
    background-color: #fff100;
    border-radius: 0.19rem;
    margin-left: 0.25rem;
    border: none;
    outline: none;
  }

  .icon-close {
    width: 0.36rem;
    height: 0.36rem;
    background-image: url('../assets/img/qrcode-popup-close.png');
    background-size: 100% 100%;
  }
}

.example-swiper {
  margin: 0.2rem 0;
  height: 3rem;
  position: relative;

  .swiper-slide {
    border-radius: 0.2rem;
    overflow: hidden;
    height: 3rem;

    img {
      height: 100%;
      box-shadow: 0px 0px 0.1rem rgba(167, 167, 167, 0.3);
    }
  }

  .swiper-pagination {
    bottom: 0.15rem;
    line-height: normal;
    font-size: 0.2rem;

    >>>.swiper-pagination-bullet {
      background-color: #fff;
      opacity: 1;
      width: 0.16rem;
      height: 0.16rem;
    }

    >>>.swiper-pagination-bullet-active {
      background-color: #eb636d;
    }
  }
}
</style>

