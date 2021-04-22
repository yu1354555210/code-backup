<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">我的礼包</x-header>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <section class="section nodata" id="dataList">
        <div class="gift-item-box" v-for="(item,index) in list" :key="index">
          <div class="gift-item-body">
            <div class="gift-item">
              <div class="gift-item-fl">
                <div class="gift-item-img">
                  <img :src="item.game_logo" alt="">
                </div>
                <div class="gift-item-name" v-text="item.game_title"></div>
              </div>
              <div class="gift-item-fr">
                <x-button
                  type="warn"
                  @click.native="getGift(item.gift_code,item.gift_summary)"
                  class="gift-item-btn"
                  mini
                >领取</x-button>
              </div>
            </div>
            <div class="gift-item">
              <div class="gift-item-fl">
                <dl>
                  <dt>
                    {{item.git_title}}
                    <span>{{item.used_cnt}}</span>
                    / {{item.total_cnt}}
                  </dt>
                  <dd>{{item.gift_summary}}</dd>
                </dl>
              </div>
              <div class="gift-item-fr">
                <x-button
                  type="warn"
                  @click.native="playGame(item.play_url)"
                  class="gift-item-btn gift-item-ck-btn"
                  mini
                >进入游戏</x-button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </mescroll-vue>
    <!--领取礼包弹窗-->
    <gift-popup :giftCode="giftCode" :giftDec="giftDec" v-show="giftToggle"></gift-popup>
  </div>
</template>
<script>
import { XButton, XHeader } from "vux";
import { mapState } from "vuex";
import giftPopup from "@/components/v-gift-popup.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XButton,
    XHeader,
    giftPopup,
    MescrollVue
  },
  mounted() {
  },
  computed: {
    ...mapState(["giftToggle"])
  },
  methods: {
    getGift(id, smr) {
      this.giftShowFun(id, smr);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // 联网请求
      this.$ajax
        .get("/xd-api/player-gift", {
          params: {
            page: page.num, // 页码
            limit: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data.data;
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.list = [];
          // 把请求到的数据添加到列表

          this.list = this.list.concat(arr);
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
  },
  data() {
    return {
      giftDec: "",
      giftCode: "",
      giftWinpopShow: false,
      list: "",
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
          tip: "还没有礼包记录哦~" //提示
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部 --</p>',
        noMoreSize: 10 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
      }
    };
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
