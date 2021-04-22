<template>
  <!--领取礼包弹窗-->
  <div class="this-winpop-container" id="giftWinpop" @click.self="switch_gift_dialog(false)">
      <div class="user_winpop user_code">
          <h4 id="ballLblqTitle"><span>我的礼包</span></h4>
          <a href="javascript:;" target="_self" class="winpop_close" @click="switch_gift_dialog(false)"></a>
          <div class="user_code_main">
              <div class="cody_code_box">
                  <label class="label_name">兑换码:</label>
                  <div class="user_code_txt" id="ballLblqCode">{{giftCode}}</div>
              </div>
              <div class="user_code_way">
                  <p id="libao_usage">{{giftDec}}</p>
              </div>
              <div class="user_code_btn">
                  <a href="javascript:;" class="copy copy-btn copy_gift_code" :data-clipboard-text="giftCode">复制</a>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
    };
  },
  props: {
    giftCode: [String, Number],
    giftDec: String
  },
  methods: {
    ...mapMutations(['switch_gift_dialog'])
  },
  mounted() {
    var clipboard = new Clipboard(".copy-btn");
    clipboard.on("success", e => {
      this.$vux.toast.text("复制成功");
    });
  }
};
</script>

<style>
</style>
