<template>
    <div class="wrapper">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
        <x-header :left-options="{backText: ''}">提现</x-header>
        <div class="invite-cash-form">
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i></i>
              <span>微信绑定银行卡姓名</span>
            </div>
            <div class="invite-cash-input">
              <x-input v-model="name"></x-input>
            </div>
          </div>
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i></i>
              <span>提现到</span>
            </div>
            <div class="invite-cash-wechat-pay">
              <i class="icon-wechat"></i>
              <span>微信零钱</span>
            </div>
          </div>
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i></i>
              <span>请输入提现金额</span>
            </div>
            <div class="invite-cash-input">
              <x-input type="tel" name="" v-model.number="moneyNum" @input.native="oninput" placeholder="" id=""></x-input>
            </div>
            <div class="invite-cash-info">当前余额<span v-text="business.amount"></span>元</div>
          </div>
          <div class="invite-cash-item">
            <button class="invite-cash-button" @click="postCooperate">提现</button>
          </div>
        </div>
        <div class="invite-rule">
          <div class="invite-title invite-title-txxz"><img src="../assets/images/title-txxz.png" alt=""></div>
          <ul>
            <li>1、单笔提现不得小于10元</li>
            <li>2、单个账户每日提现总金额上限为5000元</li>
            <li>3、单个提现账户每笔提现金额上限为5000元</li>
            <li>4、每日提现笔数不得超过100笔</li>
            <li>5、如遇资金账户不足，请联系管理员或隔天提现</li>
          </ul>
        </div>
      </mescroll-vue>
      <!-- 绑定手机弹窗 -->
      <mobile-popup v-if="mobilePopup"></mobile-popup>
    </div>
</template>

<script>
import { XButton, XHeader, XInput } from "vux";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import mobilePopup from "@/components/v-bind-mobile-popup.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XButton,
    XHeader,
    XInput,
    mobilePopup,
    MescrollVue
  },
  mounted() {
    this.$nextTick(function(){
      this.getData();
    })
  },
  data() {
    return {
      name: '',
      moneyNum: '',
      business: '',
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
      ...mapState(["mobilePopup"]),
      ...mapGetters(["getLoginStatus","getUserInfo"]),
  },
  methods: {
    ...mapMutations(["switch_mobile_dialog"]),
    ...mapActions(["LoginInfo"]),
    oninput(e) {
        var that = this
        // 通过正则过滤小数点后两位
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        that.moneyNum = e.target.value;
    },
    postCooperate(){
        if(this.getUserInfo.is_bind_phone === 0){
            this.switch_mobile_dialog(true);
            return;
        }
        if(this.name == ''){
            this.$vux.toast.text("请填写真实姓名");
            return;
        }
        if(this.moneyNum == ''){
            this.$vux.toast.text("请填写提现金额");
            return;
        }
        if(parseFloat(this.moneyNum) > 5000 || this.moneyNum == ''){
            this.$vux.toast.text("提现金额不允许大于5000");
            return;
        }
        if(parseFloat(this.moneyNum) < 10){
            this.$vux.toast.text("提现金额不允许小于10");
            return;
        }
        this.$vux.loading.show({
            text: '请求中...'
        })
        this.$ajax
          .get("/xdcoop/rebate/save",{
              params:{
                  amount: this.moneyNum,
                  uname: this.name
              }
          })
          .then(response => {
            let data = response.data.data;
            setTimeout(() => {
                this.$vux.loading.hide()
            }, 800)
            if(response.data.code != 1){
                setTimeout(() => {
                    this.$vux.toast.text(response.data.msg);
                }, 1000)
                this.moneyNum = '';
                return;
            }else{
                setTimeout(() => {
                    this.$vux.toast.text("提现成功");
                    this.isCooperate = false;
                    this.moneyNum = '';
                    this.getData();
                    this.LoginInfo();
                }, 1000)
            }
          })
          .catch(error => {
            setTimeout(() => {
                this.$vux.loading.hide()
            }, 800)
            setTimeout(() => {
                console.log(error)
                this.$vux.toast.text("服务器错误，请稍后重试");
            }, 1000)
          });
    },
    getData(){
      this.$ajax
        .get("/xdcoop/business/index")
        .then(response => {

          if (response.data.code == 403) {
              window.location.href = this.toUrl;
              return;
          }
          var msg = response.data.msg;
          if(msg == "请注册商户"){
              this.$router.push('/');
              return;
          }
          if (response.data.code != 1) {
            this.$vux.toast.text(msg);
            return;
          }else{
              let data = response.data.data;
              this.business = data.business;
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器错误，请稍后重试");
        });

        if(!this.getUserInfo){
          this.LoginInfo();
        }else{
          this.name = this.getUserInfo.real_name || '';
        }
    },
  }
};
</script>

<style lang="stylus" scoped>
.wrapper
  background-color #fff
.invite-cash-form
  padding 0 .25rem
  .invite-cash-item
    margin-bottom .3rem
    .invite-cash-title
        height .68rem
        display flex
        align-items center
        i
          width .07rem
          height .26rem
          background-color #429afd
          border-radius .03rem
          margin-right .12rem
        span
          font-size .3rem
          color #454553
    .invite-cash-input
      padding 0 .2rem
      font-size .36rem
      color #777777
      background-color #fafafa
      border-radius .1rem
      .vux-x-input
        padding 0
      >>>.weui-input
        height .86rem
        line-height .86rem
    .invite-cash-wechat-pay
      margin-top .1rem
      display flex
      align-items center
      .icon-wechat
        width .48rem
        height .44rem
        background-image url(../assets/images/icon-wechat-pay.png)
        background-size 100% 100%
        margin-right .15rem
        display inline-block
        vertical-align middle
      span
        color #5a6a78
        font-size .3rem
        display inline-block
        vertical-align middle
    .invite-cash-info
      font-size .24rem
      color #8e8e8e
      span
        color #f32a2a
        margin-left .1rem
    .invite-cash-button
      background-color #7395ec
      color #fff
      font-size .28rem
      width 100%
      height .86rem
      border none
      border-radius .1rem
      display block
      &:active
        background-color #6986bd
.invite-rule
  margin .75rem 0
  padding 0 .6rem
  ul
    padding-top .2rem
    li
      line-height .45rem
      font-size .24rem
      color #959595
</style>
