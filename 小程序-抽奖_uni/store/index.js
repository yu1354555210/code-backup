import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: '',
		avatarUrl: '',
		userName: '',
		openid: null
	},
	getters: {
		getOpenid(state) {
			let openid = state.openid;
			if (!openid) {
				openid = uni.getStorageSync('openid') || null;
			}
			console.log(openid);
			return openid;
		}
	},
	mutations: {
		login(state, provider) {
			console.log(state)
			console.log(provider)
			state.token = provider.token;
			state.userName = provider.userName;
			state.avatarUrl = provider.avatarUrl;
			state.openid = provider.openid;
			uni.setStorageSync('token', provider.token);
			uni.setStorageSync('openid', provider.openid);
		},
		logout(state) {
			state.token = '';
			state.userName = '';
			state.avatarUrl = '';
			state.openid = '';
			uni.clearStorageSync();
			uni.navigateTo({
				url:'../login/index'
			})
		},
	}
})

export default store
