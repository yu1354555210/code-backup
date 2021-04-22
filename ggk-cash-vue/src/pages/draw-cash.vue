<template>
    <div class="wrapper">
      <div class="public-header">
        <div class="close-arrow" @click="confirmDialog = true"></div>
        <h1 class="public-header-title">我要提现</h1>
        <router-link to="/cash-record" class="public-header-right">提现记录</router-link>
      </div>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
        <!-- 余额 -->
        <dl class="cash-balance">
          <dt>{{ money | numFilter }}</dt>
          <dd>帐号余额(元)</dd>
        </dl>
        <div class="invite-cash-form">
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i></i>
              <strong>
                提现方式
                <div>
                  <span>提现到：{{nickName}}</span>
                  <!-- <router-link to="/wallet">去完善</router-link> -->
                </div>
              </strong>
            </div>
            <div class="draw-cash-mode">
              <div class="cash-wechat-pay">
                <i class="icon-wechat"></i>
                <span>提现至微信</span>
              </div>
              <div class="icon-checkbox"></div>
            </div>
          </div>
          <div class="invite-cash-item" v-if="isNewPerson">
            <div class="invite-cash-title">
              <i></i>
              <strong>新用户专属</strong>
            </div>
            <checker
            v-model="newPersonVal"
            default-item-class="select-item select-new-person"
            selected-item-class="select-item-selected"
            :radio-required="true"
            >
              <checker-item v-for="(item, index) in newPersonList" :key="index" :value="index" @on-item-click="onItemClick(1,item.money)">
                <button class="select-tag" v-text="item.title1"></button>
                {{item.money / 100}}元
              </checker-item>
            </checker>
          </div>
          <div class="invite-cash-item">
            <div class="invite-cash-title">
              <i></i>
              <strong>提现金额</strong>
            </div>
            <checker
            v-model="cashVal"
            default-item-class="select-item"
            selected-item-class="select-item-selected"
            :radio-required="true"
            >
              <checker-item v-for="(item, index) in moneyList" :key="index" :value="index" @on-item-click="onItemClick(2,item.money)">
                {{item.money / 100}}元
              </checker-item>
            </checker>
          </div>
        </div>
        <div class="this-rule">
          <div class="title">注意事项</div>
          <ul>
            <li>1.提现申请标记秒到账的金额可实时到账，其余金额将在1-3个工作日内审批到账，请耐心等待;</li>
            <li>2.提现进度可在我的->提现->提现记录中查询;</li>
            <li>3.如有违规操作等行为，稳兼职有权终止提现或冻结账号;</li>
            <li>4.新用户专属提现，只针对当天，过期后该提现金额消失.</li>
          </ul>
        </div>
        <button class="long-button" @click="cash">立即提现</button>
      </mescroll-vue>

      <!--底部导航-->
			<div class="tabbar">
				<a href="../ggk/ggk-list.html">
					<img src="../../static/images/tabbar-card.png"/>
					<p>刮刮卡</p>
				</a>
				<a href="../lottery/lottery.html">
					<img src="../../static/images/tabbar-gift.png"/>
					<p>抽奖</p>
				</a>
				<a href="../invite/index.html">
					<img src="../../static/images/tabbar-invite.png"/>
					<p>邀请</p>
				</a>
				<a href="javascript:;" class="tabbar-cur">
					<img src="../../static/images/tabbar-cash-cur.png"/>
					<p>提现</p>
				</a>
			</div>

      <!-- 弹窗 -->
      <div class="popup-container" v-if="isShowPopup" @click.self="hidePopup">
        <div class="popup-wrapper">
          <div class="popup-close icon-close" @click="hidePopup"></div>
          <div class="popup-content">
            <strong v-text="popupTitle"></strong>
            <p v-text="popupInfo"></p>
          </div>
          <div class="popup-btn-box">
            <button class="small-btn" @click="hidePopup" v-text="popupBtnText" v-if="isCloseBtn"></button>
            <button class="small-btn" @click="toWallet" v-text="popupBtnText" v-if="isToWallet"></button>
            <button class="small-btn" @click="toPhone" v-text="popupBtnText" v-if="isToPhone"></button>
            <button class="small-btn" @click="toGgk" v-text="popupBtnText" v-if="isToGgk"></button>
          </div>
        </div>
      </div>

      <!--退出弹窗-->
      <transition name="fade">
        <div class="dialog-container" v-if="confirmDialog" @click.self="confirmDialog = false">
          <div class="dialog-wrapper dialog-exit dialog-close-webview">
            <dl>
              <dt>是否关闭并退出</dt>
            </dl>
            <div class="dialog-btn-box">
              <button class="dialog-btn dialog-cancel-btn" @click="confirmDialog = false">取消</button>
              <button class="dialog-btn" @click="closeWebview">关闭</button>
            </div>
          </div>
        </div>
      </transition>
			
    </div>
