<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <div class="bg"></div>
      <div class="container">
        <div class="person">
          <div class="person-top" v-if="info!=null">
            <dl>
              <dt>
                <img :src="info.logo" alt="">
              </dt>
              <dd>
                <div class="person-name" v-text="info.nick_name"></div>
                <div class="person-id">ID: {{info.id}}</div>
              </dd>
            </dl>
          </div>
          <div @click="toInviteIndex" class="person-bottom">
            <div class="person-money-fl">
              <i class="icon-money"></i>
              <span>我的收益</span>
            </div>
            <div class="person-money-middle">{{business_amount}}元</div>
            <div class="person-money-fr">去赚钱</div>
          </div>
        </div>
        <ul class="person-nav">
          <li @click="isBindPhonePupup">
            <img src="../assets/img/icon-mine-phone.png" alt="">
            <span>绑定手机</span>
          </li>
          <li @click="isChangePwd=true">
            <img src="../assets/img/icon-mine-pwd.png" alt="">
            <span>修改密码</span>
          </li>
          <li @click="isShare=true">
            <img src="../assets/img/icon-mine-share.png" alt="">
            <span>分享给朋友</span>
          </li>
          <li @click="loginout">
            <img src="../assets/img/icon-mine-logout.png" alt="">
            <span>退出登录</span>
          </li>
        </ul>
      </div>
    </mescroll-vue>
    <!-- 绑定手机弹窗 -->
    <v-bind-popop v-if="mobilePopup" :isBindPhone="isBindPhone"></v-bind-popop>
    <!-- 修改密码弹窗 -->
    <div class="this-form-container" v-if="isChangePwd" @click.self="isChangePwd=false">
      <div class="this-form-wrap">
        <div class="this-form-title">修改密码</div>
        <group class="this-form-input this-form-on-icon">
          <x-input
            ref="pwd"
            type="password"
            placeholder="请输入旧密码"
            required
            v-model="old_pwd_val"
            @on-blur="inputLoseFocus"
          ></x-input>
        </group>
        <group class="this-form-input this-form-on-icon">
          <x-input
            ref="new_pwd"
            placeholder="请输入新密码"
            type="password"
            v-model="new_pwd_val"
            required
            @on-blur="inputLoseFocus"
          ></x-input>
        </group>
        <group class="this-form-input this-form-on-icon">
          <x-input
            ref="new_pwd2"
            placeholder="请确认新密码"
            type="password"
            required
            @on-blur="inputLoseFocus"
          ></x-input>
        </group>
        <div class="this-form-btn-box">
          <x-button type="primary" class="this-form-btn radius" @click.native="postChangePwd">立即修改</x-button>
        </div>
      </div>
    </div>
    <div class="wx-share-bg" v-if="isShare" @click="isShare=false"></div>
  </div>
</template>

