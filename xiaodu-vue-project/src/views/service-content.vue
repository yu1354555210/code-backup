<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">客服中心</x-header>
        <div class="service-top-bg"><img src="../assets/img/service-top.png" alt=""></div>
        <div class="service-title"><img src="../assets/img/service-title.png" alt=""></div>
        <div class="service-list">
          <ul>
            <li>
              <span>1.</span>
              <p>长按识别二维码或微信搜索公众号“哪吒游戏”</p>
            </li>
            <li>
              <span>2.</span>
              <p>关注公众号，直接回复游戏问题</p>
            </li>
            <li>
              <span>3.</span>
              <p>客服会及时帮您解决问题并回馈</p>
            </li>
          </ul>
        </div>
        <div class="service-qrcode">
          <img :src="qrcode" alt="">
        </div>
    </div>
</template>

<script>
import { XHeader } from "vux";
export default {
  components: {
    XHeader
  },
  mounted() {
    this.qrcode = window.localStorage.getItem('qrcode');
  },
  data() {
    return {
      isSuccess: false,
      qrcode: ''
    };
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
</style>
