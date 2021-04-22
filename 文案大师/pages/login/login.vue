<template>
	<view class="content">
		<image src="../../static/login-bg.png" mode="widthFix" class="login-bg"></image>
		<image src="../../static/logo.png" mode="widthFix" class="logo"></image>
		<button type="primary" @click="login" class="login-btn u-reset-button"><image src="../../static/wechat-btn.png" mode="widthFix"></image></button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: ''
		};
	},
	onLoad() {
	},
	methods: {
		getUserProfile(e) {
			// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
			// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		},
		login() {
			let _self = this;
			let plat = null;
			uni.getSystemInfoSync().platform == 'ios' ? (plat = 1) : (plat = 2);
			
			uni.getUserProfile({
				desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: info => {
					// console.log('info: ', info);
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							uni.showLoading({
								title: '登录中'
							});
							_self.$u
								.post('/api/master/v1/applets_login', {
									code: loginRes.code,
									type: 4,
									version: this.vuex_version,
									plat: plat,
									signature: info.signature,
									rawData: info.rawData,
									encryptedData: info.encryptedData,
									iv: info.iv
								})
								.then(res => {
									let user = {
										nickname: res.name,
										avatar: res.image,
										thumb_mark: res.thumb_mark,
										copy_mark: res.copy_mark
									};
					
									this.$u.vuex('vuex_user', user);
									this.$u.vuex('vuex_token', res.token);
									this.$u.vuex('vuex_is_login', true);
									this.$u.vuex('isLoginUrl', '');
					
									uni.hideLoading();
					
									setTimeout(() => {
										this.$u.route({
											type: 'tab',
											url: '/pages/index/index'
										});
									}, 300);
								})
								.catch(err => {
									// console.log("err: ",err);
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: '系统错误，请稍后重试'
									});
								});
						},
						fail: () => {
							uni.showToast({ title: '微信登录授权失败', icon: 'none' });
						}
					});
					
				},
				fail: () => {
					uni.showToast({ title: '微信登录授权失败', icon: 'none' });
				}
			});
			
		}
	}
};
</script>

<style lang="stylus">
.login-bg
	width 100%
	position absolute
	top 0
	z-index -1
.logo
	display block
	width 181rpx
	height 181rpx
	margin 260rpx auto 470rpx
.login-btn
	margin 0 auto
	width 272rpx
	height 84rpx
	display block
	border-radius 42rpx
	image
		width 100%
</style>
