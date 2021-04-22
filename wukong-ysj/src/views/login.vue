<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">登录</x-header>
    <div class="login-section">
      <div class="this-input">
        <i class="icon-user"></i>
        <input type="text" name="" placeholder="手机号/游客账号" v-model="username" />
      </div>
      <div class="this-input">
        <i class="icon-pwd"></i>
        <input :type="pwdType" name="" class="input-password" v-model="password" placeholder="请输入登录密码" />
        <span class="icon-eye" :class="pwdType=='password'?'icon-eye-close':''" @click="setEye"></span>
      </div>
      <div class="form-sub">
        <a href="javascript:void(0);" class="btn btn-long" @click="postLogin">登 录</a>
      </div>
      <div class="form-other">
        <router-link to="/find-pwd">忘记密码</router-link>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {
    mapMutations,
    mapState,
    mapGetters
  } from "vuex";
  export default {
    data() {
      return {
        pwdType: 'password',
        username: '',
        password: '',
        game_id: this.game_id
      };
    },
    computed: {
      ...mapGetters(["getLoginStatus"])
    },
    methods: {
      ...mapMutations([
        "changeLogin",
        "setUserInfo",
        "setToken",
      ]),
      setEye(){
        this.pwdType == 'password' ? this.pwdType = 'text' : this.pwdType = 'password';
      },
      postLogin() {
        if(this.username == ''){
          this.$vux.toast.text("手机号/游客账号未填写");
          return;
        }
        if(this.password == ''){
          this.$vux.toast.text("密码未填写");
        }

        // let params = new URLSearchParams();
        // params.append("loginname", this.username);
        // params.append("passwd", this.password);
        // params.append("game_id", this.game_id);
        //ajax请求
        this.$ajax.get("/user/login",{
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
              this.$vux.loading.hide()
            }, 800)
            if (response.data.code == 0) {
              setTimeout(() => {
                this.$vux.toast.text(response.data.msg);
              }, 1000)
              return;
            }
            let data = response.data.data;
            this.changeLogin(true);
            this.setUserInfo(data);
            this.setToken(data.token);
            if(this.$route.query.redirect){
              this.$router.push({
                path: this.$route.query.redirect
              })
            }else{
               location.href = data.redirect_url;
               // this.$router.push('/')
            }
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    },
    mounted() {
      if(this.getLoginStatus){
        this.$router.push('/');
      }
    }
  };
</script>
<style type="text/css">

</style>
