import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
import router from '@/router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginPopup: false,
    isLoginPopup: true,
    popupToggle: false,
    helpPopup: false,
    focusPopup: false,
    loginStatus: null,
    user: null,
    openid: null,
    isShowTabBar: false,
    diamond: null,
    addressData: "",
    mobilePopup: false,
    redirect: '/',
    token: null,
    game_unit: null
  },
  getters: {
    getLoginStatus(state) {
      //先从state里面获取用户登录状态
      let loginStatus = state.loginStatus;
      //如果 state 里面获取不到，那么从localStorage里面获取
      if (!loginStatus) {
        loginStatus = JSON.parse(localStorage.getItem('loginStatus') || false);
      }
      return loginStatus;
    },
    getUserInfo(state) {
      let userInfo = state.user;
      if (!userInfo) {
        userInfo = JSON.parse(localStorage.getItem('playerInfo') || null);
      }
      return userInfo;
    },
    getToken(state) {
      let token = state.token;
      if (!token) {
        token = JSON.parse(localStorage.getItem('token') || null);
      }
      return token;
    },
    getOpenid(state) {
      let openid = state.openid;
      if (!openid) {
        openid = JSON.parse(localStorage.getItem('openid') || null);
      }
      return openid;
    },
    getGameUnit(state) {
      let game_unit = state.game_unit;
      if (!game_unit) {
        game_unit = JSON.parse(localStorage.getItem('game_unit') || null);
      }
      return game_unit;
    },
  },
  mutations: {
    changeLogin(state, status) {
      state.loginStatus = status;
      localStorage.setItem('loginStatus', status);
    },
    switch_redirect(state, status) {
      state.redirect = status;
    },
    //控制弹窗
    switch_dialog(state, status) {
      state.popupToggle = status;
    },
    removeLogin(state) {
      state.loginStatus = false;
      localStorage.removeItem('loginStatus');
    },
    setUserInfo(state, data) {
      state.user = data;
      localStorage.setItem("playerInfo", JSON.stringify(data));
    },
    removeUserInfo(state) {
      state.user = null;
      localStorage.removeItem('playerInfo');
    },
    setOpenid(state, data){
      state.openid = data;
      localStorage.setItem("openid", JSON.stringify(data));
    },
    setToken(state, data){
      state.token = data;
      localStorage.setItem("token", JSON.stringify(data));
    },
    setGameUnit(state, data){
      state.game_unit = data;
      localStorage.setItem("game_unit", JSON.stringify(data));
    },
    removeToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
    removeGameUnit(state) {
      state.game_unit = null;
      localStorage.removeItem('game_unit');
    },
    removeOpenid(state) {
      state.openid = null;
      localStorage.removeItem('openid');
    }
  },
  actions: {
    checkToken({ getters }){
      if(getters.getToken){
        Axios
        .get("/user/exits",{
          params: {
            token: getters.getToken
          }
        })
        .then(res => {
           if(res.data.code == 0){
             console.log(this);
             setTimeout(() => {
               this.dispatch('outLogin');
             }, 1000);
             Vue.$vux.toast.text('token过期,请重新登录');
           }
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
    outLogin({ commit }){
      commit('removeLogin');
      commit('removeUserInfo');
      commit('removeGameUnit');
      commit('removeToken');
      router.push({
        path: '/login'
      })
    }
  }
})
