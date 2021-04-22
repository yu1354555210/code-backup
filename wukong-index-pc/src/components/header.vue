<template>
  <header class="header">
    <div class="header-main">
      <router-link  class="logo" to="/"><img src="../assets/img/logo.png" /></router-link>
      <nav class="nav-list">
        <router-link to="/">首页</router-link>
        <span>.</span>
        <router-link to="/service">服务中心</router-link>
        <span>.</span>
        <router-link to="/props-city" :class="flag ? 'router-link-exact-active': ''">藏宝阁</router-link>
        <span>.</span>
        <router-link to="/activity">福利</router-link>
        <!-- <span>.</span> -->
        <!-- <router-link to="/">联系我们</router-link> -->
      </nav>
      <div class="nav-toggle" @click="navToggle"><i></i></div>
    </div>
    <div class="header-game-list" v-show="toggleStatus" @mouseover.stop="toggleStatus = true" @mouseout.stop="toggleStatus = false">
      <div class="content">
        <ul>
          <li v-for="(item,index) in gameListArr" :key="index">
            <a :href="item.link">
              <img :src="item.logo" />
              <p v-text="item.title"></p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      toggleStatus: false,
      gameListArr: [],
      flag: false
    }
  },
	watch: {
	'$route' (to, from) {
    let path = this.$route.path;
		if(path == '/pay' || path == '/pay-gift'|| path == '/game-around-pay'|| path == '/game-around-detail') {
			this.flag = true;
		}else{
      this.flag = false;
    }
	}
},
  mounted() {
    this.$nextTick(function(){
      this.getGameList();
    });
  },
  methods:{
    navToggle(){
      this.toggleStatus = !this.toggleStatus;
    },
    getGameList(){
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 4,
          }
        })
        .then(res => {
          let data = res.data.data;
          this.gameListArr = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>

<style></style>
