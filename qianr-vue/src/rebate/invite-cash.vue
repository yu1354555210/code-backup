<template>
    <div class="wrapper">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
        <x-header :left-options="{backText: ''}">提现</x-header>
        <div class="invite-cash-form">
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i class="cash-icon1"></i>
              <span>微信绑定银行卡姓名</span>
            </div>
            <div class="invite-cash-input">
              <x-input v-model="name"></x-input>
            </div>
          </div>
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i class="cash-icon2"></i>
              <span>提现到</span>
            </div>
            <div class="invite-cash-wechat-pay">
              <i class="icon-wechat"></i>
              <span>微信零钱</span>
            </div>
          </div>
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i class="cash-icon3"></i>
              <span>请输入提现金额</span>
            </div>
            <div class="invite-cash-input">
              <x-input type="tel" name="" v-model.number="moneyNum" @input.native="oninput" placeholder="" id=""></x-input>
            </div>
            <div class="invite-cash-info">当前余额<span v-text="business.amount"></span>元</div>
          </div>
          <div class="invite-cash-item">
            <button class="invite-cash-button radius" @click="postCooperate">提现</button>
          </div>
        </div>
        <div class="invite-rule">
          <div class="invite-cash-title" style="margin-left: -0.3rem">
            <i class="cash-icon4"></i>
            <span>提现须知</span>
          </div>
          <ul>
            <li>
              <i>1</i>
              <span>单笔提现不得小于10元</span>
            </li>
            <li>
              <i>2</i>
              <span>单个账户每日提现总金额上限为5000元</span>
            </li>
            <li>
              <i>3</i>
              <span>单个提现账户每笔提现金额上限为5000元</span>
            </li>
            <li>
              <i>4</i>
              <span>每日提现笔数不得超过100笔</span>
            </li>
            <li>
              <i>5</i>
              <span>如遇资金账户不足，请联系管理员或隔天提现</span>
            </li>
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
                    this.moneyNum = '';
                    this.LoginInfo();
                    this.getData();
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
.invite-cash-title
    height .68rem
    display flex
    align-items center
    i
      background-size 100% 100%
      margin-right .12rem
      &.cash-icon1
        width .45rem
        height .30rem
        background-image url(../assets/images/cash-icon1.png)
      &.cash-icon2
        width .46rem
        height .33rem
        background-image url(../assets/images/cash-icon2.png)
      &.cash-icon3
        width .45rem
        height .33rem
        background-image url(../assets/images/cash-icon3.png)
      &.cash-icon4
        width .35rem
        height .44rem
        background-image url(../assets/images/cash-icon4.png)
    span
      font-size .3rem
      color #454553
.invite-cash-form
  padding 0 .25rem
  .invite-cash-item
    margin-bottom .3rem
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
        margin-left .15rem
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
      background-color #eb636d
      color #fff
      font-size .28rem
      width 100%
      height .86rem
      border none
      border-radius .1rem
      display block
      &:active
        background-color #d15962
.invite-rule
  margin .75rem 0
  padding 0 .6rem
  ul
    padding-top .2rem
    li 
      font-size 0.24rem
      color #959595
      line-height 0.38rem
      margin-bottom 0.2rem
      display flex
      i 
        margin-right 0.08rem
        display inline-block
        text-align center
        background #fdd717
        color #fff
        font-size 12px
        flex 0 0 16px
        height 16px
        line-height 16px
        border-radius 8px
        background-clip padding-box
        vertical-align middle
      span,i
        display inline-block
        vertical-align middle
</style>
