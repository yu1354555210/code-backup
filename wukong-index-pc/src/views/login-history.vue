<template>
  <div>
    <section class="service-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/service' }">服务中心</el-breadcrumb-item>
          <el-breadcrumb-item>查看登录历史</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <layout-login></layout-login>
      <div class="service-main this-section">
        <div class="service-right-form-box">
          <div class="this-title mobile-title">
            <i class="el-icon-back" @click="goBack" v-if="isShowBack"></i>
            查看<span>登录历史</span>
          </div>
          <h3 class="bind-user">当前绑定手机号：{{getUserInfo.mobile}}</h3>
          <div class="login-history" v-if="isShowGameList">
            <div class="title dashed-title"><span><i></i>玩过的游戏</span></div>
            <ul>
            	<li v-for="(item,index) in gameListArr" :key="index">
                <a href="javascript:;" @click="viewHistory(item.game_id)">
                  <img :src="item.logo" alt="">
                  <p v-text="item.title"></p>
                </a>
              </li>
            </ul>
          </div>
          <div class="login-history-info" v-if="isShowHistoryList">
            <ul>
            	<li v-for="(item, index) in historyLogArr" :key="index">
                <span>最近登录IP： {{item.ip}}</span>
                <span v-text="item.country"></span>
                <span>登录时间： {{item.login_time}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import layoutLogin from '@/components/layout-login.vue';
export default {
  data() {
    return {
      gameListArr:[],
      isShowHistoryList: false,
      isShowGameList: true,
      historyLogArr: [],
      isShowBack: false
    };
  },
  components:{
    layoutLogin
  },
  watch:{
    isShowHistoryList(val){
      this.isShowBack = this.isShowHistoryList;
    }
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken'])
  },
  mounted() {
    this.$nextTick(function() {
      this.getGameList();
    });
  },
  methods: {
    ...mapMutations(['removeLogin', 'removeUserInfo', 'removeGameUnit', 'setGameUnit']),
    getGameList(){
      this.$ajax
        .get('/user/game-list', {
          params: {
            token: this.getToken
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.gameListArr = res.data.data;
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    viewHistory(id){
      this.$ajax
        .get('/user/game-login-log', {
          params: {
            game_id: id,
            token: this.getToken,
            page: 1
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.historyLogArr = res.data.data;
            this.isShowHistoryList = true;
            this.isShowGameList = false;
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goBack(){
      this.isShowHistoryList = false;
      this.isShowGameList = true;
    }
  }
};
</script>

<style lang="stylus">
.el-icon-back
  position absolute
  left 0
  cursor pointer
  font-size 28px
</style>
