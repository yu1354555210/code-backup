<template>
	<view>
		<view class="login-box">
			<image src="../../static/login-bg.png" mode="aspectFill" class="login-bg"></image>
			<button class="login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="appLoginQq">
				<image src="../../static/login-btn.png" mode="aspectFill"></image>
			</button>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(['userName', 'avatarUrl', 'loginStatus']),
		...mapGetters(['getInfo', 'getLoginStatus'])
	},
	onShow() {
		if (this.getLoginStatus) {
			uni.switchTab({
				url: '../index/index'
			});
		}
	},
	methods: {
		...mapMutations(['login', 'logout']),
		appLoginQq() {
			let _self = this;
			// #ifdef MP-QQ
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					if (~res.provider.indexOf('qq')) {
						uni.login({
							provider: 'qq',
							success: res => {
								_self.authorization = res.code;
								uni.getUserInfo({
									provider: 'qq',
									success: info => {
										//这里请求接口
										info = info.userInfo;
										uni.request({
											url: _self.apiUrl + '/api/master/v1/qq_login',
											method: 'POST',
											header: {
												'content-type': 'application/x-www-form-urlencoded'
											},
											data: {
												code: res.code,
												avatar: info.avatarUrl,
												user_name: info.nickName
											},
											success: res => {
												if (res.data.status == 200) {
													let data = res.data.data;
													_self.login(data);
													setTimeout(() => {
														uni.switchTab({
															url: '../index/index',
															complete() {
																uni.showTabBar();
															}
														});
													}, 30);
												} else {
													uni.showToast({
														title: res.data.msg
													});
												}
											},
											fail: () => {
												uni.showToast({
													title: '系统错误，请稍后重试'
												});
											},
											complete: () => {}
										});
									},
									fail: () => {
										uni.showToast({ title: 'QQ登录授权失败', icon: 'none' });
									}
								});
							},
							fail: () => {
								uni.showToast({ title: 'QQ登录授权失败', icon: 'none' });
							}
						});
					} else {
						uni.showToast({
							title: '请先安装QQ或升级版本',
							icon: 'none'
						});
					}
				}
			});
			//#endif
		}
	}
};
</script>

<style lang="stylus">
.login-btn
	width 550rpx
	height 84rpx
	position absolute
	bottom 140rpx
	left 50%
	transform translateX(-50%)
	image
		width 100%
		height 100%
		overflow hidden
		border-radius 200rpx
	&::after
		display none
.login-bg
	position absolute
	width 100%
	height 100%
	z-index -1
</style>
