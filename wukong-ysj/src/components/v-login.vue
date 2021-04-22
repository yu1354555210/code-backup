<template>
  <div>
    <!-- 登录 -->
    <div class="this-form-container" v-show="isLoginPopup" @click.self="hidePopup">
      <div class="this-form-wrap">
        <div class="this-form-title">
          登录
        </div>
        <group class="this-form-input">
          <i class="icon-phone form-icon"></i>
          <x-input
            ref="user_name"
            id="login_username"
            v-model="login_username_val"
            placeholder="手机号/账号"
            @on-blur="inputLoseFocus"
          ></x-input>
        </group>
        <group class="this-form-input">
          <i class="icon-pwd form-icon"></i>
          <x-input
            ref="pwd"
            id="login_password"
            v-model="login_password_val"
            placeholder="请输入密码"
            :type="pwdType"
            :show-clear="false"
            @on-blur="inputLoseFocus"
          ></x-input>
          <span class="see" :class="pwdType=='password'?'':'see-close'" @click="changeType"></span>
        </group>
        <div class="this-form-other">
          <a href="javascript:;" @click="toSign">注册帐号</a>
          <a href="javascript:;" @click="toFind">找回密码</a>
        </div>
        <div class="this-form-btn-box">
          <x-button type="primary" class="this-form-btn radius" @click.native="postLogin">登录</x-button>
        </div>
        <div class="this-form-type">
          <a href="javascript:;" @click="toInfo">
            <i class="icon-quick"></i>
            <span>快速游戏</span>
          </a>
          <a href="javascript:;" @click="toWechat">
            <i class="icon-wechat"></i>
            <span>微信登录</span>
          </a>
        </div>
      </div>
    </div>
    <!-- 快速游戏 -->
    <div class="this-form-container" v-show="isInfoPopup" @click.self="hidePopup">
      <div class="this-form-wrap">
        <div class="this-form-title">
          <i class="this-form-back" @click="backLogin"></i>
          快速游戏
        </div>
        <group class="this-form-input">
          <i class="icon-phone2 form-icon"></i>
          <x-input
            type="tel"
            v-model="aip_username_val"
            placeholder="请输入手机号码"
            name=""
            value=""
            readonly
          ></x-input>
        </group>
        <group class="this-form-input">
          <i class="icon-pwd2 form-icon"></i>
          <x-input
            type="text"
            v-model="aip_password_val"
            placeholder="请输入新密码"
            name=""
            value=""
            readonly
          ></x-input>
        </group>
        <div class="this-form-btn-box">
          <x-button type="primary" class="this-form-btn radius text-sm copy_btn" :data-clipboard-text="copyText" @click.native="guestLogin()">进入游戏，并复制帐号密码</x-button>
        </div>
        <div class="this-form-info">快速游戏如丢失无法找回，请尽快绑定手机</div>
      </div>
    </div>
    <!-- 微信登录 -->
    <div class="this-form-container" v-show="isWechatPopup" @click.self="hidePopup">
      <div class="this-form-wrap">
        <div class="this-form-title">
          微信登录
          <i class="this-form-back" @click="backLogin"></i>
          <!-- 微信登录 -->
        </div>
        <div class="this-form-qrcode" v-if="wxQrcode!=''">
          <!-- 微信登录二维码自定义样式转化base64
          .impowerBox .qrcode {width: 100%; border:0}
          .impowerBox .title {display: none;}
          .impowerBox .info {width: 100%;}
          .impowerBox .status p {font-size: 12px;} -->
          <wxlogin 
          :appid="wxQrcode.appid" 
          scope="snsapi_login" 
          :state="wxQrcode.state" 
          :redirect_uri="wxQrcode.url"
          href="data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDEwMCU7IGJvcmRlcjowfQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMTAwJTt9DQouaW1wb3dlckJveCAuc3RhdHVzIHAge2ZvbnQtc2l6ZTogMTJweDt9"
          ></wxlogin>
        </div>
        <!-- <div class="this-form-info">用微信扫描二维码登陆</div> -->
      </div>
    </div>
    <!-- 注册 -->
    <div class="this-form-container" v-show="isSignPopup" @click.self="hidePopup">
      <div class="this-form-wrap">
        <div class="this-form-title">
          注册
          <i class="this-form-back" @click="backLogin"></i>
        </div>
        <group class="this-form-input">
          <i class="icon-phone form-icon"></i>
          <x-input
            placeholder="请输入手机号码"
            id="reg_username"
            v-model="reg_username_val"
            type="tel"
            :max="11"
            keyboard="number"
            required
            is-type="china-mobile"
            ref="valid_mobile"
            @on-change="isWin"
            @on-blur="inputLoseFocus"
          ></x-input>
        </group>
        <group class="this-form-input">
          <i class="icon-pwd form-icon"></i>
          <x-input
            id="reg_password"
            v-model="reg_password_val"
            ref="new_pwd"
            placeholder="请输入新密码"
            :type="pwdType"
            :show-clear="false"
            required
            novalidate
            @on-blur="inputLoseFocus"
          ></x-input>
          <span class="see" :class="pwdType=='password'?'':'see-close'" @click="changeType"></span>
        </group>
        <group class="this-form-input">
          <i class="icon-code form-icon"></i>
          <x-input
            id="reg_code"
            v-model="reg_code_val"
            placeholder="请输入验证码"
            ref="code_input"
            type="tel"
            :max="8"
            required
            :show-clear="false"
            novalidate
            @on-blur="inputLoseFocus"
          ></x-input>
          <a
            href="#"
            class="icon-form-code"
            v-if="countDownShow==false"
            id="rp_getcode"
            @click="countDown"
          >获取验证码</a>
          <a href="#" class="icon-form-code cur" v-else>
            <countdown
              v-show="countDownShow"
              v-model="time"
              :start="start"
              @on-finish="finish"
            ></countdown>s重新发送
          </a>
        </group>
        <div class="this-form-btn-box">
          <x-button type="primary" class="this-form-btn radius" @click.native="postSign">立即注册</x-button>
        </div>
      </div>
    </div>
    <!-- 忘记密码 -->
    <div class="this-form-container" v-show="isFindPopup" @click.self="hidePopup">
      <div class="this-form-wrap">
        <div class="this-form-title">
          忘记密码
          <i class="this-form-back" @click="backLogin"></i>
        </div>
        <group class="this-form-input">
          <i class="icon-phone form-icon"></i>
          <x-input
            v-model="fwp_phone_val"
            placeholder="请输入要找回的手机号 "
            type="tel"
            :max="11"
            keyboard="number"
            required
            is-type="china-mobile"
            ref="valid_mobile2"
            @on-change="isWin2"
            @on-blur="inputLoseFocus"
          ></x-input>
        </group>
        <group class="this-form-input">
          <i class="icon-pwd form-icon"></i>
          <x-input
            v-model="fwp_pwd_val"
            ref="change_pwd"
            placeholder="请输入新密码"
            :type="pwdType"
            required
            :show-clear="false"
            novalidate
            @on-blur="inputLoseFocus"
          ></x-input>
          <span class="see" :class="pwdType=='password'?'':'see-close'" @click="changeType"></span>
        </group>
        <group class="this-form-input">
          <i class="icon-code form-icon"></i>
          <x-input
            v-model="fwp_code_val"
            placeholder="请输入验证码"
            ref="code_input2"
            type="tel"
            :max="8"
            required
            :show-clear="false"
            novalidate
            @on-blur="inputLoseFocus"
          ></x-input>
          <a
            href="#"
            class="icon-form-code"
            v-if="countDownShow2==false"
            @click="countDown2"
          >获取验证码</a>
          <a href="#" class="icon-form-code cur" v-else>
            <countdown
              v-show="countDownShow2"
              v-model="time2"
              :start="start2"
              @on-finish="finish2"
            ></countdown>s重新发送
          </a>
        </group>
        <div class="this-form-btn-box">
          <x-button type="primary" class="this-form-btn radius" @click.native="postChangePwd">重置密码</x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Masker, XInput, XButton, Countdown, Group, Qrcode } from "vux";
