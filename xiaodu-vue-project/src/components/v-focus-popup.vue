<template>
  <div class="this-winpop-container" @click.self="switch_focus_dialog(false)">
    <div class="this-qrcode-winpop">
      <div class="this-qrcode-img">
        <img src="../assets/img/xd-qrcode.png" alt="">
      </div>
      <div class="this-qrcode-text">
        搜索关注公众号“哪吒游戏”
      </div>
      <div class="this-qrcode-btn copy-btn" data-clipboard-text="哪吒游戏">
        <img src="../assets/img/qrcode-popup-btn.png" alt="">
      </div>
      <div class="this-qrcode-close" @click="switch_focus_dialog(false)"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Clipboard from "clipboard";
export default {
  methods: {
    ...mapMutations(["switch_focus_dialog"])
  },
  mounted(){
    var clipboard = new Clipboard(".copy-btn");
    clipboard.on("success", e => {
      this.$vux.toast.text("复制成功");
    });
  }
};
</script>

<style>
</style>
