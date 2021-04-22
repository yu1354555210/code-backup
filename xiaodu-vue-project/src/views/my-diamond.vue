<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">我的金豆
      <span slot="right" class="icon-help" @click="switch_help_dialog(true)"></span>
    </x-header>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <section class="section">
        <div class="my-diamond-header this-box">
          <div class="my-diamond-fl">
            <div class="my-avatar">
              <img :src="getUserInfo.logo" alt="">
            </div>
            <span v-text="getUserInfo.nick_name"></span>
          </div>
          <div class="my-diamond-fr">
            <span class="icon-gold"></span>
            <span class="my-diamond-num" v-text="getDiamond"></span>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="my-diamond-list this-box">
          <ul class="nodata" id="dataList">
            <li v-for="(item, index) in dataList" :key="index">
              <div class="diamond-detail-name" v-text="item.title"></div>
              <div class="diamond-detail-diamond" v-if="item.type!=2">+{{item.cost_do}}</div>
              <div
                v-else
                class="diamond-detail-diamond diamond-detail-diamond-green"
              >-{{item.cost_do}}</div>
              <div class="diamond-detail-time" v-text="dateDiff(item.create_time)"></div>
            </li>
          </ul>
        </div>
      </section>
    </mescroll-vue>
    <v-help-popup v-if="helpPopup">
      <p>1、玩“哪吒游戏”平台中的游戏，充值即可获得金豆</p>
      <p>2、充值1元赠送10个金豆</p>
    </v-help-popup>
  </div>
</template>
<script>
import { XButton, XHeader } from "vux";
import { mapGetters, mapMutations, mapState } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import vHelpPopup from "@/components/v-help-popup";
export default {
  data() {
    return {
      isHelpMask: false,
      dataList: "",
      page: 1,
      limit: 20,
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
          icon: "http://h5.binglue.com/xd_static/img/not-gift.png", //图标,默认null,支持网络图
          tip: "还没有金豆记录哦~" //提示
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部 --</p>',
        noMoreSize: 10 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
      }
    };
  },
  components: {
    XHeader,
    MescrollVue,
    vHelpPopup
  },
  computed: {
    ...mapGetters(["getUserInfo", "getDiamond"]),
    ...mapState(["helpPopup"])
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    ...mapMutations(['switch_help_dialog']),
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // 联网请求
      this.$ajax
        .get("/xd-shop/diamond", {
          params: {
            page: page.num, // 页码
            limit: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data.data.items;
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.dataList = [];
          // 把请求到的数据添加到列表

          this.dataList = this.dataList.concat(arr);
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

<style scoped>
.mescroll {
  position: absolute;
  top: 0.88rem;
  bottom: 0;
  height: auto;
}
</style>