import vFocusPopup from "@/components/v-focus-popup";
import { mapMutations, mapState, mapGetters } from "vuex";
import wxlogin from 'vue-wxlogin';
import Clipboard from "clipboard";
export default {
  data() {
    return {
      copyText: "",
      isMaskLogin: false,
      reg_username_val: "",
      reg_password_val: "",
      reg_code_val: "",
      login_username_val: "",
      login_password_val: "",
      fwp_phone_val: "",
      fwp_pwd_val: "",
      fwp_code_val: "",
      aip_username_val: "",
      aip_password_val: "",
      pwdType: 'password',
      isFindPopup: false,
      isInfoPopup: false,
      isSignPopup: false,
      isWechatPopup: false,
      isSign: false,
      isOneSign: true,
      isLoginClose: true,
      isMask: true,
      time: 60,
      start: false,
      countDownShow: false,
      valid_mobile: false,
      time2: 60,
      start2: false,
      countDownShow2: false,
      valid_mobile2: false,
      wxQrcode: '',
      // redirect: this.$route.query.redirect,
      xch_id: this.$route.query.xch_id || 1,
      playUrl: localStorage.getItem("playUrl") || this.$route.query.url
    };
  },
  components: {
    Masker,
    XInput,
    Countdown,
    vFocusPopup,
    Group,
    XButton,
    Qrcode,
    wxlogin
  },
  computed: {
    ...mapState(["focusPopup","redirect","isLoginPopup"]),
    ...mapGetters(["getLoginStatus"])
  },
  mounted() {

    if (this.$route.query.url) {
      localStorage.setItem("playUrl", this.$route.query.url);
    }

    var clipboard = new Clipboard(".copy_btn");
    clipboard.on("success", e => {
      this.$vux.toast.text("复制成功");
    });
  },
  methods: {
    ...mapMutations([
      "switch_login_dialog",
      "changeLogin",
      "setUserInfo",
      "switch_focus_dialog",
      "switch_form_dialog"
    ]),
    goBack(){
      localStorage.removeItem("playUrl");
      this.$router.back();
    },
    toSign() {
      this.switch_form_dialog(false);
      this.isSignPopup = true;
    },
    backLogin() {
      this.switch_form_dialog(true);
      this.isFindPopup = false;
      this.isSignPopup = false;
      this.isInfoPopup = false;
      this.isWechatPopup = false;
      this.login_username_val = "";
    },
    hidePopup() {
      this.switch_login_dialog(false);
      this.switch_form_dialog(false);
      this.isFindPopup = false;
      this.isSignPopup = false;
      this.isInfoPopup = false;
      this.isWechatPopup = false;
      this.login_username_val = "";
    },
    toFind() {
      this.isFindPopup = true;
      this.switch_form_dialog(false);
    },
    toWechat() {
      this.switch_form_dialog(false);

      if(this.isWeiXin()){
        this.wechat_login();
      }else{
        this.isWechatPopup = true;
        this.$vux.loading.show({
            text: '请求中...'
        })
        this.$ajax
          .get("/qrcode-login/index", {
            params: {
              game_id: "",
              ch_id: this.ch_id,
              xch_id: this.xch_id
            }
          })
          .then(response => {
            setTimeout(() => {
                this.$vux.loading.hide()
            }, 800)
            if (response.data.status == 1) {
              this.wxQrcode = response.data.data;
            }
          })
          .catch(error => {});
      }
    },
    setLoginOpenid(url, thirdLogin = "") {
      this.$ajax
        .get("/xd-api/set-login-openid", {
          params: {
            last_url: url
          }
        })
        .then(response => {
          localStorage.removeItem("playUrl");
          if (thirdLogin == "") {
            window.location.href = response.data.data;
          }
        })
        .catch(function(error) {});
    },
    routerPush() {
      if (this.isWeiXin()) {
        // 微信浏览器登录时设置openid
        if (this.playUrl) {
          this.setLoginOpenid(this.playUrl);
        } else {
          this.setLoginOpenid(
            `${window.location.origin}/index.html#${this.redirect}?xch_id=${
              this.xch_id
            }`
          );
        }
      } else {
        if (this.playUrl) {
          localStorage.removeItem("playUrl");
          window.location.href = this.playUrl;
        } else {
          this.$router.push({
            path: this.redirect
          });
          this.switch_form_dialog(false);
          this.isFindPopup = false;
          this.isSignPopup = false;
          this.isInfoPopup = false;
        }
      }
    },
    toInfo() {
      //一键注册
      this.$vux.loading.show({
          text: '请求中...'
      })
      this.$ajax
        .get("/auto-login/account", {
          params: {
            game_id: "",
            lcid: this.ch_id,
            ch_id: this.ch_id,
            xch_id: this.xch_id
          }
        })
        .then(response => {
          setTimeout(() => {
              this.$vux.loading.hide()
          }, 800)
          if (response.data.status == 1) {
            this.aip_username_val = response.data.username;
            this.aip_password_val = response.data.password;
            this.switch_form_dialog(false);
            this.isInfoPopup = true;
            this.copyText = `帐号：${this.aip_username_val}\n密码：${
              this.aip_password_val
            }`;
            return;
          }
          setTimeout(() => {
              this.$vux.toast.text(response.data.msg);
          }, 1000)
        })
        .catch(error => {});
    },
    guestLogin() {
      let username = this.aip_username_val;
      let pwd = this.aip_password_val;
      this.$vux.loading.show({
          text: '登录中...'
      })
      this.$ajax
        .get("/login/ajax", {
          params: {
            lname: username,
            lpwd: pwd,
            lgid: "",
            lcid: this.ch_id,
            xch_id: this.xch_id
          }
        })
        .then(response => {
          setTimeout(() => {
              this.$vux.loading.hide()
          }, 800)
          if (response.data.status == 0) {
            setTimeout(() => {
              this.$vux.toast.text(response.data.msg);
            }, 1000)
            return;
          }
          this.changeLogin(true);
          this.$store.dispatch("LoginInfo");
          this.routerPush();
        })
        .catch(error => {
          setTimeout(() => {
              this.$vux.loading.hide()
          }, 800)
          setTimeout(() => {
            this.$vux.toast.text("服务器错误，请稍后重试");
          }, 1000)
        });
    },
    postLogin() {
      //登录
      if (this.$refs.user_name.currentValue == "") {
        this.$vux.toast.text("手机号/账号未填写");
        return;
      } else if (this.$refs.pwd.currentValue == "") {
        this.$vux.toast.text("密码未填写");
        return;
      } else {
        let username = this.login_username_val;
        let pwd = this.login_password_val;
        this.$vux.loading.show({
            text: '登录中...'
        })
        this.$ajax
          .get("/login/ajax", {
            params: {
              lname: username,
              lpwd: pwd,
              lgid: "",
              lcid: this.ch_id
            }
          })
          .then(response => {
            setTimeout(() => {
              this.$vux.loading.hide()
            }, 800)
            if (response.data.status == 0) {
              setTimeout(() => {
                this.$vux.toast.text(response.data.msg);
              }, 1000)
              return;
            }
            this.changeLogin(true);
            this.$store.dispatch("LoginInfo");
            this.routerPush();
          })
          .catch(error => {
            setTimeout(() => {
                this.$vux.loading.hide()
            }, 800)
            setTimeout(() => {
              this.$vux.toast.text("服务器错误，请稍后重试");
            }, 1000)
          });
      }
    },
    postSign() {
      //手机注册
      if (this.$refs.valid_mobile.currentValue == "") {
        this.$vux.toast.text("手机号未填写");
        return;
      } else if (!this.valid_mobile) {
        this.$vux.toast.text("请输入正确手机号");
        return;
      } else if (this.$refs.new_pwd.currentValue == "") {
        this.$vux.toast.text("密码未填写");
        return;
      } else if (this.$refs.code_input.currentValue == "") {
        this.$vux.toast.text("验证码未填写");
        return;
      } else {
        var username = this.reg_username_val;
        var pwd = this.reg_password_val;
        var code = this.reg_code_val;
        username = $.trim(username);
        pwd = $.trim(pwd);
        code = $.trim(code);

        this.$ajax
          .get("/reg/ajax2", {
            params: {
              rname: username,
              rpwd: pwd,
              rchannel: this.ch_id,
              rgid: "",
              rcode: code,
              xch_id: this.xch_id
            }
          })
          .then(response => {
            if (response.data.status == 0) {
              this.$vux.toast.text(response.data.msg);
              return;
            }
            this.$vux.toast.text("注册成功");
            this.$store.dispatch("LoginInfo");
            this.changeLogin(true);
            this.routerPush();
          })
          .catch(error => {
            this.$vux.toast.text("服务器错误，请稍后重试");
          });
      }
    },
    thirdLoginRouter() {
      //第三方登录后存储路由
      if (this.redirect) {
        localStorage.setItem("thirdRedirect", this.redirect);
      }
    },
    wechat_login() {
      this.$ajax
        .get("/xd-api/wx-loginurl",{
          params: {
             xch_id: this.xch_id
          }
        })
        .then(res => {
          if (res.data.status == 1) {
            window.location.href = res.data.data.url;
            this.changeLogin(true);
            this.thirdLoginRouter();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    postChangePwd() {
      //更改密码
      if (this.$refs.valid_mobile2.currentValue == "") {
        this.$vux.toast.text("手机号未填写");
        return;
      } else if (!this.valid_mobile2) {
        this.$vux.toast.text("请输入正确手机号");
        return;
      } else if (this.$refs.change_pwd.currentValue == "") {
        this.$vux.toast.text("密码未填写");
        return;
      } else if (this.$refs.code_input2.currentValue == "") {
        this.$vux.toast.text("验证码未填写");
        return;
      } else {
        let username = $.trim(this.fwp_phone_val);
        let code = $.trim(this.fwp_code_val);
        let pwd = $.trim(this.fwp_pwd_val);
        let params = new URLSearchParams();
        params.append("phone_number", username);
        params.append("sms", code);
        params.append("pwd", pwd);
        //ajax请求
        this.$ajax({
          method: "post",
          url: "/phone-reset-pwd/index2",
          data: params
        })
          .then(response => {
            if (response.data.status != 1) {
              this.$vux.toast.text(response.msg);
              return;
            }
            this.$vux.toast.text("修改成功");
            setTimeout(this.backLogin(), 2000);
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    },
    closeLoginPopup() {
      this.switch_login_dialog(false);
    },
    finish(index) {
      this.start = false;
      this.countDownShow = false;
      this.time = 60;
    },
    countDown() {
      if (this.valid_mobile) {
        this.regSendSMS();
      } else {
        this.$vux.toast.text("请输入正确手机号");
      }
    },
    regSendSMS() {
      //验证手机窗口内容
      let phone = this.reg_username_val;
      let params = new URLSearchParams();
      params.append("phone_num", phone);
      //ajax请求
      this.$ajax({
        method: "post",
        url: "/reg/send-sms",
        data: params
      })
        .then(response => {
          if (response.data.status == 1) {
            this.$vux.toast.text("发送成功");
            this.countDownShow = true;
            this.start = true;
          } else {
            this.$vux.toast.text(response.data.msg);
            return;
          }
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    findPwdSms() {
      //找回密码发送验证码
      let phone = $.trim(this.fwp_phone_val);
      this.$ajax
        .get("/phone-reset-pwd/send-sms", {
          params: {
            phone_number: phone
          }
        })
        .then(response => {
          if (response.data.status != 1) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          this.$vux.toast.text("发送成功");
          this.countDownShow2 = true;
          this.start2 = true;
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    finish2(index) {
      this.start2 = false;
      this.countDownShow2 = false;
      this.time2 = 60;
    },
    countDown2() {
      if (this.valid_mobile2) {
        this.findPwdSms();
      } else {
        this.$vux.toast.text("请输入正确手机号");
      }
    },
    // 手机验证是否通过
    isWin() {
      this.valid_mobile = this.$refs.valid_mobile.valid;
    },
    isWin2() {
      this.valid_mobile2 = this.$refs.valid_mobile2.valid;
    },
    toUserAgreement() {
      this.$router.push("/user-agreement");
    },
    changeType(){
      this.pwdType = this.pwdType==='password'?'text':'password'
    },
  }
};
</script>

<style lang="stylus">
.this-form-qrcode
  iframe
    width 100% !important
    height 6rem !important
</style>


