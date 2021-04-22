<template>
  <div id="loginPage" class="login-page">
    <div class="login_popup" v-show="isLoginPopup">
      <!--登录游戏-->
      <div class="public_popup">
        <div class="public_popup_title flex-pack-justify">
          <h3>
            <i class="this_icon icon_logo"></i>小度微游登录
          </h3>
          <div class="this_icon icon_qrcode" @click="switch_focus_dialog(true)"></div>
        </div>
        <div class="public_popup_body">
          <div class="public_popup_title" :class="isMaskLogin==false?'public_popup_no_mask':''">登录游戏
            <div class="icon-close" v-show="isLoginClose" @click="closeLoginPopup"></div>
          </div>
          <div class="public_popup_main">
            <div class="public_popup_form">
              <ul>
                <li class="public_this_input">
                  <i class="phone_icon this_icon"></i>
                  <x-input
                    ref="user_name"
                    id="login_username"
                    v-model="login_username_val"
                    placeholder="手机号/账号"
                  ></x-input>
                </li>
                <li class="public_this_input">
                  <i class="pwd_icon this_icon"></i>
                  <x-input
                    ref="pwd"
                    id="login_password"
                    v-model="login_password_val"
                    placeholder="请输入密码"
                    type="password"
                    :show-clear="false"
                  ></x-input>
                  <a href="javascript:;" @click="toFind" class="find_pwd">找回密码</a>
                </li>
              </ul>
              <div class="public_popup_btn_box">
                <a href="#" class="public_popup_btn" @click="postLogin">登录</a>
                <a href="javascript:;" class="public_popup_btn tourist_btn" @click="toInfo">快速游戏</a>
              </div>
            </div>
            <div class="public_popup_other">
              <a href="javascript:;" @click="toSign">
                立即注册
                <span>&gt;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="other_box">
        <div class="other_page_title"></div>
        <ul>
          <li v-if="isWeiXin()">
            <a href="javascript:;" @click="wechat_login">
              <img src="../assets/img/login_icon_wx.png">
            </a>
          </li>
          <li>
            <a href="javascript:;" @click="qqLogin">
              <img src="../assets/img/login_icon_qq.png">
            </a>
          </li>
          <li>
            <a href="javascript:;" @click="weiboLogin">
              <img src="../assets/img/login_icon_sina.png">
            </a>
          </li>
        </ul>
      </div>
      <div class="agreement">注册/登录代表你同意<router-link to="/user-agreement">《小度用户协议》</router-link></div>
    </div>
    <!--找回密码-->
    <div class="public_popup user_popup" v-show="isFindPopup">
      <div class="public_popup_title">
        <div class="icon_back" @click="backLogin"></div>
        <div class="public_popup_title_hd">找回密码</div>
      </div>
      <div class="public_popup_body">
        <div class="public_popup_main">
          <div class="public_popup_form">
            <ul>
              <li class="public_this_input">
                <i class="phone_icon this_icon"></i>
                <x-input
                  v-model="fwp_phone_val"
                  placeholder="请输入手机号码"
                  type="tel"
                  :max="11"
                  keyboard="number"
                  required
                  is-type="china-mobile"
                  ref="valid_mobile2"
                  @on-change="isWin2"
                ></x-input>
              </li>
              <li class="public_this_input">
                <i class="pwd_icon this_icon"></i>
                <x-input
                  v-model="fwp_pwd_val"
                  ref="change_pwd"
                  placeholder="请输入新密码"
                  type="password"
                  required
                ></x-input>
              </li>
              <li class="public_this_input">
                <i class="code_icon this_icon"></i>
                <x-input
                  v-model="fwp_code_val"
                  placeholder="请输入验证码"
                  ref="code_input2"
                  type="tel"
                  :max="8"
                  required
                ></x-input>
                <a
                  href="javascript:;"
                  class="public_code_btn"
                  v-if="countDownShow2==false"
                  @click="countDown2"
                >获取验证码</a>
                <a href="#" class="public_code_btn cur" v-else>
                  <countdown
                    v-show="countDownShow2"
                    v-model="time2"
                    :start="start2"
                    @on-finish="finish2"
                  ></countdown>s重新发送
                </a>
              </li>
            </ul>
            <div class="public_popup_btn_box">
              <a href="#" class="public_popup_btn public_popup_long_btn" @click="postChangePwd">确认</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 快速游戏 -->
    <div class="public_popup user_popup" v-show="isInfoPopup">
      <div class="public_popup_title">
        <div class="icon_back" @click="backLogin"></div>
        <div class="public_popup_title_hd">快速游戏</div>
      </div>
      <div class="public_popup_body">
        <div class="public_popup_bd">
          <div class="public_popup_main" v-show="isOneSign">
            <div class="public_popup_form">
              <ul>
                <li class="public_this_input">
                  <i class="phone_icon this_icon"></i>
                  <input
                    type="tel"
                    v-model="aip_username_val"
                    placeholder="请输入手机号码"
                    name=""
                    value=""
                    readonly
                  >
                </li>
                <li class="public_this_input">
                  <i class="pwd_icon this_icon"></i>
                  <input
                    type="text"
                    v-model="aip_password_val"
                    placeholder="请输入新密码"
                    name=""
                    value=""
                    readonly
                  >
                </li>
              </ul>
              <div class="other_hint">
                <p>已为您生成了临时帐号和密码</p>
              </div>
              <div class="public_popup_btn_box">
                <a
                  href="javascript:;"
                  class="public_popup_btn tourist_btn public_popup_long_btn"
                  @click="guestLogin()"
                >进入游戏</a>
                <a
                  href="javascript:;"
                  class="public_popup_btn public_popup_long_btn copy_btn"
                  :data-clipboard-text="copyText"
                >复制账号密码</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 手机注册 -->
    <div class="public_popup user_popup" v-show="isSignPopup">
      <div class="public_popup_title">
        <div class="icon_back" @click="backLogin"></div>
        <div class="public_popup_title_hd">手机注册</div>
      </div>
      <div class="public_popup_body">
        <div class="public_popup_bd">
          <div class="public_popup_main">
            <div class="public_popup_form">
              <ul>
                <li class="public_this_input">
                  <i class="phone_icon this_icon"></i>
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
                  ></x-input>
                </li>
                <li class="public_this_input">
                  <i class="pwd_icon this_icon"></i>
                  <x-input
                    id="reg_password"
                    v-model="reg_password_val"
                    ref="new_pwd"
                    placeholder="请输入新密码"
                    type="password"
                    required
                  ></x-input>
                </li>
                <li class="public_this_input">
                  <i class="code_icon this_icon"></i>
                  <x-input
                    id="reg_code"
                    v-model="reg_code_val"
                    placeholder="请输入验证码"
                    ref="code_input"
                    type="tel"
                    :max="8"
                    required
                  ></x-input>
                  <a
                    href="#"
                    class="public_code_btn"
                    v-if="countDownShow==false"
                    id="rp_getcode"
                    @click="countDown"
                  >获取验证码</a>
                  <a href="#" class="public_code_btn cur" v-else>
                    <countdown
                      v-show="countDownShow"
                      v-model="time"
                      :start="start"
                      @on-finish="finish"
                    ></countdown>s重新发送
                  </a>
                </li>
              </ul>
              <div class="public_popup_btn_box">
                <a href="#" class="public_popup_btn public_popup_long_btn" @click="postSign">立即注册</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <masker :fullscreen="true" id="maskerBox" v-show="isMask"></masker>
    <v-focus-popup v-if="focusPopup"></v-focus-popup>
  </div>
