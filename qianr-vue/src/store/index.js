import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginPopup: false,
    isLoginPopup: true,
    giftToggle: false,
    helpPopup: false,
    focusPopup: false,
    loginStatus: null,
    user: {},
    openid: null,
    isShowTabBar: false,
    diamond: null,
    addressData: "",
    mobilePopup: false,
    redirect: '/'
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
      console.log(userInfo);
      return userInfo;
    },
    getOpenid(state) {
      let openid = state.openid;
      if (!openid) {
        openid = JSON.parse(localStorage.getItem('openid') || null);
      }
      return openid;
    },
    getDiamond(state) {
      let diamond = state.diamond;
      if (!diamond) {
        diamond = JSON.parse(localStorage.getItem('diamond') || null);
      }
      return diamond;
    },
    getAddress(state) {
      let addressData = state.addressData;
      if (!addressData) {
        addressData = JSON.parse(localStorage.getItem('addressData') || null);
      }
      return addressData;
    }
  },
  mutations: {
    //控制登录弹窗
    switch_login_dialog(state, status) {
      state.loginPopup = status;
    },
    //控制登录弹窗2
    switch_form_dialog(state, status) {
      state.isLoginPopup = status;
    },
    //控制礼包弹窗
    switch_gift_dialog(state, status) {
      state.giftToggle = status;
    },
    //控制绑定手机弹窗
    switch_mobile_dialog(state, status) {
      state.mobilePopup = status;
    },
    switch_help_dialog(state, status) {
      state.helpPopup = status;
    },
    switch_focus_dialog(state, status) {
      state.focusPopup = status;
    },
    changeLogin(state, status) {
      state.loginStatus = status;
      localStorage.setItem('loginStatus', status);
    },
    switch_redirect(state, status) {
      state.redirect = status;
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
    removeOpenid(state) {
      state.openid = null;
      localStorage.removeItem('openid');
    },
    changeShowTabBar(state, data){
      state.isShowTabBar = data;
    },
    setDiamond(state, data) {
      state.diamond = data;
      localStorage.setItem("diamond", JSON.stringify(data));
    },
    removeDiamond(state) {
      state.diamond = null;
      localStorage.removeItem('diamond');
    },
    getAddressData(state, data) {
      state.addressData = data;
      localStorage.setItem("addressData", JSON.stringify(data));
    },
  },
  actions: {
    LoginInfo(context) {
      Axios
        .get("/xd-api/player-info")
        .then(res => {
          if (res.data.status == 403) {
            context.commit('changeLogin', false);
          }
          if (res.data.status != 403) {
            context.commit('setUserInfo', res.data.data);
            context.commit('changeLogin', res.data.status);
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    myDiamond(context) {
      Axios
        .get("/xd-shop/my-diamond")
        .then(res => {
          if (res.data.status == 0) {
            context.commit('setDiamond', null);
          } else if (res.data.status == 1) {
            context.commit('setDiamond', res.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    isOpenid(context) {
      Axios
        .get("/xd-api/wx-openid")
        .then(res => {
          if (res.data.status == 0) {
            context.commit('setOpenid', null);
          } else if (res.data.status == 1) {
            context.commit('setOpenid', true);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAddressData(context) {
      Axios
        .get("/xd-shop/my-address")
        .then(res => {
          let data = res.data.data;
          if (res.data.status == 0) {
            context.commit('getAddressData', null);
          } else if (res.data.status == 1) {
            context.commit('getAddressData', data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
})
