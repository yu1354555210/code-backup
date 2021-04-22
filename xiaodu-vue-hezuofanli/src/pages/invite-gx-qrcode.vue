<template>
<div class="poster">
    <div class="tips">长按图片，发送给朋友或保存图片发朋友圈</div>
    <div class="wrapper" ref="addImage">
      <div ref="capture" v-if="isDom" style="height:100%">
        <!-- <div class="game-bg" :style="{backgroundImage:'url('+$route.query.logo+')'}"></div> -->
        <div class="game-bg"><img :src="$route.query.logo" alt=""></div>
        <div class="share-game-bg"><img src="../assets/images/share-gx-bg.png" alt=""></div>
        <div class="main">
          <div class="avatar"><img :src="$route.query.avatar" alt="" crossOrigin="anonymous"></div>
          <div class="info">我发现了一款十分好玩的游戏<br>来玩就送VIP福利</div>
          <div class="qrcode">
            <qrcode :value="$route.query.link" type="img"></qrcode>
          </div>
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
  data() {
    return {
      isDom: true,
      dataURL: ''
    };
  },
  computed:{
    ...mapGetters(["getUserInfo"])
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
  .share-game-bg
    width 100%
    height 100%
    top 0
    position absolute
  .avatar
    width 1rem
    height 1rem
    position absolute
    top 1.5rem
    left 2.5rem
    img
      border-radius 50%
      height 100%
  .info
    width 3.2rem
    color #fff
    font-size .2rem
    text-align center
    position absolute
    top 2.84rem
    left 50%
    transform translateX(-50%)
  .qrcode
    width 2.5rem
    height 2.5rem
    position absolute
    top 5.15rem
    left 1.75rem
    &>>>img
      width 100% !important
      height 100% !important
  .game-bg
    width 100%
    height 100%
    background-position center top
    background-size contain
    background-repeat no-repeat
    img 
      object-fit cover
  .img
    height 100%
    object-fit contain
</style>