<script>
import { XButton, XHeader, XInput, Group, Countdown } from "vux";
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import vBindPopop from "../components/v-bind-mobile-popup";
export default {
  components: {
    XButton,
    XHeader,
    MescrollVue,
    XInput,
    Group,
    Countdown,
    vBindPopop
  },
  computed: {
    ...mapGetters(["getUserInfo", "getDiamond", "getLoginStatus"]),
    ...mapState(["mobilePopup", "loginPopup"])
  },
  watch: {
    getUserInfo(val) {
      this.info = val;
    }
  },
  created() {},
  mounted() {
    this.$nextTick(function() {
      var playerInfo = this.getUserInfo;
      if (playerInfo != null && playerInfo != "[]") {
        this.info = playerInfo;
        if (playerInfo.is_bind_phone == 1) {
          this.isSuccess = true;
          this.bind_phone = playerInfo.bind_phone;
        } else {
          this.changePhone();
        }
      } else {
        this.$store.dispatch("LoginInfo");
      }

      this.$ajax
        .get("/xdcoop/player/info")
        .then(res => {
          let data = res.data;
          if (data.length == 0) return;
          this.code = data.code;
          this.business_amount = data.business_amount;
        })
        .catch(error => {
          console.log(error);
        });
    });
  },
  data() {
    return {
      time: 60,
      start: false,
      countDownShow: false,
      valid_mobile: false,
      isSuccess: false,
      mobile_val: "",
      code_val: "",
      bind_phone: "",
      info: [],
      isLogin: false,
      isBindPhone: false,
      mescroll: null,
      business_amount: "",
      code: "",
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false
      },
      isChangePwd: false,
      old_pwd_val: "",
      new_pwd_val: "",
      isShare: false
    };
  },
  methods: {
    ...mapActions(["LoginInfo"]),
    ...mapMutations(["switch_mobile_dialog", "switch_login_dialog"]),
    finish(index) {
      this.start = false;
      this.countDownShow = false;
      this.time = 60;
    },
    countDown() {
      if (this.valid_mobile) {
        this.bindPhoneSms();
      } else {
        this.$vux.toast.text("请输入正确手机号码");
      }
    },
    // 手机验证是否通过
    isWin() {
      this.valid_mobile = this.$refs.valid_mobile.valid;
    },
    bindPhoneSms() {
      //绑定手机发送验证码
      let phone = $.trim(this.mobile_val);
      let params = new URLSearchParams();
      params.append("phone_num", phone);
      this.$ajax({
        method: "post",
        url: "/bind-phone/send-sms",
        data: params
      })
        .then(response => {
          if (response.data.status != 1) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          this.$vux.toast.text("发送成功");
          this.countDownShow = true;
          this.start = true;
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    changePhone() {
      this.isBindPhone = false;
      this.mobile_val = "";
      this.code_val = "";
      this.finish();
    },
    isBindPhonePupup() {
      if (this.getUserInfo.is_bind_phone == 1) {
        this.isBindPhone = true;
        this.bind_phone = this.getUserInfo.bind_phone;
      } else {
        this.isBindPhone = false;
      }
      this.switch_mobile_dialog(true);
    },
    postChangePwd() {
      let pwd = this.$refs.pwd.currentValue,
        new_pwd = this.$refs.new_pwd.currentValue,
        new_pwd2 = this.$refs.new_pwd2.currentValue;
      if (pwd == "") {
        this.$vux.toast.text("旧密码未填写");
        return;
      } else if (new_pwd == "") {
        this.$vux.toast.text("新密码未填写");
        return;
      } else if (new_pwd2 == "") {
        this.$vux.toast.text("确认新密码未填写");
        return;
      } else if (new_pwd != new_pwd2) {
        this.$vux.toast.text("两次密码不相同");
        return;
      } else if (
        new_pwd.length < 6 ||
        new_pwd.length > 12 ||
        (new_pwd2.length < 6 || new_pwd2.length > 12) ||
        (pwd.length < 6 || pwd.length > 12)
      ) {
        this.$vux.toast.text("密码长度需6~12个字符");
        return;
      } else {
        let newPwd = this.new_pwd_val;
        let oldPwd = this.old_pwd_val;
        let params = new URLSearchParams();
        params.append("opwd", oldPwd);
        params.append("npwd", newPwd);
        params.append("npwd2", newPwd);
        this.$ajax({
          method: "post",
          url: "/reset-pwd/index",
          data: params
        })
          .then(response => {
            console.log(response);
            if (response.data.status != 1) {
              this.$vux.toast.text(response.data.msg);
              return;
            }
            this.$vux.toast.text("修改成功");
            this.isChangePwd = false;
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    },
    loginout() {
      this.$ajax
        .get("/login/out")
        .then(response => {
          if (response.data.status == 0) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          this.$vux.toast.text("退出成功");
          setTimeout(() => {
            this.$router.push({
              path: "/"
            });
            this.$store.commit("removeLogin");
            this.$store.commit("removeOpenid");
            this.$store.commit("removeUserInfo");
          }, 100);
        })
        .catch(error => {
          console.log(error);
          this.$vux.toast.text("logout err");
        });
    },
    toInviteIndex() {
      this.cnzzTrackEvent("我的页-去赚钱");
      if (this.isWeiXin()) {
        this.$router.push("/inviteIndex");
      } else {
        this.$vux.toast.text("请在微信浏览器打开");
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper {
  background: #fffefe url('../assets/img/game-mine-bg.jpg') no-repeat center top;
  background-size: 7.5rem 2.83rem;
}

.container {
  padding: 0.96rem 0.4rem;
}

.person-nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  li {
    width: 1.9rem;
    height: 2.4rem;
    background-color: #fff;
    border-radius: 0.1rem;
    margin-top: 0.5rem;
    font-size: 0.26rem;
    color: #505050;
    text-align: center;
    box-shadow: 0px 0px 0.27rem rgba(160, 160, 160, 0.23);
    padding-top: 0.3rem;

    img {
      width: 1.2rem;
      height: 1.2rem;
      display: inline-block;
    }

    span {
      display: block;
    }
  }

  &:after {
    display: block;
    content: '';
    width: 1.9rem;
    height: 0;
  }
}

.person {
  width: 100%;
  height: 3.5rem;
  background-color: #fff;
  border-radius: 0.15rem;
  // overflow hidden
  text-align: center;
  box-shadow: 0px 0px 0.27rem rgba(235, 99, 109, 0.3);

  .person-top {
    height: 2.73rem;
    padding: 0.3rem 0;

    dl {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      dt {
        width: 1.4rem;
        height: 1.4rem;

        img {
          width: 1.3rem;
          height: 1.3rem;
          border-radius: 50%;
          border: 0.05rem solid #f5f5f5;
        }
      }

      dd {
        line-height: 0.45rem;

        .person-name {
          color: #000000;
          font-size: 0.3rem;
        }

        .person-id {
          font-size: 0.22rem;
          color: #767676;
        }
      }
    }
  }

  .person-bottom {
    background-color: #f1f1f1;
    height: 0.78rem;
    display: flex;
    align-items: center;
    padding: 0 0.24rem;
    font-size: 0.24rem;
    justify-content: space-between;

    .person-money-fl {
      color: #505050;

      .icon-money {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('../assets/img/icon-money.png');
        background-size: 100% 100%;
        margin-right: 5;
        display: inline-block;
        vertical-align: middle;
      }

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .person-money-middle {
      font-size: 0.28rem;
      color: #f84444;
      font-weight: bold;
    }

    .person-money-fr {
      color: #eb636d;
    }
  }
}

.wx-share-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8) url('../assets/img/wx-share-bg.png') no-repeat center;
  0.55rem;
  background-size: 5.8rem 5.55rem;
  z-index: 888888;
}
</style>
