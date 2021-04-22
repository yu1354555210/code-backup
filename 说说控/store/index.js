import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		loginStatus: false,
		token: '',
		avatarUrl: '',
		userName: '',
		uid: '',
		user: null
	},
	getters:{
		getInfo(state) {
		  let user = state.user;
		  if (!user) {
		    user = uni.getStorageSync('userInfo') || null;
		  }
		  return user;
		},
		getLoginStatus(state){
			let loginStatus = state.loginStatus;
			if (!loginStatus) {
			  loginStatus = uni.getStorageSync('loginStatus') || false;
			}
			return loginStatus;
		}
	},
	mutations: {
		login(state, provider) {
			state.loginStatus = true;
			state.user = provider;
			uni.setStorageSync('userInfo', provider);
			uni.setStorageSync('loginStatus', true);
		},
		logout(state) {
			state.loginStatus = false;
			state.user = null;
			uni.clearStorageSync();
		}
	}
})

export default store