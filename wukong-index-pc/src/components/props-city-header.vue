<template>
  <div>
    <header class="props-city-header">
      <div class="header-main">
        <nav class="nav-list">
          <ul>
            <li v-for="(item, index) in propsHeaderArr" :key="index" @click="tapPropsHeader(item.game_id,index)">
              <a href="javascript:;" v-text="item.game_title" :class="indexCur == index ? 'cur' : ''"></a>
              <span v-if="index != propsHeaderArr.length - 1">.</span>
            </li>
          </ul>
        </nav>
        <div class="login-box">
          <div class="login-before" v-if="!getLoginStatus"><a href="javascript:;" class="login-btn" @click="isShowloginPopup = true">登录</a></div>
          <div class="login-after" v-else @mouseover="isShow = true" @mouseout.stop="isShow = false" style="display: ;">
            <div class="login-avatar"><img src="../assets/img/login-avatar.png" alt="" /></div>
            <div class="login-name" v-text="getUserInfo.username"></div>

            <div class="dropdown-list" @mouseover="isShow = true" :class="isShow == true ? 'show' : ''">
              <dl>
                <dt>
                  <span>已绑定</span>
                  <a href="javascript:;" @click="outLogin">解除账号</a>
                </dt>
                <dd v-if="getGameHeaderIndex != 0"><a href="javascript:;" @click="toRouter('/pay')">充值妖晶</a></dd>
                <dd v-if="getGameHeaderIndex != 0"><a href="javascript:;" @click="toRouter('/pay-gift')">超值礼包</a></dd>
                <dd v-if="getGameHeaderIndex != 0"><a href="javascript:;" @click="toRouter('/rebate')">领取累计充值返利</a></dd>
                <dd><a href="#" @click="toRouter('/order-list')">我的订单</a></dd>
                <dd><a target="_blank" href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed">在线客服</a></dd>
                <dd><a href="javascript:;" @click="outLogin">退出登录</a></dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="this-winpop-container" v-if="isShowloginPopup" @click.self="isShowloginPopup = false">
      <div class="this-winpop-wrapper">
        <div class="this-winpop-top">
          <h2>登录</h2>
          <router-link to="/find-pwd">忘记密码</router-link>
        </div>
        <div class="this-winpop-form">
          <div class="this-input">
            <div class="form-name">手机号码</div>
            <input type="text" name="" v-model="userName" value="" class="input" />
          </div>
          <div class="error"><span></span></div>
          <div class="this-input">
            <div class="form-name">密码</div>
            <input type="password" name="" v-model="password" value="" class="input" />
          </div>
          <div class="error"><span></span></div>
          <a href="javascript:void(0);" class="form-btn" @click="login">登 录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
  data() {
    return {
      userName: '',
      password: '',
      isShow: false,
      isShowloginPopup: false,
      propsHeaderArr: [],
      indexCur: ''
    };
  },
  computed:{
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken','getGameHeaderIndex']),
  },
  mounted() {
    this.$nextTick(function(){
      this.getNavList();
      this.indexCur = this.getGameHeaderIndex;
    });
  },
  methods: {
    ...mapMutations(['removeLogin', 'setUserInfo', 'setToken', 'setGameUnit','changeLogin','changeGameHeader']),
    tapPropsHeader(id,index) {
      this.indexCur = index;
      let obj = {
        id,
        index
      }
      this.changeGameHeader(obj);
      this.$router.push('/props-city');
      this.$emit('headerEvent',obj);
    },
    toRouter(url){
      this.isShow = false;
      this.$router.push({
        path: url
      })
    },
    getNavList(){
      this.$ajax
        .get('/game/index')
        .then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            this.propsHeaderArr = data;
          }else{
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text('系统错误，请稍后重试');
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
            this.isShowloginPopup = false;
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
  }
};
</script>

<style></style>
