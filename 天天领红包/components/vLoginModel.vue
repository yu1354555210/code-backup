<template>
	<view class="cu-modal" :class="getLoginDialogStatus ? 'show' : ''" @click="setLoginDialogStatus(false)">
		<view class="dialog-wrapper login-dialog-wrapper" @click.stop="">
			<view class="login-dialog-title">请先登录</view>
			<view class="login-dialog-btn">
				<button type="default" @click.stop="setLoginDialogStatus(false)">取消</button>
				<button type="primary" @getuserinfo="appLoginWeixin()" open-type="getUserInfo" lang="zh_CN">确定</button>
			</view>
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
		...mapState(['userName', 'avatarUrl', 'loginStatus', 'loginDialogStatus']),
		...mapGetters(['getInfo', 'getLoginStatus', 'getLoginDialogStatus', 'getInviteCode'])
	},
	onShow() {},
	methods: {
		...mapMutations(['login', 'logout', 'setLoginDialogStatus']),
		appLoginWeixin() {
			let _self = this;
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					_self.authorization = loginRes.code;
					uni.getUserInfo({
						provider: 'weixin',
						success: info => {
							//这里请求接口

							_self.$http
								.post('/api/bonus/v1/login', {
									code: loginRes.code,
									encrypted_data: info.encryptedData,
									iv: info.iv,
									parent_code: this.getInviteCode
								})
								.then(res => {
									if (res.data.status == 200) {
										let data = res.data.data;
										console.log("data: ",data);
										_self.login(data);
										setTimeout(() => {
											_self.setLoginDialogStatus(false);
										}, 30);
									} else {
										uni.showToast({
											icon: 'none',
											title: res.data.msg
										});
									}
								})
								.catch(err => {
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
.login-dialog-wrapper
	width 500rpx
	height 300rpx
	padding 0
	overflow hidden
	border-radius 10rpx
	.login-dialog-title
		flex 1
		display flex
		align-items center
		font-size 30rpx
	.login-dialog-btn
		display flex
		width 100%
		border-top 1rpx solid #EEEEEE
		button
			flex 1
			border none
			border-radius initial
			font-size 30rpx
			&:first-child
				background-color #FFFFFF
			&::after
				display none
</style>
