import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginStatus: null,
    user: null,
    mobilePopup: false,
    token: null
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
  },
  mutations: {
    //控制绑定手机弹窗
    switch_mobile_dialog(state, status) {
      state.mobilePopup = status;
    },
    changeLogin(state, status) {
      state.loginStatus = status;
      localStorage.setItem('loginStatus', status);
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
    setToken(state, data){
      state.token = data;
    }
  },
  actions: {
    LoginInfo(context) {
      // Axios
      //   .get("/xd-api/player-info")
      //   .then(res => {
      //     if (res.data.status == 403) {
      //       context.commit('changeLogin', false);
      //     }
      //     if (res.data.status != 403) {
      //       context.commit('setUserInfo', res.data.data);
      //       context.commit('changeLogin', res.data.status);
      //     }

      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
  }
})
