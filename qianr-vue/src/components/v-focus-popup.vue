<template>
  <!-- <div class="this-winpop-container" @click.self="switch_focus_dialog(false)">
    <div class="this-qrcode-winpop">
      <div class="this-qrcode-img">
        <img src="../assets/img/xd-qrcode.png" alt="">
      </div>
      <div class="this-qrcode-text">搜索关注公众号“手游宝盒H5”</div>
      <div class="this-qrcode-btn copy-btn" data-clipboard-text="手游宝盒H5">
        <img src="../assets/img/qrcode-popup-btn.png" alt="">
      </div>
      <div class="this-qrcode-close" @click="switch_focus_dialog(false)"></div>
    </div>
  </div> -->
  <div class="this-form-container" @click.self="switch_focus_dialog(false)">
    <div class="this-form-wrap">
      <div class="this-form-focus-title">关注<span>手游宝盒H5</span>玩游戏超多返利</div>
      <div class="this-form-focus-qrcode">
        <img src="../assets/img/wechat-qrcode.jpg" alt="">
      </div>
      <div class="this-form-info">长按识别二维码关注</div>
      <div class="this-form-btn-box">
        <x-button type="primary" class="this-form-btn radius copy-btn" data-clipboard-text="手游宝盒H5">复制名称去关注</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, XHeader, XInput, Icon } from "vux";
import { mapMutations, mapState } from "vuex";
import Clipboard from "clipboard";
export default {
  components: {
    XButton,
    XHeader,
    XInput,
    Icon
  },
  methods: {
    ...mapMutations(["switch_focus_dialog"])
  },
  mounted() {
    var clipboard = new Clipboard(".copy-btn");
    clipboard.on("success", e => {
      this.$vux.toast.text("复制成功");
    });
  }
};
</script>

<style lang="less" scoped>
.this-form-btn-box{
  margin-bottom: .2rem !important;
}
</style>
