import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: '',  //6bfe1cf240cc5f6e8576230777336cee
		avatarUrl: '',
		nickname: '',
		mobile: '',
		tags: '',
		city: '获取位置',
		// #ifdef H5
		city: '北京',
		// #endif
		tipsPopup: false
	},
	getters: {
		getCity(state) {
			let city = state.city;
			if (!city) {
				city = uni.getStorageSync('city') || null;
			}
			return city;
		},
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
		nickname(state) {
			let nickname = state.nickname;
			if (!nickname) {
				nickname = uni.getStorageSync('nickname') || null;
			}
			return nickname;
		},
		mobile(state) {
			let mobile = state.mobile;
			if (!mobile) {
				mobile = uni.getStorageSync('mobile') || null;
			}
			return mobile;
		},
		tags(state) {
			let tags = state.tags;
			if (!tags) {
				tags = uni.getStorageSync('tags') || null;
			}
			return tags;
		},
		avatarUrl(state) {
			let avatarUrl = state.avatarUrl;
			if (!avatarUrl) {
				avatarUrl = uni.getStorageSync('avatarUrl') || null;
				// #ifdef H5
				avatarUrl = '../../static/avatar.png';
				// #endif
			}
			return avatarUrl;
		}
	},
	mutations: {
		setCity(state, city) {
			state.city = city;
			uni.setStorageSync('city', city);
		},
		setMobile(state, mobile) {
			state.mobile = mobile;
			uni.setStorageSync('mobile', mobile);
		},
		setNickname(state, nickname) {
			state.nickname = nickname;
			uni.setStorageSync('nickname', nickname);
		},
		setTag(state, tags) {
			state.tags = tags;
			uni.setStorageSync('tags', tags);
		},
		updateAvatar(state, avatar) {
			state.avatarUrl = avatar;
			uni.setStorageSync('avatarUrl', avatar);
		},
		login(state, provider) {
			console.log('provider: ', provider)
			state.token = provider.token;
			state.nickname = provider.nickname;
			state.avatarUrl = provider.avatar;
			uni.setStorageSync('token', provider.token);
			uni.setStorageSync('nickname', provider.nickname);
			uni.setStorageSync('avatarUrl', provider.avatar);
			if(provider.token){
				uni.redirectTo({
					url: '../index/index'
				})
			}
		},
		logout(state) {
			state.token = '';
			state.nickname = '';
			state.avatarUrl = '';
			state.mobile = '';
			state.tags = '';
			uni.clearStorageSync();
			uni.navigateTo({
				url: '../login/index'
			})
			
		},
		//控制弹窗
		switch_tips_dialog(state, status) {
			state.tipsPopup = status;
		},
	}
})

export default store