</template>

<script>
import { XButton, XHeader, XInput, Badge, Checker, CheckerItem } from "vux";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import mobilePopup from "@/components/v-bind-mobile-popup.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
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
    this.$nextTick(function(){
      // localStorage.setItem('token','2feafd9a8f5dd8f6d240614a8160f7d0');
      // localStorage.setItem('package_name','www.abc.com');
      this.token = localStorage.getItem('token');
      this.getInitData();
    })
  },
  data() {
    return {
      confirmDialog: false,
      lock: false,
      nickName: '',
      token: "",
      money: 0,
      isWallet: false,
      isNewPerson: false,
      selectMoney: 0,
      newPersonList: '',
      newPersonVal: -1,
      moneyList: '',
      cashVal: -1,
      name: '',
      moneyNum: '',
      business: '',
      isShowPopup: false,
      popupTitle: '',
      popupInfo: '',
      popupBtnText: '好的',
      isCloseBtn: false,
      isToWallet: false,
      isToPhone: false,
      isToGgk: false,
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
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后三位
      let tempVal = parseFloat(value / 100).toFixed(3)
      let realVal = tempVal.substring(0, tempVal.length - 1)
      return realVal
    }
  },
  methods: {
    ...mapMutations(["setToken"]),
    closeWebview(){
      this.$bridge.callhandler('closeWebview', {}, (data) => {
        // 处理返回数据
        console.log(data)
      })
    },
    getInitData(){
      let params = {
        token:  this.token,
        api_name: 'user_balance',
        package_name: localStorage.getItem('package_name')
      }
      this.$ajax({
        method: "post",
        url: "/api/hcashout/api",
        data: this.$qs.stringify(params)
      })
        .then(res => {
          let data = res.data;
          /**
            uid 用户id
            money 余额
            is_perfect_wallet 是否已完善钱包 1：已完善 0：未完善
            is_ggk_num_enough 是否已刮满50张卡 1：已刮满 0：未刮满
            already_ggk_num 已经刮了的数量
            total_ggk_num 总共需要刮满的数量
          **/
          if(data.code == 1){
            this.money = data.data.money;
            this.nickName = data.data.user_nicename;
            // if(data.data.is_perfect_wallet == 1){
            //   this.isWallet = true;
            // }
            if(data.data.is_show == 1){
              this.isNewPerson = true;
              this.getNewPersonData();
            }
            this.getMoneyData();
          }else{
            this.$vux.toast.text(data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器请求失败，请稍后重试");
        });
    },
    getMoneyData(){
      //获取提现金额
      let params = {
        token:  this.token,
        api_name: 'case_out_list',
      }
      this.$ajax({
        method: "post",
        url: "/api/hcashout/api",
        data: this.$qs.stringify(params)
      })
        .then(res => {
          let data = res.data;
          if(data.code == 1){
            this.moneyList = data.data;
            if(this.isNewPerson != true){
              this.selectMoney = this.moneyList[0].money;
              this.cashVal = 0;
            }
          }else{
            this.$vux.toast.text(data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器请求失败，请稍后重试");
        });
    },
    getNewPersonData(){
      //获取新用户专属提现金额
      let params = {
        token:  this.token,
        api_name: 'newer_case_out_list',
      }
      this.$ajax({
        method: "post",
        url: "/api/hcashout/api",
        data: this.$qs.stringify(params)
      })
        .then(res => {
          let data = res.data;
          if(data.code == 1){
            this.newPersonList = data.data;
            this.selectMoney = this.newPersonList[0].money;
            this.newPersonVal = 0;
          }else{
            this.$vux.toast.text(data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器请求失败，请稍后重试");
        });
    },
    onItemClick (index,money) {
      this.selectMoney = money;
      if(index == 1){
        this.cashVal = -1;
      }else if(index == 2){
        this.newPersonVal = -1;
      }
    },
    hidePopup(){
      this.isShowPopup = false;
    },
    ShowPopup(title,type,info="",btnText='好的'){
      this.isShowPopup = true;
      this.isCloseBtn = false;
      this.isToWallet = false;
      this.isToPhone = false;
      this.isToGgk = false;
      this.popupTitle = title;
      this.popupInfo = info;
      switch (type) {
        case '关闭':
          this.isCloseBtn = true;
          break;
        case '完善':
          this.isToWallet = true;
          btnText = '去完善';
          break;
        case '绑定':
          this.isToPhone = true;
          btnText = '去绑定';
          break;
        case '刮刮卡':
          this.isToGgk = true;
          btnText = '去刮卡';
          break;
        default:
          break;
      }
      this.popupBtnText = btnText;
    },
    cash(){
      if(this.lock) return false;
      this.lock = true;
      let apiName = 'immediately_money';
      let plat = 1;
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      if(isAndroid){
          plat = 2;
      }

      if(this.newPersonVal != -1 && this.cashVal == -1){
        apiName = 'userWithdrawals';
      }

      let params = {
        token:  this.token,
        api_name: apiName,
        select_money: this.selectMoney,
        user_money: this.money,
        package_name: localStorage.getItem('package_name'),
        plat: plat
      }
      this.$ajax({
        method: "post",
        url: "/api/hcashout/api",
        data: this.$qs.stringify(params)
      })
        .then(res => {
          let data = res.data;
          this.lock = false;
          if(data.code == 1){
            // this.$vux.toast.text(data.msg);
            this.ShowPopup(data.data.title1,'关闭',data.data.title2);
            this.getInitData();
          }else{
            console.log(data.code)
            switch (data.code) {
              case '-1':
                this.ShowPopup(data.msg,'关闭');
                break;
              case '-2':
                this.ShowPopup(data.msg,'完善');
                break;
              case '-3':
                this.ShowPopup(data.msg,'绑定');
                break;
              case '-4':
                console.log('去刮卡')
                this.ShowPopup(data.msg,'刮刮卡');
                break;
            
              default:
                break;
            }
            // this.$vux.toast.text(data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器请求失败，请稍后重试");
        });

    },
    toWallet(){
      //前往钱包完善信息
      // this.ShowPopup('您尚未完善钱包信息','完善','去完善');
      this.$route.push('/wallet');
    },
    toPhone(){
      //前往绑定手机
      // this.ShowPopup('您尚未绑定手机','绑定','请绑定后提现','去绑定');
      this.$router.push('/bind-phone');
    },
    toGgk(){
      // 前往刮刮卡
      // this.ShowPopup('新人专属金额','刮刮卡','需刮10张刮刮卡提现','去刮卡');
      // console.log('去刮卡')
      window.location.href = "../ggk/ggk-list.html";
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper
  padding-bottom 1rem
  margin-top .8rem
.mescroll
  background-color #fff
  background url(../assets/images/tx-bg.png) no-repeat
  background-size 100% 3.97rem
  background-attachment local
  .long-button
    margin-bottom 1.3rem
.cash-balance
  color #fff
  text-align center
  height 1.7rem
  display flex
  justify-content center
  align-items center
  flex-direction column
  dt
    font-size .6rem
  dd
    font-size .24rem
.invite-cash-form
  padding 0 .25rem
  .invite-cash-item
    margin-bottom .25rem
    background-color #fff
    border-radius .1rem
    overflow hidden
    box-shadow 0 0 15px rgba(92,92,92,.1)
    .invite-cash-title
        height .68rem
        display flex
        align-items center
        margin-bottom .4rem
        i
          width .07rem
          height .26rem
          background-color #ff3c29
          border-radius .03rem
          margin-right .12rem
        strong
          font-size .3rem
          color #454553
          display flex
          align-items flex-end
          span
            font-size .22rem
            color #777777
            margin 0 .05rem 0 .15rem
          a
            font-size .22rem
            color #ff3927
            text-decoration underline
    .draw-cash-mode
      display flex
      justify-content space-between
      align-items center
      padding 0 .34rem .4rem
      .icon-checkbox
        width .38rem
        height .38rem
        background-image url(../assets/images/checkbox.png)
      .cash-wechat-pay
        display flex
        align-items center
        .icon-wechat
          width .58rem
          height .58rem
          background-image url(../assets/images/wechat-pay.png)
          margin-right .15rem
        span
          color #777777
          font-size .28rem
          display inline-block
          vertical-align middle
    .invite-cash-info
      font-size .24rem
      color #8e8e8e
      span
        color #f32a2a
        margin-left .1rem
    .vux-checker-box
      padding 0 .25rem .1rem
      display flex
      justify-content space-between
      flex-wrap wrap
      .select-item
        width 3.1rem
        height .7rem
        line-height .7rem
        text-align center
        border-radius .1rem
        border .03rem solid #e9e9e9
        background-color #fff
        font-size .3rem
        color #484447
        margin-bottom .4rem
        position relative
        &.select-item-selected
          border-color #00c524
          color #00c524
          background-color #f6fff6
        &.select-new-person:after
          content ''
          display inline-block
          position absolute
          right .03rem
          top .02rem
          background-image url(../assets/images/tag.png)
          background-size 100% 100%
          width .7rem
          height .3rem
      .select-tag
        color #fff
        padding 0 .1rem
        font-size .18rem
        background-color #00c524
        height 14px
        border none
        border-radius .05rem
        position absolute
        top .02rem
        left .03rem
.fade-leave-to 
  opacity 0
.fade-leave-active 
  transition opacity 0.3s
        
</style>
