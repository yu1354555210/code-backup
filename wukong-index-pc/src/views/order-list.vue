<template>
  <div>
    <section class="service-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/service' }">藏宝阁</el-breadcrumb-item>
          <el-breadcrumb-item>我的订单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <layout-login>
        <div class="order-tab-list">
          <ul>
          	<li>
              <el-button class="order-tab" :class="tabIndex == 0 ? 'cur' : ''" @click="toggleTab(0)"><i class="icon-goods"></i>道具订单</el-button>
            </li>
            <li>
              <el-button class="order-tab" :class="tabIndex == 1 ? 'cur' : ''" @click="toggleTab(1)"><i class="icon-gift"></i>实物订单</el-button>
            </li>
          </ul>
        </div>
      </layout-login>
      <div class="service-main this-section">
        <div class="order-list" v-if="tabIndex == 0">
          <div class="order-item" v-for="(item,index) in giftOrderList" :key="index">
            <div class="order-th">
              <ul>
                <li><b v-text="item.create_time"></b><span>订单号：{{item.id}}</span></li>
                <li>价格</li>
                <li>状态</li>
              </ul>
            </div>
            <div class="order-tr">
              <ul>
              	<li><img :src="item.attach" alt="">{{item.product_name}}</li>
                <li>
                  <a href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed" target="_blank">联系客服<i class="icon-concat"></i></a>
                </li>
                <li>￥{{item.amount}}</li>
                <li class="order-status order-status-no flex-v" v-if="item.pay_status == 0">未支付</li>
                <li class="order-status order-status-success flex-v" v-if="item.pay_status == 1">交易完成</li>
                <!-- <li class="order-status flex-v">
                  <p>asdasd</p>
                  <el-link type="primary">复制订单号</el-link>
                </li> -->
              </ul>
            </div>
          </div>
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change="handleGiftChange"
              :hide-on-single-page="true"
              :current-page="giftPage"
              :total="giftTotal">
            </el-pagination>
          </div>
        </div>
        <div class="order-list" v-if="tabIndex == 1">
          <div class="order-item" v-for="(item,index) in goodsOrderList" :key="index">
            <div class="order-th">
              <ul>
                <li><b v-text="item.create_time"></b><span>订单号：{{item.id}}</span></li>
                <li>价格</li>
                <li>状态</li>
              </ul>
            </div>
            <div class="order-tr">
              <ul>
              	<li><img :src="item.goods_logo" alt="">{{item.goods_name}}</li>
                <li>
                  <a href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed" target="_blank">联系客服<i class="icon-concat"></i></a>
                </li>
                <li>￥{{item.price}}</li>
                <li class="order-status" v-if="item.status == 10">交易取消</li>
                <li class="order-status" v-if="item.status == 20">未支付</li>
                <li class="order-status" v-if="item.status == 30">等待发货</li>
                <li class="order-status flex-v" v-if="item.status == 40">
                  <p v-text="item.plat_tid"></p>
                  <el-link type="primary" @click="doCopy(item.plat_tid)">复制快递单号</el-link>
                </li>
                <!-- <li class="order-status flex-v">
                  <p>asdasd</p>
                  <el-link type="primary">复制订单号</el-link>
                </li> -->
              </ul>
            </div>
          </div>
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :hide-on-single-page="true"
              @current-change="handleGoodsChange"
              :current-page="goodsPage"
              :total="goodsTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import layoutLogin from '@/components/layout-login.vue';
export default {
  data() {
    return {
      tabIndex: 0,
      giftOrderList: [],
      goodsOrderList: [],
      page: 1,
      giftPage: 1,
      giftTotal: 10,
      goodsPage: 1,
      goodsTotal: 10
    };
  },
  components:{
    layoutLogin
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken'])
  },
  mounted() {
    this.$nextTick(function() {
      this.getGiftData();
    });
  },
  methods: {
    ...mapMutations(['removeLogin', 'removeUserInfo', 'removeGameUnit', 'setGameUnit']),
    doCopy(msg) {
      let that = this;
      this.$copyText(msg).then(function (e) {
        that.$vux.toast.text('复制成功');
      }, function (e) {
        that.$vux.toast.text('复制失败,请手动复制');
      })
    },
    handleGiftChange(currentPage){
      this.giftPage = currentPage;
      this.getGiftData();
    },
    handleGoodsChange(currentPage){
      this.goodsPage = currentPage;
      this.getGoodsData();
    },
    toggleTab(index){
      this.tabIndex = index;
      if(index == 1){
        this.getGoodsData();
      }
    },
    getGiftData(){
      this.$ajax
        .get('/trade/list', {
          params: {
            token: this.getToken,
            page: this.giftPage
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.giftOrderList = data.datas;
            this.giftTotal = Number(data.total);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getGoodsData(){
      this.$ajax
        .get('/shop/order-list', {
          params: {
            token: this.getToken,
            page: this.goodsPage
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.goodsOrderList = data.datas;
            this.goodsTotal = Number(data.total);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="stylus">

</style>
