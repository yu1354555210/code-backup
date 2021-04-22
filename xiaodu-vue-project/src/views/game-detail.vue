<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <x-header :left-options="{backText: ''}">游戏详情</x-header>
      <div class="detail-top">
        <div class="detail-bg">
          <img :src="game.bg_img" alt="">
        </div>
        <div class="detail-gradient"></div>
        <div class="game-detail-box">
          <div class="game-detail-fl">
            <dl>
              <dt class="game-detail-img">
                <img :src="game.logo" alt="">
              </dt>
              <dd>
                <div class="game-detail-name">{{game.title}}</div>
                <div class="game-detail-person">{{game.smr}}</div>
              </dd>
            </dl>
          </div>
          <div
            v-cloak
            class="game-detail-btn"
            v-if="!isFocus"
            @click="focusGame(1,`详情页-${game.title}-关注`)"
          >关注游戏</div>
          <div
            v-cloak
            class="game-detail-btn game-detail-cancel-btn"
            v-else="isFocus"
            @click="$vux.toast.text('请在我的关注中取消')"
          >已关注</div>
        </div>
      </div>
      <div class="section">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(pic,i) in game.pics" :key="i">
            <img :src="pic" alt="游戏图片">
          </swiper-slide>
        </swiper>
      </div>
      <div class="detail-content">
        <section class="section">
          <div class="this-title">
            <i class="icon-title"></i>
            <b>游戏简介</b>
          </div>
          <div class="text-content">
            <label v-html="content"></label>
            <span v-if="isToggle">
              <span @click="handleFold(false)" v-show="maxLen  != haystack.length">全文</span>
              <span @click="handleFold(true)" v-show="maxLen  == haystack.length">收起</span>
            </span>
          </div>
        </section>
        <section class="section" v-if="gifts != ''">
          <div class="this-title">
            <i class="icon-title"></i>
            <b>游戏礼包</b>
          </div>
          <ul class="gift-list">
            <li v-for="(gift, index) in gifts" :key="index">
              <div class="gift-fl">
                <div class="gift-name">{{gift.title}}</div>
                <div class="gift-dec">{{gift.summary}}</div>
              </div>
              <div class="gift-fr">
                <x-button
                  v-if="gift.is_got==1"
                  type="warn"
                  @click.native="getGift(gift.gift_id,gift.summary,index)"
                  class="gift-item-btn gift-item-ck-btn"
                  mini
                >查看</x-button>
                <x-button
                  v-else
                  type="warn"
                  mini
                  class="gift-item-btn"
                  @click.native="getGift(gift.gift_id,gift.summary,index)"
                >领取</x-button>
              </div>
            </li>
          </ul>
        </section>
        <section class="section">
          <div class="this-title">
            <i class="icon-title"></i>
            <b>热门推荐</b>
          </div>
          <!-- 滑块 -->
          <div class="slide-box">
            <div class="slide-media">
              <swiper :options="swiperOption">
                <!-- slides -->
                <swiper-slide v-for="(rec,i) in rec_games" :key="i">
                  <router-link
                    :to="{name:'game-detail', params:{id:rec.game_id}}"
                    @click.native="cnzzTrackEvent(`详情页热门游戏-${rec.title}`)"
                  >
                    <img :src="rec.logo" alt="">
                    <p>{{rec.title}}</p>
                  </router-link>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </section>
        <div class="this-title"></div>
      </div>
      <!-- 关注成功弹窗 -->
      <div class="focus-success-popup-container" v-if="isFocusWin" @click.self="hideFocusWin">
        <div class="focus-success-wrapper">
          <div class="icon-close" @click.self="hideFocusWin"></div>
          <div class="focus-success-main">
            <h3>关注成功</h3>
            <p>当开新服，有新礼包等福利时，我们会第一时间通知您~</p>
          </div>
          <div class="focus-success-footer">
            <label>
              <input type="checkbox" name="" id="" v-model="checkedValue">
              <span>不再显示该提示</span>
            </label>
          </div>
        </div>
      </div>
      <!--领取礼包弹窗-->
      <gift-popup :giftCode="giftCode" :giftDec="giftDec" v-show="giftToggle"></gift-popup>
      <!-- 绑定手机弹窗 -->
      <mobile-popup v-if="mobilePopup"></mobile-popup>
    </mescroll-vue>
    <!-- 开始游戏悬浮层 -->
    <div class="start-btn-fixed">
      <x-button
        type="primary"
        @click.native="playGame(game.play_link,$route.path,game.game_id,`详情页-${game.title}-开始游戏`)"
      >开始游戏</x-button>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { mapState, mapGetters, mapMutations } from "vuex";
