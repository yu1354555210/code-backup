<template>
  <div class="wrapper">
    <x-header :left-options="{ backText: '' }">找回密码</x-header>
    <div class="login-section">
      <div class="this-input">
        <i class="icon-user"></i>
        <input type="text" name="" placeholder="手机号码" v-model="mobile" maxlength="11" />
      </div>
      <div class="this-input this-valcode">
        <i class="icon-val"></i>
        <input type="text" name="" placeholder="验证码" v-model="valCode" />
        <Button type="primary" class="get-code" v-if="countDownShow == false" @click.native="regSendSMS">获取验证码</Button>
        <Button type="primary" class="get-code" v-else>
          <countdown v-show="countDownShow" v-model="time" :start="start" @on-finish="finish"></countdown>s重新发送
        </Button>
      </div>
      <div class="this-input">
        <i class="icon-pwd"></i>
        <input :type="pwdType" name="" class="input-password" v-model="password" placeholder="请输入新密码" />
        <span class="icon-eye" :class="pwdType == 'password' ? 'icon-eye-close' : ''" @click="setEye"></span>
      </div>
      <div class="form-sub"><a href="javascript:void(0);" class="btn btn-long" @click="changePwd">修改密码</a></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { Countdown } from 'vux';
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
  data() {
    return {
      pwdType: 'password',
      mobile: '',
      password: '',
      valCode: '',
      countDownShow: false,
      time: 60,
      start: false
    };
  },
  computed: {
    ...mapGetters(['getLoginStatus','getToken'])
  },
  components: {
    Countdown
  },
  methods: {
    ...mapMutations(['changeLogin', 'setUserInfo', 'setToken']),
    finish(index) {
      this.start = false;
      this.countDownShow = false;
      this.time = 60;
    },
    regSendSMS() {
      //验证手机窗口内容
      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.mobile == '') {
        this.$vux.toast.text('请填写手机号码');
        return;
      } else if (!reg.test(this.mobile)) {
        this.$vux.toast.text('手机格式不正确');
        return;
      }
      this.$ajax
        .get('/user/mobile-sms', {
          params: {
            mobile: this.mobile,
            game_id: this.game_id
          }
        })
        .then(response => {
          if (response.data.code == 1) {
            this.$vux.toast.text('发送成功');
            this.countDownShow = true;
            this.start = true;
          } else {
            this.$vux.toast.text(response.data.msg);
            return;
          }
        })
        .catch(error => {
          this.$vux.toast.text('发送失败，请稍后重试');
        });
    },
    changePwd() {
      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if(this.mobile == ''){
        this.$vux.toast.text('请填写手机号码');
        return;
      } else if (!reg.test(this.mobile)) {
        this.$vux.toast.text('手机格式不正确');
        return;
      } else if(this.valCode == ''){
        this.$vux.toast.text('请填写验证码');
        return;
      }else if(this.password == ''){
        this.$vux.toast.text('请填写新密码');
        return;
      }
      this.$ajax
        .get('/user/mobile-fogetpwd', {
          params: {
            mobile: this.mobile,
            code: this.valCode,
            passwd1: this.password,
          }
        })
        .then(response => {
          if (response.data.code == 1) {
            this.$vux.toast.text('修改成功');
            setTimeout(()=>{
              this.$router.push({
                path: '/login'
              })
            },1000);
          } else {
            this.$vux.toast.text(response.data.msg);
            return;
          }
        })
        .catch(error => {
          this.$vux.toast.text('发送失败，请稍后重试');
        });
    },
    isWin() {
      this.valid_mobile = this.$refs.valid_mobile.valid;
    },
    setEye() {
      this.pwdType == 'password' ? (this.pwdType = 'text') : (this.pwdType = 'password');
    },
    postLogin() {
      if (this.username == '') {
        this.$vux.toast.text('手机号/游客账号未填写');
        return;
      }
      if (this.password == '') {
        this.$vux.toast.text('密码未填写');
      }

      // let params = new URLSearchParams();
      // params.append("loginname", this.username);
      // params.append("passwd", this.password);
      // params.append("game_id", this.game_id);
      //ajax请求
      this.$ajax
        .get('/user/login', {
          params: {
            loginname: this.username,
            passwd: this.password,
            game_id: this.game_id,
            is_wx_browser: this.isWeiXin(),
            redirect_url: location.origin
          }
        })
        .then(response => {
          setTimeout(() => {
            this.$vux.loading.hide();
          }, 800);
          if (response.data.code == 0) {
            setTimeout(() => {
              this.$vux.toast.text(response.data.msg);
            }, 1000);
            return;
          }
          let data = response.data.data;
          this.changeLogin(true);
          this.setUserInfo(data);
          this.setToken(data.token);
          location.href = data.redirect_url;
        })
        .catch(error => {
          this.$vux.toast.text('系统错误，请稍后重试');
        });
    }
  },
  mounted() {}
};
</script>
<style lang="stylus">

</style>
