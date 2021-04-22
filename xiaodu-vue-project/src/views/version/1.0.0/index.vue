<template>
<div class="wrapper" id="main-content">
	<scroller :on-infinite="infinite" :ref="scrollBox">
	<!-- 头部 -->
	<div class="home-header" v-cloak>
		<a href="#" class="logo">
		<img :src="logo">
		</a>
		<div class="home-header-qrcode" @click="qrcodeShow=true">
			<img src="../assets/img/header-qrcode.png">
		</div>
	</div>
	<!-- 3d幻灯图 尺寸600*345-->
	<div id="example" class="example-swiper">
		<swiper :options="swiperOption2" v-if="slides.length>1">
		<swiper-slide v-for="(slide,i) in slides" :key="i">
		<a @click="playGame(slide.con_link,$route.path,slide.game_id)">
		<img :src="slide.src" alt="">
		</a>
		</swiper-slide>
		</swiper>
	</div>
	<!-- 最近在玩滑块 -->
	<div class="slide-box">
		<div class="slide-title">
			最近在玩
		</div>
		<div class="slide-media">
			<swiper :options="swiperOption" ref="mySwiper">
			<swiper-slide v-for="(slide,i) in play_log" :key="i">
			<a href="javascript:;" @click="playGame(slide.play_link,$route.path,slide.game_id)">
			<img :src="slide.icon" alt="">
			<p v-text="slide.title">
			</p>
			</a>
			</swiper-slide>
			</swiper>
		</div>
	</div>
	<!-- 选项卡 -->
	<sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false" :disabled="disabled">
	<tab custom-bar-width="60px" :animate="false" v-model="index">
	<tab-item class="vux-center" :class="tabShowDot&&index==1?'show-dot':''" :active-class="'active-'+index" v-for="(item, index) in tabList2" :key="index" @click.native="moveTab(index)">{{item}}</tab-item>
	</tab>
	</sticky>
	<div class="swiper-item tab-bd-item" v-show="index == 0">
		<ul class="game-list">
			<li v-for="item in hot_game">
			<router-link :to="{name:'game-detail', params:{'id':item.game_id}}">
			<div class="item-fl">
				<div class="game-img">
					<img :src="item.icon" alt="">
				</div>
				<div class="game-media">
					<div class="game-name">
						<h3 v-text="item.title"></h3>
						<badge text="礼包" v-if="item.is_gift==1"></badge>
						<badge text="首发" v-if="item.is_sf==1" class="badge-bule"></badge>
					</div>
					<div class="game-classify" v-text="item.type">
					</div>
					<div class="game-dec" v-text="item.smr">
					</div>
				</div>
			</div>
			</router-link>
			<div class="item-fr">
				<button class="item-btn" @click="playGame(item.play_link,$route.path,item.game_id)">开始玩</button>
			</div>
			</li>
		</ul>
	</div>
	<div class="swiper-item" v-show="index == 1">
		<ul class="game-list game-list-red">
			<li v-for="item in new_game">
			<router-link :to="{name:'game-detail', params:{'id':item.game_id}}">
			<div class="item-fl">
				<div class="game-img">
					<img :src="item.icon" alt="">
				</div>
				<div class="game-media">
					<div class="game-name">
						<h3 v-text="item.title"></h3>
						<badge text="礼包" v-if="item.is_gift==1"></badge>
						<badge text="首发" v-if="item.is_sf==1" class="badge-bule"></badge>
					</div>
					<div class="game-classify" v-text="item.type">
					</div>
					<div class="game-dec" v-text="item.smr">
					</div>
				</div>
			</div>
			</router-link>
			<div class="item-fr">
				<button class="item-btn" @click="playGame(item.play_link,$route.path,item.game_id)">开始玩</button>
			</div>
			</li>
		</ul>
	</div>
	<div class="swiper-item" v-show="index == 2">
		<ul class="tab-hd">
			<li :class="serveTabIndex==1?'active':''" @click="serveTabTo(1)">已开新服</li>
			<li :class="serveTabIndex==2?'active':''" @click="serveTabTo(2)">即将开服</li>
		</ul>
		<ul class="game-list game-list-purple" v-show="serveTabIndex == 1">
			<li v-for="item in old_kf">
			<router-link :to="{name:'game-detail', params:{'id':item.game_id}}">
			<div class="item-fl">
				<div class="game-img">
					<img :src="item.icon" alt="">
				</div>
				<div class="game-media">
					<div class="game-name">
						<h3 v-text="item.title"></h3>
						<badge text="礼包" v-if="item.is_gift==1"></badge>
					</div>
					<div class="game-serve" v-text="item.zone">
					</div>
					<div class="game-time">
						<i class="icon-time"></i>
						<span v-text="item.kf_time"></span>
					</div>
				</div>
			</div>
			</router-link>
			<div class="item-fr">
				<button class="item-btn" @click="playGame(item.play_link,$route.path,item.game_id)">开始玩</button>
			</div>
			</li>
		</ul>
		<ul class="game-list game-list-purple" v-show="serveTabIndex == 2">
			<li v-for="item in new_kf">
			<router-link :to="{name:'game-detail', params:{'id':item.game_id}}">
			<div class="item-fl">
				<div class="game-img">
					<img :src="item.icon" alt="">
				</div>
				<div class="game-media">
					<div class="game-name">
						<h3 v-text="item.title"></h3>
						<badge text="礼包" v-if="item.is_gift==1"></badge>
					</div>
					<div class="game-serve" v-text="item.zone">
					</div>
					<div class="game-time">
						<i class="icon-time"></i>
						<span v-text="item.kf_time"></span>
					</div>
				</div>
			</div>
			</router-link>
			<div class="item-fr">
				<button class="item-btn" @click="playGame(item.play_link,$route.path,item.game_id)">开始玩</button>
			</div>
			</li>
		</ul>
	</div>
	</scroller>
	<!-- 提示下载app -->
	<div class="down-app-top" v-if="downAppShow">
		<div class="down-app-fl">
			<dl>
				<dt><img :src="app.logo" alt=""></dt>
				<dd>
				<p>
					{{app.title}}
				</p>
				<p>
					{{app.summary}}
				</p>
				</dd>
			</dl>
		</div>
		<div class="down-app-fr">
			<x-button type="warn" mini @click.native="appDown">免费下载</x-button>
			<div class="down-app-close" @click="downAppShowCookie">
				<img src="../assets/img/dpwn-app-close.png" alt="">
			</div>
		</div>
	</div>
	<!-- 关注哪吒游戏弹窗 -->
	<div class="this-winpop-container" v-if="qrcodeShow" @click.self="qrcodeShow=false">
		<div class="this-qrcode-winpop">
			<div class="this-qrcode-img">
				<img :src="wxmp.code_link" alt="">
			</div>
			<div class="this-qrcode-text">
				搜索关注公众号“{{wxmp.title}}”
			</div>
			<div class="this-qrcode-btn copy-btn" :data-clipboard-text="wxmp.title">
				<img src="../assets/img/qrcode-popup-btn.png" alt="">
			</div>
			<div class="this-qrcode-close" @click="qrcodeShow=false">
			</div>
		</div>
	</div>
	<div class="back-go-top" @click="upToTop()">
	</div>
	<!-- 微信提示打开浏览器下载 -->
	<div class="app-wx-share" v-if="isWxMask" @click="isWxMask = false">
	</div>
	<!-- 选项卡 -->
	<div class="tab-sticky">
		<sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false" :disabled="disabled">
		<tab custom-bar-width="60px" :animate="false" v-model="index">
		<tab-item class="vux-center" :class="tabShowDot&&index==1?'show-dot':''" :active-class="'active-'+index" v-for="(item, index) in tabList2" :key="index" @click.native="moveTab(index)">{{item}}</tab-item>
		</tab>
		</sticky>
	</div>
