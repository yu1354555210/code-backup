<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">开服表</x-header>
    <mescroll-vue ref="mescroll" :up="mescrollUp" :down="mescrollDown" @init="mescrollInit">
      <div class="tab-open-server">
        <tab custom-bar-width="80px" v-model="index" bar-active-color="#4fb8fa">
          <tab-item
            class="vux-center"
            active-class="cur"
            v-for="(item, index) in tabList2"
            :key="index"
            @click.native="moveTab(index)"
          >{{item}}</tab-item>
        </tab>
      </div>
      <div class="swiper-item nodata" v-show="index==0" id="dataList0">
        <ul class="game-list">
          <li v-for="item in beforeList">
            <router-link
              :to="{name:'game-detail', params:{'id':item.game_id}}"
              tag="div"
              class="item-fl"
            >
              <div class="game-img">
                <img :src="item.icon" alt="">
              </div>
              <div class="game-media">
                <div class="game-name">
                  <h3 v-text="item.title"></h3>
                </div>
                <div class="game-serve" v-text="item.zone"></div>
                <div class="game-time">
                  <span v-text="dateDiff(item.kf_time)"></span>
                </div>
              </div>
            </router-link>
            <div class="item-fr">
              <button
                class="item-btn"
                @click="playGame(item.play_link,$route.path,item.game_id,`开服表页-${item.title}-开始游戏`)"
              >开始游戏</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="swiper-item nodata" v-show="index==1" id="dataList1">
        <ul class="game-list game-list-red">
          <li v-for="(item,index) in afterList">
            <router-link
              :to="{name:'game-detail', params:{'id':item.game_id}}"
              class="item-fl"
              tag="div"
            >
              <div class="game-img">
                <img :src="item.icon" alt="">
              </div>
              <div class="game-media">
                <div class="game-name">
                  <h3 v-text="item.title"></h3>
                </div>
                <div class="game-serve" v-text="item.zone"></div>
                <div class="game-time">
                  <span v-text="dateDiff(item.kf_time)"></span>
                </div>
              </div>
            </router-link>
            <div class="item-fr">
              <button
                class="item-btn"
                @click="focusGame(1,item.game_id,index,`开服表页开服提醒-${item.title}`)"
                v-if="item.is_focus==0"
              >开服提醒</button>
              <button
                class="item-btn item-cancel-btn"
                @click="focusGame(0,item.game_id,index,`开服表页取消提醒-${item.title}`)"
                v-else
              >已设置提醒</button>
            </div>
          </li>
        </ul>
      </div>
    </mescroll-vue>
    <!-- 绑定手机弹窗 -->
    <mobile-popup v-if="mobilePopup"></mobile-popup>
  </div>
</template>

<script>
import { XButton, XHeader, XInput, Icon, Tab, TabItem } from "vux";
import { mapGetters, mapState, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import mobilePopup from "@/components/v-bind-mobile-popup.vue";
const tabList = () => ["已开新服", "即将开服"];
export default {
  data() {
    return {
      tabList2: tabList(),
      index: 0,
      serveTabIndex: 1,
      beforeList: "", //热门
      afterList: "", //新游
      mescroll: null,
      mescrollDown: {
        // use: false
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
          warpId: "dataList0", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "https://h5.qianr.com/xd_static/img/not-gift.png", //图标,默认null,支持网络图
          tip: "暂无开服信息" //提示
        },
        htmlNodata: '<p class="upwarp-nodata">已加载全部</p>',
        noMoreSize: 10, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        toTop: {
          //回到顶部按钮,需配置src才显示
          warpId: null, //父布局的id; 默认添加在body中
          src: "https://h5.binglue.com/xd_static/img/icon-top.png", //图片路径,默认null;
          html: null, //html标签内容,默认null; 如果同时设置了src,则优先取src
          offset: 500, //列表滚动多少距离才显示回到顶部按钮,默认1000
          warpClass: "mescroll-totop", //按钮样式,参见mescroll.css
          showClass: "mescroll-fade-in", //显示样式,参见mescroll.css
          hideClass: "mescroll-fade-out", //隐藏样式,参见mescroll.css
          duration: 300, //回到顶部的动画时长,默认300ms
          supportTap: false, //默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
          btnClick: null // 点击按钮的回调; 小提示:如果在回调里return true,将不执行回到顶部的操作.
        }
      }
    };
  },
  components: {
    Tab,
    TabItem,
    XButton,
    XHeader,
    XInput,
    Icon,
    MescrollVue,
    mobilePopup
  },
  computed: {
    ...mapState(["mobilePopup"]),
    ...mapGetters(["getUserInfo", "getLoginStatus"])
  },
  mounted() {
    this.$nextTick(function() {});
  },
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
    ...mapMutations(["switch_mobile_dialog"]),
    focusGame(is_focus, game_id, index, category) {
      this.cnzzTrackEvent(category);
      if (this.getLoginStatus === false) {
        this.loginPopupShow(this.$route.path);
        return;
      }
      if (this.getUserInfo.is_bind_phone === 0) {
        //如果没绑定手机
        this.switch_mobile_dialog(true);
      } else {
        let params = new URLSearchParams();
        params.append("game_id", game_id);
        params.append("is_focus", is_focus);
        this.$ajax({
          method: "post",
          url: "xiaodu/game-focus/save",
          data: params
        })
          .then(response => {
            let data = response.data;
            if (data.code != 0) {
              if (data.data.is_foucus == 1) {
                for (let i in this.afterList) {
                  if (this.afterList[i].game_id == game_id) {
                    this.$set(this.afterList[i], "is_focus", 1);
                  }
                }
                this.$vux.toast.text("提醒设置成功");
              } else if (data.data.is_foucus == 0) {
                for (let i in this.afterList) {
                  if (this.afterList[i].game_id == game_id) {
                    this.$set(this.afterList[i], "is_focus", 0);
                  }
                }
                this.$vux.toast.text("取消提醒设置成功");
              }
            }
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    moveTab(index) {
      this.index = index;
      this.beforeList = [];
      this.new_game = [];
      this.mescroll.resetUpScroll();
      this.mescrollUp.empty.warpId = "dataList" + index;
    },
    upCallback(page, mescroll) {
      if (this.index == 0) {
        this.$ajax
          .get("/xd-api/before-kf", {
            params: {
              page: page.num, // 页码
              limit: page.size // 每页长度
            }
          })
          .then(response => {
            let data = response.data.data;

            // 如果是第一页需手动制空列表
            if (page.num === 1) this.beforeList = [];
            // 把请求到的数据添加到列表

            this.beforeList = this.beforeList.concat(data);
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
          .get("/xd-api/after-kf", {
            params: {
              page: page.num, // 页码
              limit: page.size // 每页长度
            }
          })
          .then(response => {
            let data = response.data.data;

            // 如果是第一页需手动制空列表
            if (page.num === 1) this.afterList = [];
            // 把请求到的数据添加到列表

            this.afterList = this.afterList.concat(data);
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
    }
  }
};
</script>

<style lang="less" scoped>
.mescroll {
  position: absolute;
  top: 0.88rem;
  bottom: 0;
  height: auto;
}
.tab-open-server {
  position: relative;
  z-index: 66;
  .vux-tab {
    height: 0.7rem;
    .vux-tab-item {
      font-size: 0.3rem;
      &.cur {
        color: #4fb8fa;
        border-color: #4fb8fa;
      }
    }
  }
}
.game-list {
  padding-top: 0;
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