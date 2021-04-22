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
    width 6rem
    padding 0.6rem 0.3rem
    background-color #FFFFFF
    border-radius 0.08rem
    overflow hidden
    position absolute
    border-top 0.14rem solid #fad85d
    left 50%
    top 50%
    transform translate(-50%, -50%)
    h2
      font-size 0.4rem
      margin-bottom 0.2rem
    .btn
      width 80%
      margin 0 auto
      color #515151 !important
    .gift-popup
      text-align center
      color #5c5c5c
      .dec
        font-size 0.2rem
        line-height 0.48rem
        margin-top 0.2rem
        margin-bottom 0.2rem
      .cdk
        display flex
        align-items center
        justify-content center
        p
          padding 0.05rem 0.2rem
          min-width 3rem
          background-color #EEEEEE
          margin-left 0.1rem
          border-radius 200px
    .pay-gift-popup
      text-align center
      .dec
        text-align left
        font-size 0.26rem
        line-height 0.48rem
        margin 0.3rem 0
      .price
        display flex
        width 3.5rem
        height 0.55rem
        border-radius 200px
        overflow hidden
        margin 0 auto 0.5rem
        background-color #f0f0f0
        label, span
          flex 0 0 50%
          display flex
          align-items center
          justify-content center
          height 100%
          font-size 0.32rem
        label
          background-color #b9b9b9
          color #FFFFFF
        span
          color #f07878
</style>
