<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">奖品详情</x-header>
        <section class="section">
        <div class="my-orders-list">
          <div class="my-orders-item orders-detail-item this-box">
            <div class="my-orders-main">
              <div class="my-orders-image">
                <img :src="dataList.goods_logo" alt="">
              </div>
              <p v-text="dataList.goods_title"></p>
            </div>
            <div class="my-orders-info-list">
              <ul>
                <li>
                  <label>订单状态：</label>
                  <span v-if="dataList.status == 40">待发货</span>
                  <span v-if="dataList.status == 50" class="orders-status-blue">已发货</span>
                  <span v-if="dataList.status == 80" class="orders-status-green">已收货</span>
                  <span v-if="dataList.status == 20" class="orders-status-red">异常订单</span>
                </li>
                <li>
                  <label>订单号：</label>
                  <span v-text="dataList.order_no"></span>
                </li>
                <li>
                  <label>兑换时间：</label>
                  <span v-text="dataList.create_time"></span>
                </li>
                <li>
                  <label>发货时间：</label>
                  <span v-text="dataList.send_time==null?'----':dataList.send_time">----</span>
                </li>
              </ul>
            </div>
            <div class="my-orders-address" v-if="dataList.address_name">
              <dl>
                <dt>
                  <span v-text="dataList.address_name"></span>
                  <span v-text="dataList.address_mobile"></span>
                </dt>
                <dd v-text="dataList.address_info"></dd>
              </dl>
            </div>
            <div class="my-orders-footer">
              <dl>
                <dt>兑换金豆</dt>
                <dd>
                  <span class="icon-gold"></span>
                  <span class="my-diamond-num" v-text="dataList.current_do"></span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
import { XButton, XHeader } from "vux";
export default {
  components: {
    XButton,
    XHeader
  },
  created() {
  },
  mounted() {
    this.$nextTick(function() {
      this.id = this.$route.query.id;
      this.$ajax
        .get("xd-shop/get-order", {
          params: {
            id: this.id, // 页码
          }
        })
        .then(response => {
          this.dataList = response.data.data;
        })
        .catch(e => {
        });
    });
  },
  computed: {
  },
  methods: {
    
  },
  data() {
    return {
      dataList: [],
      id: undefined
    };
  }
};
</script>

<style scoped>
</style>