</template>

<script>
import { Masker, XInput, Countdown } from "vux";
import vFocusPopup from "@/components/v-focus-popup";
import { mapMutations, mapState } from "vuex";
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
      isLoginPopup: true,
      isFindPopup: false,
      isInfoPopup: false,
      isSignPopup: false,
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
      redirect: this.$route.query.redirect,
      xch_id: this.$route.query.xch_id || 1,
      playUrl: localStorage.getItem("playUrl") || this.$route.query.url
    };
  },
  components: {
    Masker,
    XInput,
    Countdown,
    vFocusPopup
  },
  props: {
    isLoginPage: {
      default: true
    },
    path: {
      default: "game-mine"
    }
  },
  computed: {
    ...mapState(["focusPopup"])
  },
  mounted() {

    if (this.isLoginPage == true) {
      this.isMask = false;
      this.isLoginClose = false;
      this.isMaskLogin = false;
    }

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
      "switch_focus_dialog"
    ]),
    goBack(){
      localStorage.removeItem("playUrl");
      this.$router.back();
    },
    toSign() {
      this.isLoginPopup = false;
      this.isSignPopup = true;
    },
    backLogin() {
      this.isLoginPopup = true;
      this.isFindPopup = false;
      this.isSignPopup = false;
      this.isInfoPopup = false;
      this.login_username_val = "";
    },
    toFind() {
      this.isFindPopup = true;
      this.isLoginPopup = false;
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
        }
      }
    },
    coopLogin(){
      $.ajax({
          dataType: "jsonp",
          url: "http://h5.nzha.com/xdcoop/player/login",
          data: {'code': playerArr.code, 'url': window.location.href},
          jsonp: "callback",
          jsonpCallback: "login_jsonpCallback",
          success: function (data) {
              console.log(data);
          }
      });
      function login_jsonpCallback(res) {
          console.log(res);
          $.get('http://h5.nzha.com/xdcoop/player2/login', {'code': res.code}, function (res) {
          })
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
            this.isLoginPopup = false;
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
    qqLogin() {
      let redirect_url = `${window.location.origin}/index.html#${
        this.redirect
      }?xch_id=${this.xch_id}`;

      if (this.playUrl) {
        redirect_url = this.playUrl;
      }
      if (this.isWeiXin()) {
        // 微信浏览器登录时设置openid
        this.$ajax
          .get("/xd-api/set-login-openid", {
            params: {
              last_url: redirect_url
            }
          })
          .then(response => {
            localStorage.removeItem("playUrl");
            window.location.href =
              "http://h5.binglue.com/xd-qqlogin/index?redirect_url=" +
              encodeURIComponent(response.data.data);
          })
          .catch(function(error) {});
      } else {
        window.location.href =
          "http://h5.binglue.com/xd-qqlogin/index?redirect_url=" +
          encodeURIComponent(redirect_url);
      }

      this.$ajax
        .get("/xd-api/player-info")
        .then(res => {
          if (res.data.status != 403) {
            this.setUserInfo(response.data.data);
            this.changeLogin(true);
            this.thirdLoginRouter();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    weiboLogin() {
      let redirect_url = `${window.location.origin}/index.html#${
        this.redirect
      }?xch_id=${this.xch_id}`;

      if (this.playUrl) {
        redirect_url = this.playUrl;
      }
      if (this.isWeiXin()) {
        // 微信浏览器登录时设置openid
        this.$ajax
          .get("/xd-api/set-login-openid", {
            params: {
              last_url: redirect_url
            }
          })
          .then(response => {
            localStorage.removeItem("playUrl");
            window.location.href =
              `http://h5.binglue.com/weibo-login/index?redirect_url=${encodeURIComponent(response.data.data)}&ch_id=${this.ch_id}&xch_id=${this.xch_id}`;
          })
          .catch(function(error) {});
      } else {
        window.location.href =
          "http://h5.binglue.com/weibo-login/index?redirect_url=" +
          encodeURIComponent(redirect_url);
      }

      this.$ajax
        .get("/xd-api/player-info")
        .then(res => {
          if (res.data.status != 403) {
            this.setUserInfo(response.data.data);
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
          console.log(response);
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
    }
  }
};
</script>

<style lang="less">
.login_popup {
  overflow: hidden;
}
.no-login-page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.agreement{
  text-align: center;
  margin: .5rem 0 0;
  font-size: .22rem;
  color: #333;
  a{
    color: #41bbf8;
  }
}
</style>

