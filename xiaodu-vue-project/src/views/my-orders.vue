<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">我的奖品
      <span slot="right" class="icon-help" @click="switch_help_dialog(true)"></span>
    </x-header>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <section class="section">
        <div class="my-orders-list nodata" id="dataList">
          <div class="my-orders-item this-box" v-for="(item, index) in dataList" :key="index" @click="toOrdersDetail(item.id)">
            <div class="my-orders-top">
              <div>
                订单状态：
                <span v-if="item.status == 40">待发货</span>
                <span v-if="item.status == 50" class="orders-status-blue">已发货</span>
                <span v-if="item.status == 80" class="orders-status-green">已收货</span>
                <span v-if="item.status == 20" class="orders-status-red">异常订单</span>
              </div>
              <span>兑换时间：{{dateDiff(item.create_time)}}</span>
            </div>
            <div class="my-orders-main">
              <div class="my-orders-image">
                <img :src="item.goods_logo" alt="">
              </div>
              <p v-text="item.goods_title"></p>
            </div>
            <div class="my-orders-footer">
              <div class="my-orders-btn" v-if="item.status!=40 && item.status != 20">
                <x-button class="" v-if="item.goods_type == 2" :mini="true" type="warn" @click.stop.native="isKmDialog(item)">查看卡密</x-button>
                <div class="btn-orders-blue" v-else>
                  <x-button type="primary" :mini="true" @click.stop.native="iskdDialog(item)">查看物流</x-button>
                </div>
              </div>
              <dl>
                <dt>兑换价格</dt>
                <dd>
                  <span class="icon-gold"></span>
                  <span class="my-diamond-num" v-text="item.current_do"></span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

    </mescroll-vue>
    <!-- 快递信息 -->
    <div class="orders-dialog-container" v-if="kdDialog" @click.self="kdDialog=false">
      <div class="orders-dialog this-box">
        <div class="orders-dialog-title">快递信息</div>
        <div class="orders-dialog-main">
          <ul class="order-kd-info">
            <li>
              <label>快递公司：</label>
              <span>{{ext_info1}}</span>
            </li>
            <li class="flex">
              <label>运单号：</label>
              <span>{{ext_info2}}</span>
              <a href="javascript:;" class="copy-btn" :data-clipboard-text="ext_info2">复制</a>
            </li>
          </ul>
        </div>
        <div class="orders-dialog-footer">
          <x-button type="warn" :mini="true" @click.native="kdDialog=false">关闭</x-button>
        </div>
      </div>
    </div>
    <!-- 卡密信息 -->
    <div class="orders-dialog-container" v-if="kmDialog" @click.self="kmDialog=false">
      <div class="orders-dialog">
        <div class="orders-dialog-title">卡密信息</div>
        <div class="orders-dialog-main">
          <ul>
            <li>
              <div class="order-code-item">
                {{ext_info1}}
                <a href="javascript:;" class="copy-btn" :data-clipboard-text="ext_info1">复制卡号</a>
              </div>
              <div class="order-code-item">
                {{ext_info2}}
                <a href="javascript:;" class="copy-btn" :data-clipboard-text="ext_info2">复制密码</a>
              </div>
            </li>
          </ul>
        </div>
        <div class="orders-dialog-footer">
          <x-button type="warn" :mini="true" @click.native="kmDialog=false">关闭</x-button>
        </div>
      </div>
    </div>
    <v-help-popup v-if="helpPopup">
      <p>1、奖品兑换成功后，客服将进行审核，审核时间一般为1-2个工作日</p>
      <p>2、审核通过，奖品将正常发放，虚拟物品直接提供卡密，实物将进行邮寄，如遇节假日将延时发货</p>
    </v-help-popup>
  </div>
</template>
<script>
import { XButton, XHeader } from "vux";
import { mapGetters, mapState, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import Clipboard from "clipboard";
import vHelpPopup from "@/components/v-help-popup";

export default {
  data() {
    return {
      isHelpMask: false,
      dataList: "",
      page: 1,
      limit: 20,
      kdDialog: false,
      kmDialog: false,
      ext_info1: "",
      ext_info2: "",
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
          tip: "没有奖品，快去商城兑换吧", //提示
          btntext: "去逛逛 >", //按钮,默认""
          btnClick: function(){//点击按钮的回调,默认null
            this.$router.push("/game-malls");
          }.bind(this)
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部 --</p>',
        noMoreSize: 10 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
      }
    };
  },
  components: {
    XHeader,
    XButton,
    MescrollVue,
    vHelpPopup
  },
  computed: {
    ...mapGetters(["getUserInfo", "getDiamond"]),
    ...mapState(["helpPopup"])
  },
  mounted() {
    this.$nextTick(function() {
      var clipboard = new Clipboard(".copy-btn");
      clipboard.on("success", e => {
        this.$vux.toast.text("复制成功");
      });
    });
  },
  methods: {
    ...mapMutations(['switch_help_dialog']),
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // 联网请求
      this.$ajax
        .get("/xd-shop/order-list", {
          params: {
            page: page.num, // 页码
            limit: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data.data;
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
    },
    isKmDialog(item){
      this.ext_info1 = item.ext_info1;
      this.ext_info2 = item.ext_info2;
      this.kmDialog = true;
    },
    iskdDialog(item){
      this.ext_info1 = item.ext_info1;
      this.ext_info2 = item.ext_info2;
      this.kdDialog = true;
    },
    toOrdersDetail(id){
      this.$router.push({
        name: "orders-detail",
        query: {
          id: id
        }
      })
    }
  }
};
</script>

<style lang="less">
.mescroll-empty .empty-btn{
  max-width: 40%;
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
