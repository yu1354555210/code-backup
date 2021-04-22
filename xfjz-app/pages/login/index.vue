<template>
	<view>
		<view class="status-bar"><!-- 这里是状态栏 --></view>
		<view class="login-body">
			<image src="../../static/login-bg.png" mode="aspectFill" class="login-bg"></image>
			<view class="tourist-btn" @click="wechatLogin(1)"><image src="../../static/tourist-btn.png" mode="aspectFill"></image></view>
			<view class="login-box">
				<image src="../../static/logo.png" mode="aspectFill"></image>
				<text>多彩兼职</text>
				<view class="login-btn" @click="wechatLogin(0)"><image src="../../static/wechat-btn.png" mode="aspectFill"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			weixinCode: ''
		};
	},
	onLoad() {},
	methods: {
		...mapMutations(['login']),
		wechatLogin(type) {
			var _this = this;
			// #ifdef APP-PLUS
			var weixinService = null;
			// http://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.getServices
			plus.oauth.getServices(
				function(services) {
					console.log(services);
					if (services && services.length) {
						for (var i = 0, len = services.length; i < len; i++) {
							if (services[i].id === 'weixin') {
								weixinService = services[i];
								break;
							}
						}
						if (!weixinService) {
							console.log('没有微信登录授权服务');
							return;
						}
						// http://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.AuthService.authorize
						weixinService.authorize(
							function(event) {
								// console.log('event: ' + event);
								_this.weixinCode = event.code; //用户换取 access_token 的 code
								_this.ajaxLogin(type);
							},
							function(error) {
								console.error('authorize fail:' + JSON.stringify(error));
							},
							{
								// http://www.html5plus.org/doc/zh_cn/oauth.html#plus.oauth.AuthOptions
								// appid: 'wx797020d9bdb1c09d' //开放平台的应用标识。暂时填个假的充数，仅做演示。
								scope: 'snsapi_userinfo',
								state: 'authorize test'
							}
						);
					} else {
						console.log('无可用的登录授权服务');
					}
				},
				function(error) {
					console.error('getServices fail:' + JSON.stringify(error));
				}
			);
			// #endif
		},
		ajaxLogin(idf) {
			let plat = 2;
			let that = this;
			if (uni.getSystemInfoSync().platform == 'ios') {
				plat = 1;
			}
			// #ifdef APP-PLUS

			plus.device.getInfo({
				success: function(e) {
					let obj = JSON.parse(JSON.stringify(e));
					console.log('getDeviceInfo' + JSON.stringify(e));
					console.log('getDeviceInfo success: uuid=' + obj.uuid);
					uni.request({
						url: 'http://ubase.qianr.com/api/public/?service=CommonLogin.userLogin',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							code: that.weixinCode,
							version: that.$version,
							bundle_name: that.$package_name,
							sys: plat,
							channel: 'appstore',
							identification: idf, //微信登录, 1:游客登录,
							type: 'phone',
							uuid: obj.uuid
						},
						success: res => {
							console.log(res);
							that.login(res.data.data);
							uni.setStorageSync('uuid',obj.uuid);
						},
						fail: err => {
							console.log(err);
						},
						complete: () => {}
					});
				},
				fail: function(e) {
					console.log('getDeviceInfo failed: ' + JSON.stringify(e));
				}
			});

			// #endif
		}
	}
};
</script>

<style lang="less">
.login-bg {
	width: 750rpx;
	height: 1334rpx;
	position: absolute;
	left: 0;
	top: 0;
	z-index: -1;
}
.tourist-btn {
	position: absolute;
	top: 55rpx;
	right: 65rpx;
	width: 78rpx;
	height: 77rpx;
	image {
		height: 100%;
	}
}
.login-box {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 250rpx;
	image {
		width: 162rpx;
		height: 162rpx;
	}
	text {
		font-size: 30rpx;
		font-weight: bold;
		color: #ffffff;
		margin-top: 30rpx;
	}
	.login-btn {
		width: 650rpx;
		height: 88rpx;
		margin-top: 100rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
