<script>
	var aldstat = require("./utils/ald-stat.js"); //app.js

	export default {
		globalData: {
			stj: require("./utils/stj-sdk.js"),
			userInfo: null,
			apiUrl: 'https://luck.qianr.com/',
			openid: null,
			AppKey: 'XQPjXDKVclAX5oMFPCFo-1x-q0YFxTRAaQfrFLZPDwMV5aw1fzAiKS__',
			shareOpenid: null,
			shareAwardId: null
		},
		onLaunch: function(options) {
			// 展示本地存储能力
			var logs = wx.getStorageSync('logs') || [];
			logs.unshift(Date.now());
			wx.setStorageSync('logs', logs); // 登录
			
			
				console.log(options);
			if(options.scene == 1007 || options.scene == 1008){
				this.$options.globalData.shareOpenid = options.query.sid;
				this.$options.globalData.shareAwardId = options.query.awardId;
			}
			
			uni.login({
			  provider: 'weixin',
			  success: loginRes=> {
				uni.request({
					url: this.$options.globalData.apiUrl + 'api/public/?service=CommonLogin.getCode',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						js_code: loginRes.code
					},
					success: res => {
						if(res.data.code == 1){
							this.$options.globalData.openid = res.data.data.sid;
						}
					},
					fail: res => {
						console.log(res)
					},
					complete: () => {}
				});
			  }
			});

			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						wx.getUserInfo({
							success: res => {
								// 可以将 res 发送给后台解码出 unionId
								this.$options.globalData.userInfo = res.userInfo; // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况

								if (this.userInfoReadyCallback) {
									this.userInfoReadyCallback(res);
								}
							}
						});
					}
				}
			});
		},
		onShow: function() {},
		methods: {
		}
	};
</script>
<style>
	@import "./app.css";
</style>
