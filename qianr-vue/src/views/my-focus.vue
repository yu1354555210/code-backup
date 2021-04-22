<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">
      我关注的游戏
      <span slot="right" class="icon-help" @click="switch_help_dialog(true)"></span>
    </x-header>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="my-focus-list nodata" id="dataList">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(item, index) in focusList" :key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick(item.game_id,index,item.title)" type="warn">取消关注</swipeout-button>
            </div>
            <div slot="content" class="focus-item vux-1px-b">
              <dl>
                <dt>
                  <img :src="item.logo" alt="">
                </dt>
                <dd>
                  <div class="focus-game-name" v-text="item.title"></div>
                  <div class="focus-game-dec" v-text="item.sma"></div>
                </dd>
              </dl>
              <div
                class="focus-item-btn"
                @click="playGame(item.game_link,$route.path,item.game_id,`我关注的游戏页开始游戏-${item.title}`)"
              >开始游戏</div>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
      <v-help-popup v-if="helpPopup">
        <p>关注游戏后，该游戏的新福利、新开服等信息，都会第一时间以短信的形式通知您~</p>
      </v-help-popup>
    </mescroll-vue>
    <!-- 是否取消关注 -->
    <div
      class="cancel-focus-popup-container"
      v-if="exchangeComfirm"
      @click.self="exchangeComfirm=false"
    >
      <div class="cancel-focus-popup-wrapper">
        <div class="icon-close" @click="exchangeComfirm=false"></div>
        <div class="cancel-focus-popup-title">是否确认取消关注？</div>
        <div class="cancel-focus-popup-warn">取消关注，游戏有新开服、新礼包等福利时，您将无法收到通知</div>
        <div class="cancel-focus-popup-btn-box">
          <a href="#" class="cancel-focus-popup-btn" @click="exchangeComfirm=false">我再想想</a>
          <a href="javascript:;" class="cancel-focus-popup-btn tourist-btn" @click="cancelFocus(`我关注的游戏页-${gameTitle}-取消关注`)">取消关注</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  XButton,
  XHeader,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  Flexbox,
  FlexboxItem
} from "vux";
import { mapState, mapMutations } from "vuex";
import vHelpPopup from "@/components/v-help-popup";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  data() {
    return {
      focusList: [],
      gameId: null,
      exchangeComfirm: false,
      idx: null,
      gameTitle: "",
      mescroll: null,
      mescrollDown: {},
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 20 //每页数据条数,默认10
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "dataList", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "https://h5.qianr.com/xd_static/img/not-gift.png", //图标,默认null,支持网络图
          tip: "神马都没有关注~", //提示
          btntext: "去关注 >", //按钮,默认""
          btnClick: function() {
            //点击按钮的回调,默认null
            this.$router.push("/");
          }.bind(this)
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部 --</p>',
        noMoreSize: 10 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
      }
    };
  },
  components: {
    XButton,
    XHeader,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Flexbox,
    FlexboxItem,
    vHelpPopup,
    MescrollVue
  },
  mounted() {
    this.$nextTick(function() {});
  },
  computed: {
    ...mapState(["helpPopup"])
  },
  methods: {
    ...mapMutations(["switch_help_dialog"]),
    onButtonClick(id, index, title) {
      this.exchangeComfirm = true;
      this.gameId = id;
      this.gameTitle = title;
      this.idx = index;
    },
    cancelFocus(category) {
      this.cnzzTrackEvent(category);
      let params = new URLSearchParams();
      params.append("game_id", this.gameId);
      params.append("is_focus", 0);
      this.$ajax({
        method: "post",
        url: "xiaodu/game-focus/save",
        data: params
      })
        .then(response => {
          let data = response.data;
          if (data.code != 0) {
            this.exchangeComfirm = false;
            this.focusList.splice(this.idx, 1);
            this.$vux.toast.text("取消关注成功");
            if(this.focusList.length == 0){
              this.mescroll.resetUpScroll();
            }
          }
        })
        .catch(error => {
          this.$vux.toast.text("系统错误，请稍后重试");
        });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // 联网请求
      this.$ajax
        .get("/xiaodu/game-focus/index", {
          params: {
            page: page.num, // 页码
            limit: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data.data.games;
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.focusList = [];
          // 把请求到的数据添加到列表

          this.focusList = this.focusList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    }
  }
};
</script>
<style lang="less">
.my-focus-list {
  .vux-swipeout-button-warn {
    background-color: #ff5363;
  }
}
</style>

<style scoped>
.mescroll {
  position: absolute;
  top: 0.88rem;
  bottom: 0;
  height: auto;
}
</style>
