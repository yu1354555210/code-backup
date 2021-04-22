<template>
	<view>
		<image class="login-bg" src="/static/images/login-bg.jpg" mode="aspectFill"></image>
		<button class="login-btn" type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo" plain="true">
			<image src="/static/images/login-btn.png" mode="aspectFill"></image>
		</button>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		...mapMutations(['setOpenid','login']),
		bindGetUserInfo: function(e) {
			let plat = 1;
			if (uni.getSystemInfoSync().platform == 'android') {
				plat = 2;
			}
			if (e.detail.userInfo) {
				//用户按了允许授权按钮
				// 获取到用户的信息了，打印到控制台上看下
				uni.request({
					url: getApp().globalData.apiUrl + 'api/pchoujiang/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						api_name: 'userLogin',
						signature: e.detail.signature,
						rawData: e.detail.rawData,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						sys: plat,
						sid: getApp().globalData.openid
					},
					success: res => {
						let data = res.data.data;
						if (res.data.code == 1) {
							try {
								this.login(data);
								console.log("shareOpenid: " + getApp().globalData.shareOpenid);
								if(getApp().globalData.shareOpenid){
									this.shareData(data.token);
								}
								uni.switchTab({
									url: '../index/index'
								});
							} catch (e) {
								console.log(e);
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
					},
					fail: res => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {}
				});
				//授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
				this.isHide = false;
			} else {
				//用户按了拒绝按钮
				wx.showModal({
					title: '警告',
					content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
					showCancel: false,
					confirmText: '返回授权',
					success: function(res) {
						// 用户没有授权成功，不需要改变 isHide 的值
						if (res.confirm) {
							console.log('用户点击了“返回授权”');
						}
					}
				});
			}
		},
		shareData(token){
			console.log("token: " + token);
			uni.request({
				url: getApp().globalData.apiUrl + 'api/pchoujiang/api',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				},
				data: {
					token: token,
					api_name: 'share_success',
					openid: getApp().globalData.shareOpenid,
					choujiang_id: getApp().globalData.shareAwardId
				},
				success: res => {
					console.log('邀请新用户')
					console.log(res)
					// uni.showToast({
					// 	title: res.data.msg
					// });
				},
				fail: res => {
					uni.showToast({
						title: res.data.msg
					});
				},
				complete: () => {}
			});
		}
	}
};
</script>
<style lang="less">
.login-bg {
	width: 750rpx;
	height: 1334rpx;
	position: fixed;
	background-size: 100% 100%;
	z-index: -1;
	overflow: hidden;
}

.login-btn {
	width: 566rpx;
	height: 146rpx;
	position: absolute;
	top: 997rpx;
	left: 50%;
	transform: translateX(-50%);
	display: block;
	padding: 0;
	border: 0 !important;
	image {
		height: 100%;
	}
}
</style>
