import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: null,
		hasLogin: false,
		loginProvider: "",
		openid: null
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
			uni.setStorageSync('playerInfo', JSON.stringify(provider))
			uni.setStorageSync('loginStatus', true)
		},
		setToken(state, token){
			state.token = token;
			uni.setStorageSync('token', token)
		},
		logout(state) {
			state.hasLogin = false
			uni.clearStorageSync()
			state.openid = null
		},
		setOpenid(state, openid) {
			state.openid = openid
		}
	},
	getters: {
		getLoginStatus(state) {
			//先从state里面获取用户登录状态
			let loginStatus = state.hasLogin;
			//如果 state 里面获取不到，那么从localStorage里面获取
			if (!loginStatus) {
				loginStatus = JSON.parse(uni.getStorageSync('loginStatus') || false);
			}
			return loginStatus;
		},
		getUserInfo(state) {
			let userInfo = state.loginProvider;
			if (!userInfo) {
				userInfo = JSON.parse(uni.getStorageSync('playerInfo') || null);
			}
			return userInfo;
		},
		token(state) {
			let token = state.token;
			if (!token) {
				token = uni.getStorageSync('token') || null;
			}
			return token;
		},
	},
	actions: {
		// lazy loading openid
		getUserOpenId: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function() { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' + openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
