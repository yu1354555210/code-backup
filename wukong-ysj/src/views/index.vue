<template>
  <div class="wrapper">
    <div class="mine-section">
      <div class="mine-avatar">
        <img src="../assets/img/default-avatar.png">
      </div>
      <div class="mine-info">
        <div class="login-before" v-if="!getLoginStatus">
          <p>绑定悟空游戏账号，充值省钱又省力</p>
          <router-link to="/login" class="btn">立即绑定</router-link>
        </div>
        <div class="login-after" v-else>
          <div class="nickname">{{getUserInfo.username}}(uid:{{getUserInfo.uid}})</div>
        </div>
      </div>
    </div>
    <div class="mine-list" v-if="getLoginStatus">
      <div class="mine-item bind-item">
        <div>绑定状态：<div class="bind-tag">已绑定</div>
        </div>
        <a href="javascript:void(0);" class="unbind-btn" @click="outLogin">解绑账号</a>
      </div>
    </div>
    <div class="mine-list">
      <div class="mine-item bind-item" v-for="(item,index) in menuList" :key="index">
         <router-link :to="'/'+item.key" class="mine-item-link" v-text="item.value"></router-link>
      </div>
    </div>
    <div class="mine-list">
      <div class="mine-item bind-item">
        <a href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed" class="mine-item-link">在线客服</a>
      </div>
      <div class="mine-item bind-item">
        <a href="javascript:void(0);" class="mine-item-link" @click="$vux.toast.text('暂未开放')">帮助</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapMutations,
    mapState,
    mapGetters,
    mapActions
  } from "vuex";
  export default {
    data() {
      return {
        userInfo: [],
        menuList: []
      }
    },
    computed:{
      ...mapGetters(["getLoginStatus","getUserInfo","getGameUnit","getToken"])
    },
    mounted() {
      this.$nextTick(function(){
        this.UnitParams();
      });
    },
    methods:{
      ...mapMutations(['removeLogin','removeUserInfo','removeGameUnit','setGameUnit']),
      // outLogin(){
      //   this.removeLogin();
      //   this.removeUserInfo();
      //   this.removeGameUnit();
      //   this.$router.push({
      //     path: '/login'
      //   })
      // },
      // checkToken(){
      //   this.$ajax
      //     .get("/user/exits",{
      //       params: {
      //         token: this.getToken
      //       }
      //     })
      //     .then(res => {
      //        if(res.data.code == 0){
      //          setTimeout(() => {
      //            this.outLogin();
      //          }, 1000);
      //          this.$vux.toast.text('token过期,请重新登录');
      //        }
      //     })
      //     .catch(error => {
      //       console.log(error);
      //     });
      // },
      UnitParams(){
        this.$ajax
          .get("/main/params",{
            params: {
              game_id: this.game_id
            }
          })
          .then(res => {
             let data = res.data.data;
             this.menuList = data.menu;
             this.setGameUnit(data.game_unit);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
</script>

<style>
</style>
