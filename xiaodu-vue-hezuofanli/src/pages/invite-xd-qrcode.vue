<template>
  <div class="poster">
    <div class="tips">长按图片，发送给朋友或保存图片发朋友圈</div>
    <div class="wrapper" ref="addImage">
      <div ref="capture" v-if="isDom">
        <div class="game-bg"><img src="../assets/images/share-xd-bg.jpg" alt=""></div>
        <div class="avatar"><img :src="$route.query.avatar"  crossOrigin="anonymous" alt=""></div>
        <div class="qrcode">
          <!-- <img src="../assets/images/xd-qrcode.png" alt=""> -->
          <qrcode :value="$route.query.link" type="img"></qrcode>
        </div>
      </div>
      <img :src="dataURL" v-else class="img">
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { Qrcode } from 'vux'
import { mapState, mapGetters, mapMutations } from "vuex"
export default {
  mounted() {
    this.$nextTick(function(){
      this.generatorImage();
    })
  },
  components:{
    Qrcode
  },
  computed:{
    ...mapGetters(["getUserInfo"])
  },
  data() {
    return {
      isDom: true,
      dataURL: ''
    };
  },
  methods: {
    generatorImage () {
      this.$vux.loading.show({
          text: '图片生成中...'
      })
      if(this.getUserInfo){
        setTimeout(() => {
          html2canvas(this.$refs.capture,{
            useCORS:true, //允许图片跨域
            logging: false, //打印日志
            backgroundColor: null //去掉图片白边
            }).then(canvas => { 
                this.$refs.addImage.append(canvas);  
                this.dataURL = canvas.toDataURL("image/png");
                this.isDom = false;
                canvas.remove();
                this.$vux.loading.hide();
            })
        }, 2000);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.poster
  padding .4rem .75rem
  height 100%
  background-color #000
  text-align center
  overflow hidden
  .tips
    margin-bottom .2rem
    color #fff
    font-size .28rem
.wrapper
  width 100%
  height calc(100% - 0.5rem)
  overflow hidden
  position relative
  .avatar
    width .68rem
    height .68rem
    position absolute
    top 2.23rem
    left 0.8rem
    img
      border-radius 50%
      height 100%
  .qrcode
    width 2rem
    height 2rem
    position absolute
    top 6.8rem
    left 1.95rem
    &>>>img
      width 100% !important
      height 100% !important
  .game-bg
    width 100%
    height 100%
    img 
      object-fit cover
  .img
    height 100%
    object-fit contain
</style>