</div>
</template>
<script>
import { Carousel3d, Slide } from "vue-carousel-3d";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { Tabbar, TabbarItem, Tab, TabItem, Badge, XButton, Sticky } from "vux";
import backGoTop from "@/components/v-go-top.vue";
import Clipboard from "clipboard";
import { log } from "util";
import { mapState, mapGetters } from "vuex";
const tabList = () => ["热门", "新游", "开服"];
export default {
  data() {
    return {
      timer: 0,
      slides: "", //幻灯
      hot_game: "", //热门
      new_game: "", //新游
      new_kf: [], //即将开服
      old_kf: [], //已开新服
      play_log: [], //最近在玩
      wxmp: "", //公众号信息
      app: [],
      isWxMask: false,
      tabList2: tabList(),
      index: 0,
      serveTabIndex: 1,
      tabShowDot: true,
      qrcodeShow: false,
      downAppShow: false,
      logo: "",
      swiperOption: {
        observer: true,
        observeParents: true,
        lazy: {
          loadPrevNext: true
        },
        watchSlidesProgress: true,
        spaceBetween: 15,
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
          delay: 2000,
          stopOnLastSlide: false, // 切换到最后一个时不停止
          disableOnInteraction: false //用户操作swiper之后 不停止autoplay
        },
        watchSlidesProgress: true,
        centeredSlides: true, //设定为true时，活动块会居中，而不是默认状态下的居左。
        slidesPerView: "auto",
        loopedSlides: 3,
        observer: true,
        observeParents: true
      },
      hotPage: 1,
      newPage: 1,
      openPage: 1,
      beforePage: 1,
      afterPage: 1,
      scrollBox: "hotGame",
      done: "",
      disabled:
        typeof navigator !== "undefined" &&
        /iphone/i.test(navigator.userAgent) &&
        /ucbrowser/i.test(navigator.userAgent)
    };
  },
  computed: {
    ...mapState(["loginPopup"]),
    ...mapGetters(["getLoginStatus"])
  },
  components: {
    Tabbar,
    TabbarItem,
    Tab,
    TabItem,
    Carousel3d,
    Slide,
    Badge,
    backGoTop,
    XButton,
    swiper,
    swiperSlide,
    Sticky
  },
  created() {
    // this.findChID(location.href);
    this.setChIDFromUrl();
  },
  methods: {
    moveTab(index) {
      this.index = index;
      //如果有提示红点,点击过后红点消失
      if (this.index == 1) {
        this.tabShowDot = false;
        this.setCookie("tabShowDot", false);
      }
      if (index == 0) {
        this.scrollBox = "hotGame";
      }
      if (index == 1) {
        this.scrollBox = "newGame";
      }
      if (index == 2) {
        this.scrollBox = "openGame";
      }
      // 解决done报错
      this.infinite(this.done);
    },

    serveTabTo(index) {
      this.serveTabIndex = index;
    },
    upToTop() {
      //返回顶部
      let ref = this.scrollBox;
      this.$refs[ref].scrollTo(0, 0, true);
    },
    appDown() {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        if (this.isWeiXin()) {
          this.isWxMask = true;
        } else {
          window.location.href = this.app.download_link;
        }
      } else if (isIOS) {
        window.location.href = this.app.download_link_ios;
      }
    },
    isApp() {
      // 如果关闭了一次app弹窗, 当天不再显示
      let isShowApp = this.getCookie("app");
      if (isShowApp == "false") {
        this.downAppShow = false;
      } else {
        this.$ajax.get("/xd-api/pub-app").then(response => {
          if (response.data.status == 0) {
            this.downAppShow = false;
          } else {
            this.app = response.data.data;
            // this.downAppShow = true;
            this.downAppShow = false;
          }
        });
      }
    },
    downAppShowCookie() {
      this.downAppShow = false;
      this.setCookie("app", false);
    },
    infinite(done) {
      this.done = done;
      if (this.scrollBox == "hotGame") {
        // 请求热门
        setTimeout(() => {
          this.hotPage++;
          this.$ajax
            .get("/xd-api/hot-game-list", {
              params: {
                page: this.hotPage // 页码
              }
            })
            .then(response => {
              let arr = response.data.data;
              if (arr.length != 0) {
                this.hot_game = this.hot_game.concat(arr);
                done();
              } else {
                done(true);
              }
            });
        }, 500);
      }
      if (this.scrollBox == "newGame") {
        setTimeout(() => {
          this.newPage++;
          // 请求新游
          this.$ajax
            .get("/xd-api/new-game-list", {
              params: {
                page: this.newPage // 页码
              }
            })
            .then(response => {
              let arr = response.data.data;
              if (arr.length != 0) {
                this.new_game = this.new_game.concat(arr);
                done();
              } else {
                done(true);
              }
            });
        }, 500);
      }
      if (this.scrollBox == "openGame") {
        if (this.serveTabIndex == 1) {
          setTimeout(() => {
            this.beforePage++;
            // 已开新服
            this.$ajax
              .get("/xd-api/before-kf", {
                params: {
                  page: this.beforePage // 页码
                }
              })
              .then(response => {
                let arr = response.data.data;
                if (arr.length != 0) {
                  this.old_kf = this.old_kf.concat(arr);
                  done();
                } else {
                  done(true);
                }
              });
          }, 500);
        }
        if (this.serveTabIndex == 2) {
          setTimeout(() => {
            this.afterPage++;
            // 即将新服
            this.$ajax
              .get("/xd-api/after-kf", {
                params: {
                  page: this.afterPage // 页码
                }
              })
              .then(response => {
                let arr = response.data.data;
                if (arr.length != 0) {
                  this.new_kf = this.new_kf.concat(arr);
                  done();
                } else {
                  done(true);
                }
              });
          }, 500);
        }
      }
    }
  },
  activated() {},
  mounted() {
    this.$nextTick(function() {
      $(".slide-box").hide();
      this.isApp();
      //选项卡小红点
      var tabShowDot = this.getCookie("tabShowDot");
      if (tabShowDot == null) {
        this.setCookie("tabShowDot", true);
      }
      if (tabShowDot == "false") {
        this.tabShowDot = false;
      }
      var logo = window.localStorage.getItem("logo");
      if (logo != null && logo != "") {
        this.logo = logo;
      }
      this.$ajax
        .get("/xd-api/game-page")
        .then(response => {
          var data = response.data.data;
          this.slides = data.run_img;
          this.hot_game = data.hot_game;
          this.new_game = data.new_game;
          this.wxmp = data.wxmp;
          this.old_kf = data.kf.before;
          this.new_kf = data.kf.after;
          if (logo == "" || logo == null) {
            window.localStorage.setItem("logo", data.wxmp.logo);
            window.localStorage.setItem("qrcode", data.wxmp.code_link);
            this.logo = data.wxmp.logo;
          }
          //是否登录
          let slideBoxHeight;
          let vuxStickyHeight;
          if (this.getLoginStatus === false) {
            $(".slide-box").hide();
            slideBoxHeight = 0;
            vuxStickyHeight = parseInt(
              $(".vux-tab-wrap").outerHeight(true) -
                $(".vux-tab-wrap").outerHeight()
            );
          } else {
            this.play_log = data.play_log;
            //tab吸顶
            if (this.play_log.length > 0) {
              // console.log("登录了有数据");
              $(".slide-box").show();
              slideBoxHeight = $(".slide-box").height();
              vuxStickyHeight = parseInt($(".vux-tab-wrap").outerHeight());
            } else {
              // console.log("登录了没数据");
              $(".slide-box").hide();
              slideBoxHeight = 0;
              vuxStickyHeight = parseInt(
                $(".vux-tab-wrap").outerHeight(true) -
                  $(".vux-tab-wrap").outerHeight()
              );
            }
          }
          let height =
            $(".home-header").height() +
            $(".example-swiper").height() +
            slideBoxHeight +
            vuxStickyHeight;
          this.timer = setInterval(() => {
            // 监听当前滚动位置
            let ref = this.scrollBox;
            let { left, top } = this.$refs[ref].getPosition();
            if (top >= height) {
              // console.log(top +"----------"+parseInt(height));
              document.querySelector(".tab-sticky").style.display = "block";
              document.querySelector(".back-go-top").style.display = "block";
            } else {
              document.querySelector(".tab-sticky").style.display = "none";
              document.querySelector(".back-go-top").style.display = "none";
            }
          }, 50);
        })
        .catch(function(error) {
          console.log(error);
        });
    });
    var showDot = this.getCookie("showDot");
    if (showDot == null) {
      this.setCookie("showDot", true);
    }
    var clipboard = new Clipboard(".copy-btn");
    clipboard.on("success", e => {
      this.$vux.toast.text("复制成功");
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  deactivated(){
    clearInterval(this.timer);
  }
};
</script>
<style lang="less" scoped>
[v-cloak] {
  display: none;
}
// 解决Sticky粘贴滑动不生效
.wrapper {
  overflow-x: visible;
  display: table;
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
  border-radius: 0.05rem;
  &.badge-bule {
    background-color: #7395ec;
  }
}
.vux-sticky-box.vux-fixed {
  position: fixed !important;
  .vux-tab-wrap {
    background-color: #f9f9f9;
    margin-top: 0;
    padding-bottom: 0.1rem;
  }
}
.tab-sticky {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  display: none;
  .vux-tab-wrap {
    background-color: #f9f9f9;
    margin-top: 0;
    padding-bottom: 0.1rem;
  }
}
.back-go-top {
  display: none;
}
</style>