import { XButton, XHeader } from "vux";
import giftPopup from "@/components/v-gift-popup.vue";
import mobilePopup from "@/components/v-bind-mobile-popup.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
const maxLen = 110; //限制最大字符数,超出隐藏
export default {
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false,
        isBounce: false
      },
      id: undefined,
      game: [],
      giftDb: new Set(),
      gifts: [],
      rec_games: [],
      swiperOption: {
        observeParents: true,
        spaceBetween: 15,
        slidesPerView: "auto"
      },
      swiperSlides: 5,
      giftDec: "",
      giftCode: "",
      haystack: "",
      maxLen: maxLen,
      isToggle: false,
      isFocus: false,
      isGot: false,
      isFocusWin: false,
      checkedValue: null,
      answer: null
    };
  },
  components: {
    swiper,
    swiperSlide,
    XButton,
    XHeader,
    giftPopup,
    mobilePopup,
    MescrollVue
  },

  created() {
    this.fetchDate();
  },
  watch: {
    $route: "fetchDate",
    checkedValue: function(new_v, old_v) {
      this.answer = this.checkedValue;
    }
  },
  mounted() {
    this.$nextTick(function() {});
  },
  computed: {
    ...mapState(["loginPopup", "giftToggle", "mobilePopup"]),
    ...mapGetters(["getLoginStatus", "getUserInfo"]),
    content() {
      const maxLen = this.maxLen;
      const haystack = this.haystack;
      return haystack.length > maxLen
        ? haystack.slice(0, maxLen) + ""
        : haystack;
    }
  },
  methods: {
    ...mapMutations(["switch_mobile_dialog"]),
    handleFold(fold) {
      this.maxLen = fold ? maxLen : this.haystack.length;
    },
    focusGame(is_focus, category) {
      this.cnzzTrackEvent(category);
      //关注游戏
      if (this.getLoginStatus === false) {
        this.loginPopupShow(this.$route.path);
        return;
      }
      if (this.getUserInfo.is_bind_phone === 0) {
        //如果没绑定手机
        this.switch_mobile_dialog(true);
      } else {
        let params = new URLSearchParams();
        params.append("game_id", this.id);
        params.append("is_focus", is_focus);
        this.$ajax({
          method: "post",
          url: "xiaodu/game-focus/save",
          data: params
        })
          .then(response => {
            let data = response.data;
            if (data.code === 403) {
              this.loginPopupShow(this.$route.path);
              return;
            }
            if (data.code != 0) {
              this.isFocus = true;
              if (!(localStorage.getItem("isFocusWin") == "false")) {
                //弹出关注成功弹窗
                this.isFocusWin = true;
              }
            }
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    },
    hideFocusWin() {
      // 隐藏关注成功弹窗
      this.isFocusWin = false;
      if (this.checkedValue) {
        localStorage.setItem("isFocusWin", "false");
      }
    },
    fetchDate() {
      this.id = this.$route.params.id;
      if (this.id == undefined) return;

      this.$ajax
        .get("/xd-api/game-content", {
          params: { game_id: this.id }
        })
        .then(response => {
          let _d = response.data;
          if (_d.status !== 1) return;
          this.game = _d.data;
          this.gifts = _d.data.gifts;
          this.rec_games = _d.data.rec_games;
          this.haystack = this.game.summary;
          this.game.is_focus == 1
            ? (this.isFocus = true)
            : (this.isFocus = false);
          this.haystack.length > maxLen
            ? (this.isToggle = true)
            : (this.isToggle = false);
        });
    },
    getGift(id, smr, i) {
      if (this.getLoginStatus === false) {
        this.loginPopupShow(this.$route.path);
        return;
      } else {
        this.$ajax
          .get("/gift/ajax-get-code", {
            params: {
              gift_id: id
            }
          })
          .then(response => {
            var msg = response.data.msg;
            if (response.data.status != 1) {
              if (response.data.status == 403) {
                this.loginPopupShow(this.$route.path);
                return;
              }
              this.$vux.toast.text(msg);
              return;
            }
            this.giftShowFun(msg, smr);
            //领取成功把当前这条状态改为已领取
            this.$set(this.gifts[i], "is_got", 1);
          })
          .catch(error => {
            this.$vux.toast.text("服务器错误，请稍后重试");
          });
      }
    }
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>

<style scoped>
.wrapper {
  padding-bottom: 1rem;
}
.mescroll {
  overflow-x: hidden;
}
</style>
