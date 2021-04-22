<template>
	<view class="agreement-container">
		<rich-text :nodes="content"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			};
		},
		onLoad() {
			this.$nextTick(function(){
				this.getData();
			})
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			return {
				title: '大奖天天抽',
				path: '/pages/index/index'
			};
		},
		methods: {
			getData() {
				uni.showLoading({
					title:'加载中'
				});
				uni.request({
					url: getApp().globalData.apiUrl	+ 'api/set/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						api_name: 'get_user_agreement'
					},
					success: res => {
						if(res.data.code == 1){
							this.content = res.data.data
							uni.hideLoading();
						}else{
							uni.showToast({
								title: res.data.msg
							});
							uni.hideLoading();
						}
					},
					fail: (res) => {
						uni.showToast({
							title: res.data.msg
						});
						uni.hideLoading();
					},
					complete: () => {}
				});
			}
		},
	}
</script>

<style lang="less">
	.agreement-container{
		padding: 70rpx;
	}
</style>
