<template>
    <div class="wrapper">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
        <x-header :left-options="{backText: ''}">完善钱包</x-header>
        <!-- 余额 -->
        <div class="wallet-form">
          <div class="wallet-input">
            <input type="text" placeholder="请填写真实姓名" ref="realName" v-model="realName">
          </div>
          <div class="wallet-input">
            <input type="text" placeholder="微信提现授权">
            <button class="author-btn" @click="authorClick">点击授权</button>
            <div class="author-box">
              <div class="author-avatar">
                <img :src="authorImg"></img>
              </div>
              <div class="author-name" v-text="authorName"></div>
            </div>
          </div>
        </div>
        <button class="long-button" @click="comfirmSave">保存钱包信息</button>
        <div class="this-rule">
          <div class="title">提示</div>
          <ul>
            <li>微信账号必须为已实名，并绑定了银行卡，否则可能提现不成功;</li>
            <!-- <li>2.目前暂不支持更换授权，请确认您授权的微信号.</!--> -->
          </ul>
        </div>
      </mescroll-vue>
      <!-- 弹窗 -->
      <div class="popup-container" v-if="isShowPopup" @click.self="hidePopup">
        <div class="popup-wrapper">
          <div class="popup-close icon-close" @click="hidePopup"></div>
          <div class="popup-content">
            <strong v-text="popupTitle"></strong>
            <p v-text="popupInfo"></p>
          </div>
          <div class="popup-btn-box popup-btn-justify">
            <button class="small-btn popup-cancel-btn" @click="hidePopup">再看看</button>
            <button class="small-btn" @click="saveData">确认无误</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import { XButton, XHeader, XInput, Badge, Checker, CheckerItem, Group } from "vux";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import mobilePopup from "@/components/v-bind-mobile-popup.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    Group,
    XButton,
    XHeader,
    XInput,
    Badge,
    Checker,
    CheckerItem,
    mobilePopup,
    MescrollVue
  },
  mounted() {
    // 让app可以调用methods里的方法
    window.getAppInfo = (res) =>{
      this.getAppInfo(res)
    };
    this.$nextTick(function(){
      this.token = localStorage.getItem('token');
    })
  },
  data() {
    return {
      token: '',
      popupTitle: '钱包信息填写完成后不可修改',
      popupInfo: '请确保填写的正确性',
      openid: 'oOw4_6nymoZUJIFdyJZ6V2ORPk-E',
      realName: '',
      isShowPopup: false,
      authorName: '',
      authorImg: '',
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false,
        isBounce: false
      }
    };
  },
  computed:{
  },
  methods: {
    ...mapMutations(["switch_mobile_dialog"]),
    ...mapActions(["LoginInfo"]),
    authorClick(){
      this.$bridge.callhandler('appLogin', {}, (data) => {
        // 处理返回数据
        console.log(data)
      })
    },
    getAppInfo(data=''){
      // 获取app信息
      const resData = JSON.parse(data);
      this.token = resData.token;
      this.openid = resData.openid;
      let params = {
        token:  this.token,
        api_name: 'wxLoginCallback',
        gzh_openid: this.openid,
        nickname: resData.screen_name,
        headimgurl: resData.profile_image_url
      }

      this.$ajax({
        method: "post",
        url: "/api/hcashout/api",
        data: this.$qs.stringify(params)
      })
        .then(res => {
          console.log(res)
          let data = res.data;
          if(data.code == 1){
            this.authorImg = data.data.headimgurl;
            this.authorName = data.data.nickname;
          }else{
            this.$vux.toast.text(data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器请求失败，请稍后重试");
        });
    },
    hidePopup(){
      this.isShowPopup = false;
    },
    comfirmSave(){
      if (this.realName == '') {
        this.$vux.toast.text("请填写真实姓名");
        return;
      }
      if(this.authorName == '' || this.authorImg == ''){
        this.$vux.toast.text("请授权");
        return;
      }
      this.isShowPopup = true;
    },
    saveData(){
      //保存钱包信息
      let params = {
        token:  this.token,
        api_name: 'perfect_wallet',
        openid: this.openid,
        user_real_name: this.realName,
				package_name: localStorage.getItem('package_name')
      }

      this.$ajax({
        method: "post",
        url: "/api/hcashout/api",
        data: this.$qs.stringify(params)
      })
        .then(res => {
          console.log(res)
          let data = res.data;
          if(data.code == 1){
            this.$vux.toast.text('保存成功');
            setTimeout(() => {
              this.$router.push('/');
            }, 500);
          }else{
            this.$vux.toast.text(data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器请求失败，请稍后重试");
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.wallet-form
  padding 0 .25rem
  .wallet-input
    margin-top .25rem
    position relative
    input
      padding 0 .2rem
      width 100%
      border none
      display block
      font-size .28rem
      color #777777
      background-color #fafafa
      border-radius .1rem
      height .86rem
      line-height .86rem
    .author-btn
      width 1.2rem
      height .44rem
      font-size .22rem
      color #fe7c3a
      border-radius .22rem
      background-color #fff
      border 0.02rem solid #fe7c3a
      position absolute
      right .21rem
      top 50%
      transform translateY(-50%)
    .author-box
      position absolute
      left .2rem
      top 0
      z-index 66
      background-color #fafafa
      width 70%
      height 100%
      display flex
      align-items center
      .author-avatar
        width .68rem
        height .68rem
        margin-right .28rem
        overflow hidden
        border-radius 50%
      .author-name
        font-size .28rem
        color #333333
</style>
