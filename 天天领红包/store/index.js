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
		user: null,
		dialogStatus: false,
		loginDialogStatus: false,
		inviteCode: '',
	},
	getters: {
		token(state) {
			let token = state.token;
			if (!token) {
				token = uni.getStorageSync('token') || null;
				// #ifdef H5
				token = '6bfe1cf240cc5f6e8576230777336cee';
				// #endif
			}
			return token;
		},
		getInfo(state) {
			let user = state.user;
			if (!user) {
				user = uni.getStorageSync('userInfo') || null;
			}
			return user;
		},
		getInviteCode(state) {
			let inviteCode = state.inviteCode;
			if (!inviteCode) {
				inviteCode = uni.getStorageSync('inviteCode') || null;
			}
			return inviteCode;
		},
		getLoginStatus(state) {
			let loginStatus = state.loginStatus;
			if (!loginStatus) {
				loginStatus = uni.getStorageSync('loginStatus') || false;
			}
			return loginStatus;
		},
		getDialogStatus(state) {
			let dialogStatus = state.dialogStatus;
			if (!dialogStatus) {
				dialogStatus = uni.getStorageSync('dialogStatus') || false;
			}
			return dialogStatus;
		},
		getLoginDialogStatus(state) {
			let loginDialogStatus = state.loginDialogStatus;
			if (!loginDialogStatus) {
				loginDialogStatus = false;
			}
			return loginDialogStatus;
		},
	},
	mutations: {
		login(state, provider) {
			state.loginStatus = true;
			state.user = provider;
			state.token = provider.token;
			uni.setStorageSync('userInfo', provider);
			uni.setStorageSync('loginStatus', true);
			uni.setStorageSync('token', provider.token);
		},
		logout(state) {
			state.loginStatus = false;
			state.user = null;
			state.token = '';
			state.inviteCode = '';
			uni.clearStorageSync();
		},
		setInviteCode(state, code) {
			state.inviteCode = code;
			uni.setStorageSync('inviteCode', code);
		},
		setDialogStatus(state, status = true) {
			state.dialogStatus = status;
			uni.setStorageSync('dialogStatus', status);
		},
		setLoginDialogStatus(state, status = true) {
			state.loginDialogStatus = status;
		},
	}
})

export default store
