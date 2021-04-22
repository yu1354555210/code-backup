<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <x-header :left-options="{backText: ''}">商品详情</x-header>
      <div class="goods-detail-top-image">
        <img :src="goodsInfo.logo" alt="">
      </div>
      <section class="section bb-line">
        <div class="goods-detail-info">
          <div class="goods-detail-name" v-text="goodsInfo.title"></div>
          <div class="goods-money">
            <i class="icon-gold"></i>
            <span v-text="goodsInfo.current_do"></span>
            <s v-if="goodsInfo.origin_do != 0" v-text="goodsInfo.origin_do"></s>
          </div>
          <dl class="category-area">
            <dt>
              <router-link
                tag="span"
                :to="{name:'game-malls-category', query:{'id':item.category_id,'title':item.title}}"
                v-for="(item, index) in categoryList"
                :key="index"
                v-text="item.title"
                :data-id="item.category_id"
                @click
              ></router-link>
            </dt>
            <dd v-cloak>剩余数量：{{goodsInfo.sku}}</dd>
          </dl>
        </div>
      </section>
      <div class="goods-detail-content">
        <h2>商品介绍</h2>
        <div class="goods-detail-des" v-text="goodsInfo.des" v-if="goodsInfo.des != ''"></div>
        <div v-html="content"></div>
      </div>
    </mescroll-vue>
    <div class="goods-detail-bottom-tool">
      <dl>
        <dt @click="toCategoryList('商城商品详情页-同类商品')">
          <i class="icon-category"></i>同类商品
        </dt>
        <dd @click="exchangeDialog('商城商品详情页-立即兑换')">立即兑换</dd>
      </dl>
    </div>
    <!-- 金豆不足弹窗 -->
    <div class="malls-dialog-container" @click.self="hideZsDialog" v-if="zsNotDialog">
      <div class="malls-dialog-wrapper">
        <div class="icon-malls-diolog-close" @click="hideZsDialog"></div>
        <div class="malls-dialog-main-item" v-if="!showTips">
          <div class="malls-dialog-main">金豆不足，兑换失败</div>
          <div class="malls-dialog-footer btn-malls-blue">
            <x-button class="" type="primary" @click.native="showTips=true">如何获得金豆？</x-button>
          </div>
        </div>
        <div class="malls-dialog-main-item" v-if="showTips">
          <div class="malls-dialog-tips">1. 长按识别二维码或微信搜索公众号“哪吒游戏”</div>
          <div class="malls-dialog-tips">2. 参加活动有机会获得海量金豆奖励</div>
        </div>
      </div>
    </div>
    <!-- 商品库存不足，正在努力补货 -->
    <div class="malls-dialog-container" @click.self="goodsNotDialog=false" v-if="goodsNotDialog">
      <div class="malls-dialog-wrapper">
        <div class="icon-malls-diolog-close" @click="goodsNotDialog=false"></div>
        <div class="malls-dialog-main">商品库存不足，正在努力补货</div>
        <div class="malls-dialog-footer btn-malls-blue">
          <x-button class="" type="primary" @click.native="urge">催促补货</x-button>
        </div>
      </div>
    </div>
    <!-- 您尚未填写收货地址，请填写收货地址 -->
    <div
      class="malls-dialog-container"
      @click.self="addressNotDialog=false"
      v-if="addressNotDialog"
    >
      <div class="malls-dialog-wrapper">
        <div class="icon-malls-diolog-close" @click="addressNotDialog=false"></div>
        <div class="malls-dialog-main">尚未填写收货地址</div>
        <div class="malls-dialog-footer btn-malls-blue">
          <x-button class="" type="primary" @click.native="toAddress">去填写</x-button>
        </div>
      </div>
    </div>
    <!-- 兑换成功 -->
    <div class="malls-dialog-container" @click.self="zsYesDialog=false" v-if="zsYesDialog">
      <div class="malls-dialog-wrapper">
        <div class="icon-malls-diolog-close" @click="zsYesDialog=false"></div>
        <div class="malls-dialog-exchange">
          <dl>
            <dt>兑换成功</dt>
            <dd>在哪吒游戏玩游戏，比APP多返3倍金豆哦~</dd>
          </dl>
        </div>
        <div class="malls-dialog-footer btn-malls-blue">
          <x-button class="" type="primary" @click.native="toIndex">去玩游戏</x-button>
        </div>
      </div>
    </div>
    <!-- 确认收货地址 -->
    <div class="malls-dialog-container" @click.self="addressComfirm=false" v-if="addressComfirm">
      <div class="malls-dialog-wrapper malls-confirm-wrapper">
        <div class="icon-malls-diolog-close" @click="addressComfirm=false"></div>
        <div class="malls-confirm-header vux-1px-b">确认收货地址</div>
        <div class="malls-dialog-flex">
          <div class="malls-confirm-main">
            <dl>
              <dt>
                {{getAddress.title}}
                <span>{{getAddress.mobile}}</span>
              </dt>
              <dd v-text="getAddress.province +' '+ getAddress.info"></dd>
            </dl>
          </div>
          <flexbox class="btn-malls-blue">
            <flexbox-item>
              <x-button class="" type="primary" @click.native="toAddress">修改地址</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button class="" type="warn" @click.native="exchange">确认兑换</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <!-- 是否确认兑换 -->
    <div class="malls-dialog-container" @click.self="exchangeComfirm=false" v-if="exchangeComfirm">
      <div class="malls-dialog-wrapper malls-confirm-wrapper">
        <div class="icon-malls-diolog-close" @click="exchangeComfirm=false"></div>
        <div class="malls-confirm-header vux-1px-b">是否确认兑换</div>
        <div class="malls-comfirm-tips">{{goodsInfo.title}}？</div>
        <flexbox class="btn-malls-blue" justify="center">
          <flexbox-item>
            <x-button class="" type="primary" @click.native="exchangeComfirm=false">我再想想</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button class="" type="warn" @click.native="exchange">确认兑换</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton, XHeader, Flexbox, FlexboxItem } from "vux";
