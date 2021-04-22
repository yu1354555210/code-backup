<template>
  <!--领取礼包弹窗-->
  <div class="this-winpop-container" @click.self="switch_dialog(false)">
    <div class="this-winpop-wrapper"><slot></slot></div>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {};
  },
  props: {
    giftCode: [String, Number],
    giftDec: String
  },
  methods: {
    ...mapMutations(['switch_dialog'])
  },
  mounted() {
    var clipboard = new Clipboard('.copy-btn');
    clipboard.on('success', e => {
      this.$vux.toast.text('复制成功');
    });
  }
};
</script>

<style lang="stylus">
.this-winpop-container
  width 100%
  height 100%
  position fixed
  left 0
  top 0
  background-color rgba(0, 0, 0, 0.5)
  z-index 66
  .this-winpop-wrapper
    width 600px
    padding 60px 30px
    background-color #FFFFFF
    border-radius 8px
    overflow hidden
    position absolute
    border-top 0.14rem solid #fad85d
    left 50%
    top 50%
    transform translate(-50%, -50%)
    h2
      font-size 40px
      margin-bottom 20px
    .btn
      width 80%
      margin 0 auto
      color #515151 !important
    .gift-popup
      text-align center
      color #5c5c5c
      .dec
        font-size 20px
        line-height 48px
        margin-top 20px
        margin-bottom 20px
      .cdk
        display flex
        align-items center
        justify-content center
        p
          padding 5px 20px
          min-width 300px
          background-color #EEEEEE
          margin-left 10px
          border-radius 200px
    .pay-gift-popup
      text-align center
      .dec
        text-align left
        font-size 26px
        line-height 48px
        margin 30px 0
      .price
        display flex
        width 350px
        height 55px
        border-radius 200px
        overflow hidden
        margin 0 auto 50px
        background-color #f0f0f0
        label, span
          flex 0 0 50%
          display flex
          align-items center
          justify-content center
          height 100%
          font-size 32px
        label
          background-color #b9b9b9
          color #FFFFFF
        span
          color #f07878
</style>
