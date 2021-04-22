<template>
  <div class="wrapper" id="main-content">
    <mescroll-vue ref="mescroll" :up="mescrollUp" :down="mescrollDown" @init="mescrollInit">
      <!-- 头部 -->
      <div class="home-header" v-if="isHeader" v-cloak>
        <router-link to="game-mine" tag="dl" @click.native="cnzzTrackEvent('首页头像区域')">
          <dt>
            <img :src="getUserInfo.logo" alt="">
          </dt>
          <dd>
            <span class="icon-gold"></span>
            <span class="gold-info" v-text="getDiamond"></span>
          </dd>
        </router-link>
        <!-- 最近在玩 -->
        <div class="recent-game">
          <ul>
            <li
              v-for="(slide,i) in play_log"
              v-if="i<5"
              :key="i"
              @click="playGame(slide.play_link,$route.path,slide.game_id,`首页最近在玩-${slide.title}`)"
            >
              <img :src="slide.icon" alt="">
            </li>
          </ul>
        </div>
      </div>
       <!-- 最近在玩提示框 -->
      <div
        class="recent-game-dialog-container"
        v-if="recentDialog && play_log!=''"
        @click.self="hideRecentDialog"
        @touchstart.self="hideRecentDialog"
      >
        <div class="recent-game-dialog">
          <div class="icon-recent-close" @click="hideRecentDialog"></div>
          <div class="recent-game-info">玩过的游戏都会出现在这里哦~</div>
        </div>
      </div>
      <!-- 3d幻灯图 尺寸600*345-->
      <div id="example" class="example-swiper">
        <swiper :options="swiperOption2" v-if="slides.length>1">
          <swiper-slide v-for="(slide,i) in slides" :key="i">
            <a :href="slide.con_link" @click="cnzzTrackEvent(`首页轮播图-${slide.title}`)">
              <img :src="slide.src" alt="">
            </a>
          </swiper-slide>
        </swiper>
      </div>
      <!-- 最新开服 -->
      <router-link
        tag="div"
        to="/game-open-server"
        class="open-server"
        @click.native="cnzzTrackEvent('首页最新开服')"
      >
        <div class="open-server-label">
          <span class="icon-clock"></span>
          <span>最新开服</span>
        </div>
        <div class="open-server-marquee">
          <marquee :interval="5000" :duration="500">
            <marquee-item v-for="(item,index) in old_kf" :key="index" class="open-server-item">
              <div class="open-server-info">
                <div class="open-server-name" v-text="item.title"></div>
                <div class="open-server-area" v-text="item.zone"></div>
              </div>
              <div class="open-server-time" v-text="dateDiff(item.kf_time)"></div>
            </marquee-item>
          </marquee>
        </div>
        <div class="icon-home-more"></div>
      </router-link>
      <!-- 精品推荐 -->
      <div class="good-recommend">
        <div class="home-title">精品推荐</div>
        <swiper :options="swiperOption" ref="mySwiper" class="good-recommend-swiper">
          <swiper-slide v-for="(item,i) in slideAd" :key="i">
            <a :href="item.con_link" @click="cnzzTrackEvent(`首页精品推荐-${item.title}`)">
              <img :src="item.src" alt="">
            </a>
          </swiper-slide>
        </swiper>
      </div>
      <!-- 选项卡 -->
      <div class="tab-server">
        <router-link
          to="search"
          tag="div"
          class="icon-tab-search"
          @click.native="cnzzTrackEvent('首页进入搜索页')"
        ></router-link>
        <tab custom-bar-width="60px" :animate="false" v-model="index">
          <tab-item
            class="vux-center"
            :active-class="'active-'+index"
            v-for="(item, index) in tabList2"
            :key="index"
            @click.native="moveTab(index)"
          >{{item}}</tab-item>
        </tab>
      </div>
      <div class="swiper-item" v-show="index==0">
        <ul class="game-list">
          <li v-for="item in hot_game">
            <router-link
              :to="{name:'game-detail', params:{'id':item.game_id}}"
              class="item-fl"
              tag="div"
              @click.native="cnzzTrackEvent(`首页热门游戏进入详情-${item.title}`)"
            >
              <div class="game-img">
                <img :src="item.icon" alt="">
              </div>
              <div class="game-media">
                <div class="game-name">
                  <h3 v-text="item.title"></h3>
                  <badge text="礼包" v-if="item.is_gift==1"></badge>
                  <badge text="首发" v-if="item.is_sf==1" class="badge-bule"></badge>
                </div>
                <div class="game-classify" v-text="item.type"></div>
                <div class="game-dec" v-text="item.smr"></div>
              </div>
            </router-link>
            <div class="item-fr">
              <button
                class="item-btn"
                @click="playGame(item.play_link,$route.path,item.game_id,`首页热门游戏开始游戏-${item.title}`)"
              >开始游戏</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="swiper-item" v-show="index==1">
        <ul class="game-list game-list-red">
          <li v-for="item in new_game">
            <router-link
              :to="{name:'game-detail', params:{'id':item.game_id}}"
              class="item-fl"
              tag="div"
              @click.native="cnzzTrackEvent(`首页最新游戏进入详情-${item.title}`)"
            >
              <div class="game-img">
                <img :src="item.icon" alt="">
              </div>
              <div class="game-media">
                <div class="game-name">
                  <h3 v-text="item.title"></h3>
                  <badge text="礼包" v-if="item.is_gift==1"></badge>
                  <badge text="首发" v-if="item.is_sf==1" class="badge-bule"></badge>
                </div>
                <div class="game-classify" v-text="item.type"></div>
                <div class="game-dec" v-text="item.smr"></div>
              </div>
            </router-link>
            <div class="item-fr">
              <button
                class="item-btn"
                @click="playGame(item.play_link,$route.path,item.game_id,`首页最新游戏开始游戏-${item.title}`)"
              >开始游戏</button>
            </div>
          </li>
        </ul>
      </div>
      <!-- 透明广告 -->
      <div
        class="popup-gg-container"
        v-if="isGg"
        v-for="(item,i) in ggImg"
        @click.self="hidePopupGg"
      >
        <div class="popup-gg-wrapper">
          <div class="icon-gg-colse" @click="hidePopupGg"></div>
          <a href="javascript:;" @click="toAdUrl(item.con_link)">
            <img :src="item.src" alt="">
          </a>
        </div>
      </div>
    </mescroll-vue>
    <!-- 非微信端悬浮小球 -->
    <div class="home-ball" @click="switch_focus_dialog(true)">
      <div class="pulse"></div>
      <div class="pulse1"></div>
    </div>
    <v-focus-popup v-if="focusPopup"></v-focus-popup>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import {
  Tab,
  TabItem,
  Badge,
  XButton,
  Sticky,
  Marquee,
  MarqueeItem
} from "vux";
import Clipboard from "clipboard";
import { log } from "util";
import { mapState, mapGetters, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import vFocusPopup from "@/components/v-focus-popup.vue";
const tabList = () => ["热门游戏", "最新游戏"];
export default {
  data() {
    return {
      xch_id: this.$route.query.xch_id || 1,
      isHeader: false,
      slides: "", //幻灯
      hot_game: "", //热门
      new_game: "", //新游
      old_kf: [], //已开新服
      play_log: [], //最近在玩
      tabList2: tabList(),
      index: 0,
      serveTabIndex: 1,
      qrcodeShow: false,
      playUrl: null,
      recentDialog: false,
      slideAd: [],
      isGg: true,
      ggImg: [],
      mescroll: null,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 20 //每页数据条数,默认10
        },
        isBounce: false,
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "noData", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "", //图标,默认null,支持网络图
          tip: "还没有数据哦~" //提示
        },
        htmlNodata: '<p class="upwarp-nodata">已加载全部</p>',
        noMoreSize: 10, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        toTop: {
          //回到顶部按钮,需配置src才显示
          warpId: null, //父布局的id; 默认添加在body中
          src: "http://h5.binglue.com/xd_static/img/icon-top.png", //图片路径,默认null;
          html: null, //html标签内容,默认null; 如果同时设置了src,则优先取src
          offset: 500, //列表滚动多少距离才显示回到顶部按钮,默认1000
          warpClass: "mescroll-totop", //按钮样式,参见mescroll.css
          showClass: "mescroll-fade-in", //显示样式,参见mescroll.css
          hideClass: "mescroll-fade-out", //隐藏样式,参见mescroll.css
          duration: 300, //回到顶部的动画时长,默认300ms
          supportTap: false, //默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
          btnClick: null // 点击按钮的回调; 小提示:如果在回调里return true,将不执行回到顶部的操作.
        }
      },
      swiperOption: {
        observer: true,
        observeParents: true,
        lazy: {
          loadPrevNext: true
        },
        watchSlidesProgress: true,
        spaceBetween: 10,
        slidesPerView: "auto"
      },
      swiperOption2: {
        loop: true, // 循环
        speed: 500, //切换速度
        mousewheelControl: false, // 禁止鼠标滚轮切换
        lazy: {
          loadPrevNext: true
        },
        autoplay: {
          delay: 6000,
          stopOnLastSlide: false, // 切换到最后一个时不停止
          disableOnInteraction: false //用户操作swiper之后 不停止autoplay
        },
        watchSlidesProgress: true,
        centeredSlides: true, //设定为true时，活动块会居中，而不是默认状态下的居左。
        slidesPerView: "auto",
        loopedSlides: 3,
        observer: true,
        observeParents: true
      }
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
    Sticky,
    Marquee,
    MarqueeItem,
    MescrollVue,
    vFocusPopup
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
    ...mapMutations(["switch_focus_dialog"]),
    moveTab(index) {
      this.index = index;
      this.mescroll.resetUpScroll();
    },
    serveTabTo(index) {
      this.serveTabIndex = index;
    },
    hideRecentDialog() {
      // 隐藏最近在玩提示框
      this.recentDialog = false;
      localStorage.setItem("recentDialogStatus", "false");
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    isPopupGg() {
      let isShowGg = this.getCookie("GG");
      if (isShowGg) {
        this.isGg = false;
      } else {
        if (this.ggImg != "") {
          this.isGg = true;
        }
      }
    },
    hidePopupGg() {
      this.isGg = false;
      this.setCookie("GG", "false");
    },
    toAdUrl(url) {
      window.location.href = url;
      this.hidePopupGg();
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
          this.old_kf = data.kf.before;
          this.play_log = data.play_log;
          this.slideAd = data.better_img;
          this.ggImg = data.ad_img;
          if (!localStorage.getItem("qrcode")) {
            window.localStorage.setItem("qrcode", data.wxmp.code_link);
          }
        })
        .catch(function(error) {});
    },

    upCallback(page, mescroll) {
      if (this.index == 0) {
        this.$ajax
          .get("/xd-api/hot-game-list", {
            params: {
              page: page.num, // 页码
              limit: page.size, // 每页长度
              xch_id: this.xch_id
            }
          })
          .then(response => {
            let data = response.data.data;

            // 如果是第一页需手动制空列表
            if (page.num === 1) this.hot_game = [];
            // 把请求到的数据添加到列表

            this.hot_game = this.hot_game.concat(data);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          })
          .catch(function(error) {
            // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
          });
      } else {
        this.$ajax
          .get("/xd-api/new-game-list", {
            params: {
              page: page.num, // 页码
              limit: page.size, // 每页长度
              xch_id: this.xch_id
            }
          })
          .then(response => {
            let data = response.data.data;

            // 如果是第一页需手动制空列表
            if (page.num === 1) this.new_game = [];
            // 把请求到的数据添加到列表

            this.new_game = this.new_game.concat(data);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          })
          .catch(function(error) {
            // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
          });
      }
    },
  },
  mounted() {
    this.$nextTick(function() {
      this.isPopupGg();

      //刚进入页面的时候加载最新游戏
      this.$ajax
        .get("/xd-api/new-game-list", {
          params: {
            page: 1, // 页码
            limit: 20, // 每页长度
            xch_id: this.xch_id
          }
        })
        .then(response => {
          let data = response.data.data;
          this.new_game = data;
          // 数据渲染成功后,隐藏下拉刷新的状态
        })
        .catch(function(error) {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        });

      //没登录不显示头部
      this.getLoginStatus === false
        ? (this.isHeader = false)
        : (this.isHeader = true);

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
    this.getLoginStatus === false
      ? (this.isHeader = false)
      : (this.isHeader = true);
  }
};
</script>
<style lang="less" scoped>
[v-cloak] {
  display: none;
}
.active-0 {
  color: #4fb8fa !important;
  border-color: #4fb8fa !important;
}
.active-1 {
  color: #ff5363 !important;
  border-color: #ff5363 !important;
}
.active-2 {
  color: #867afe !important;
  border-color: #867afe !important;
}

// 徽标
.vux-badge {
  margin-left: 0.1rem;
  background-color: #ff5363;
  border-radius: 0.15rem;
  &.badge-bule {
    background-color: #7395ec;
  }
}
</style>

<style>
.mescroll-totop {
  width: 0.84rem;
  height: 0.96rem;
  bottom: 10%;
  right: 5%;
  opacity: 0;
}
</style>