import { mapGetters } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  mounted() {
    this.$nextTick(function() {
      this.getData();
    });
  },
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false
      },
      id: undefined,
      goodsInfo: "",
      addressInfo: "",
      categoryList: [],
      content: "",
      showTips: false,
      zsNotDialog: false,
      goodsNotDialog: false,
      addressNotDialog: false,
      zsYesDialog: false,
      addressComfirm: false,
      exchangeComfirm: false,
      flag: false
    };
  },
  components: {
    XHeader,
    XButton,
    Flexbox,
    FlexboxItem,
    MescrollVue
  },
  computed: {
    ...mapGetters(["getAddress", "getDiamond", "getLoginStatus"])
  },
  methods: {
    getData() {
      this.id = this.$route.params.id;
      this.$ajax
        .get("/xd-shop/goods", {
          params: {
            id: this.id
          }
        })
        .then(res => {
          let data = res.data.data;
          this.goodsInfo = data.goods;
          this.content = data.content.content;
          this.categoryList = data.category_list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    exchangeDialog(category) {
      let type = this.goodsInfo.type;
      this.cnzzTrackEvent(category);
      if (this.getLoginStatus === false) {
        this.loginPopupShow(this.$route.path);
        return;
      } else {
        if (type == 1) {
          if (
            this.getDiamond < this.goodsInfo.current_do ||
            this.getDiamond == null
          ) {
            this.zsNotDialog = true; //金豆不足
          } else if (this.getAddress == null) {
            //没有填写地址
            this.addressNotDialog = true;
          } else if (this.goodsInfo.sku == 0) {
            this.goodsNotDialog = true; //库存不足
          } else {
            this.addressComfirm = true;
          }
        } else {
          if (this.goodsInfo.sku == 0) {
            this.goodsNotDialog = true; //库存不足
          } else if (
            this.getDiamond < this.goodsInfo.current_do ||
            this.getDiamond == null
          ) {
            this.zsNotDialog = true; //金豆不足
          } else {
            this.exchangeComfirm = true;
          }
        }
      }
    },
    toCategoryList(category) {
      let randomItem = Math.floor(Math.random() * this.categoryList.length);
      let category_id = this.categoryList[randomItem].category_id;
      let title = this.categoryList[randomItem].title;

      this.cnzzTrackEvent(category);
      this.$router.push({
        path: "/game-malls-category",
        query: {
          id: category_id,
          title: title
        }
      });
    },
    toIndex() {
      this.$router.push("/");
      this.cnzzTrackEvent("商品详情页-兑换成功-去首页");
    },
    toAddress() {
      this.$router.push("/game-address");
    },
    hideZsDialog() {
      this.zsNotDialog = false;
      this.showTips = false;
    },
    urge() {
      this.goodsNotDialog = false;
      setTimeout(() => {
        this.$vux.toast.text("已催促补货", "bottom");
      }, 500);
    },
    exchange() {
      let params = new URLSearchParams();
      params.append("goods_id", this.goodsInfo.id);
      if (this.flag) return;
      this.flag = true;
      this.$ajax({
        method: "post",
        url: "/xd-shop/order",
        data: params
      })
        .then(res => {
          let status = res.data.status;
          this.exchangeComfirm = false;
          this.flag = false;
          if (status == "453") {
            //库存不足
            this.goodsNotDialog = true;
          } else if (status == "451" || status == "454") {
            //金豆不足
            this.zsNotDialog = true;
          } else {
            this.addressComfirm = false;
            this.zsYesDialog = true;
            this.goodsInfo.sku = this.goodsInfo.sku - 1;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
