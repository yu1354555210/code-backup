<template>
  <div class="service-login-bar">
    <div class="service-login">
      <div class="login-before" v-if="!getLoginStatus">
        <div class="avatar"><img src="../assets/img/default-avatar.png" alt="" /></div>
        <div class="service-form">
          <div class="service-input">
            <i class="icon-user"></i>
            <el-input type="text" v-model="userName" placeholder="请输入您的账号"></el-input>
          </div>
          <div class="service-input">
            <i class="icon-pwd"></i>
            <el-input type="password" v-model="password" :show-password="true" :clearable="true" placeholder="请输入您的密码"></el-input>
          </div>
        </div>
        <div class="service-other">
          <label>
            <el-checkbox v-model="checked"><em>记住用户名</em></el-checkbox>
          </label>
          <router-link to="/find-pwd">
            <i></i>
            <span>忘记密码?</span>
          </router-link>
        </div>
        <el-button type="warning" @click="login">马上登录</el-button>
      </div>
      <div class="login-after" v-else>
        <div class="avatar"><img src="../assets/img/login-avatar.png" alt="" /></div>
        <div class="nickname">{{getUserInfo && getUserInfo.username}}<i class="icon-vip" :class="'icon-v'+levelData.level"></i></div>
        <div class="lever">等级：{{levelData.level_title}}</div>
        <div class="integral">成长积分 {{levelData.experience}} / {{levelData.max_points}}</div>
        <div class="progress" v-if="progressData"><el-progress :percentage="progressData" status="warning" :show-text="false" :color="customColor"></el-progress></div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import { base64 } from 'vux';
export default {
  data() {
    return {
      checked: true, //checkbox值
      userName: '',
      password: '',
      customColor: '#fcd42c',
      levelData: [],
    };
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken']),
    progressData(){
      return parseFloat(this.levelData.experience / this.levelData.max_points).toFixed(2) * 100;
    }
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    let account = this.getCookie('account');
    let password = base64.decode(this.getCookie('password'));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.userName = account;
      this.password = password;
      this.checked = true;
    }
  },
  mounted() {
    this.$nextTick(function() {
      if(this.getLoginStatus){
        this.getLevelData();
      }
    });
  },
  methods: {
    ...mapMutations(['removeLogin', 'setUserInfo', 'setToken', 'setGameUnit', 'changeLogin']),
    getLevelData(){
      this.$ajax
        .get('/shop/user-points', {
          params: {
            token: this.getToken
          }
        })
        .then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            this.levelData = data;
          }else{
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    login() {
      if (this.userName == '') {
        this.$vux.toast.text('请输入您的账号');
        return;
      }
      if (this.password == '') {
        this.$vux.toast.text('请输入您的密码');
        return;
      }
      this.$ajax
        .get('/user/login', {
          params: {
            game_id: 4,
            loginname: this.userName,
            passwd: this.password,
            is_wx_browser: this.isWeiXin(),
            redirect_url: location.href
          }
        })
        .then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            this.changeLogin(true);
            this.setUserInfo(data);
            this.setToken(data.token);
            this.setCookieInfo();
            this.getLevelData();
            if (this.$route.query.redirect) {
              this.$router.push({
                path: this.$route.query.redirect
              });
            } else {
              location.href = data.redirect_url;
              // this.$router.push('/')
            }
          }else{
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 储存表单信息
    setCookieInfo() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.checked) {
        this.setCookie('account', this.userName, 7);
        // base64加密密码
        let passWord = base64.encode(this.password);
        this.setCookie('password', passWord, 7);
        this.setCookie('remember', this.checked, 7);
      } else {
        this.setCookie('account', '');
        this.setCookie('password', '');
      }
    },
    // 获取cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=');
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(';', start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return '';
    },
    // 保存cookie
    setCookie(cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = cName + '=' + decodeURIComponent(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
    }
  }
};
</script>

<style lang="stylus">

</style>
