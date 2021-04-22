<template>
    <div class="wrapper">
      <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
        <section class="section">
            <div class="gift-item-box" v-for="(item,index) in list">
                <div class="gift-item-body" :class="index == activeIndex?'gift-item-open':''">
                    <div class="gift-item">
                        <div class="gift-item-fl">
                            <div class="gift-item-img"><img :src="item.logo" alt=""></div>
                            <div class="gift-item-name" v-text="item.game_name"></div>
                        </div>
                        <div class="gift-item-fr">
                            <x-button type="warn" class="gift-item-btn" mini @click.native="playGame(item.play_link,$route.path,item.game_id)">开始玩</x-button>
                        </div>
                    </div>
                    <div class="gift-item" v-for="(it,i) in item.gift_list">
                        <div class="gift-item-fl">
                            <dl>
                                <dt>{{it.title}}　剩余:<span>{{it.total_cnt - it.used_cnt}}</span></dt>
                                <dd>{{it.smr}}</dd>
                            </dl>
                        </div>
                        <div class="gift-item-fr">
                            <x-button v-if="it.is_got == 1" type="warn" @click.native="getGift(it.id,it.smr,index,i,$event)" 
                            class="gift-item-btn gift-item-ck-btn" mini>查看
                            </x-button>
                            <x-button v-else type="warn" @click.native="getGift(it.id,it.smr,index,i,$event)" 
                            class="gift-item-btn gift-item-lq-btn" mini>领取
                            </x-button>
                        </div>
                    </div>
                </div>
                <div class="gift-check-more" v-show="index != activeIndex && item.cnt>1" @click="setIndex(index,$event)"><i class="icon-arrow"></i><span>查看更多礼包（{{item.cnt - 1}}）</span></div>
            </div>
        </section>
      </mescroll-vue>
        <!--领取礼包弹窗-->
      <gift-popup :giftCode="giftCode" :giftDec="giftDec" v-show="giftToggle"></gift-popup>
    </div>
</template>

<script>
import { XButton } from "vux";
import giftPopup from "@/components/v-gift-popup.vue";
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XButton,
    giftPopup,
    MescrollVue
  },
  data() {
    return {
      giftDec: "",
      giftCode: "",
      giftWinpopShow: false,
      giftMoreShow: true,
      activeIndex: -1,
      giftDb: new Set(),
      list: [],
      page: 1,
      limit: 20,
      mescroll: null,
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
          warpId: "noData", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "https://h5.qianr.com/xd_static/img/not-gift.png", //图标,默认null,支持网络图
          tip: "还没有礼包记录哦~" //提示
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部 --</p>',
        noMoreSize: 10 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
      }
    };
  },
  computed: {
    ...mapState(["loginPopup", "giftToggle"]),
    ...mapGetters(["getLoginStatus"])
  },
  methods: {
    setIndex(index, event) {
      this.activeIndex = index;
    },
    getGift(id, smr, listIndex, itemIndex, $event) {
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
              if (response.data.status === 403){
                this.loginPopupShow(this.$route.path);
                return;
              }
              this.$vux.toast.text(msg);
              return;
            }
            this.giftShowFun(msg, smr);
            this.$set(this.list[listIndex].gift_list[itemIndex], "is_got", 1);
            if (response.data.left != -1 && response.data.left != undefined) {
              //领取之后获取新的礼包数量
              $event.target.parentNode.previousElementSibling.children[0].children[0].children[0].innerText = response.data.left;
            }
          })
          .catch(error => {
            this.$vux.toast.text("服务器错误，请稍后重试");
          });
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // 联网请求
      this.$ajax
        .get("/xd-api/gift-list", {
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
    },
  },
  mounted() {
    this.$nextTick(function() {
    });
  }
};
</script>

<style>
.gift-item-body.gift-item-open {
  height: auto;
}
</style>
