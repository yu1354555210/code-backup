<template>
	<view class="content">
		<view class="notify-item" v-for="(item,index) in dataList" :key="index">
			<view class="notify-title" v-text="item.type == 1 ? '举报成功' : '下架通知'"></view>
			<view class="notify-info" v-text="item.reason"></view>
			<view class="notify-content">
				<view class="notify-content-tit" v-text="item.user_name"></view>
				<view class="notify-content-text u-line-2" v-text="AES.Decrypt(item.text)"></view>
			</view>
		</view>
		
		<u-empty text="~ 无消息 ~" mode="data" :show="dataList.length === 0" margin-top="400" src=""></u-empty>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: ''
		};
	},
	mounted() {
		this.$nextTick(function(){
			this.getData();
		})
	},
	methods:{
		getData(){
			let sign = this.md5Libs.md5(`${this.signKey}`);
			this.$u
				.get('/api/master/v1/my_news', {
					token: this.vuex_token,
					sign: sign,
				})
				.then(res => {
					this.dataList = res;
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>

<style lang="stylus">
.content
	padding 0 24rpx
.notify-item
	padding 30rpx 0
	border-bottom 2rpx solid #DADCDB
	&:last-child
		border-bottom none
	.notify-title
		font-size 28rpx
		color #FE581E
		padding-left 24rpx
	.notify-info
		font-size 24rpx
		color #4A4C4C
		padding-left 24rpx
		margin 15rpx 0
	.notify-content
		height 144rpx
		background #FFFFFF
		border-radius 42rpx
		padding 20rpx 29rpx
		.notify-content-tit
			font-size 26rpx
			color #313331
		.notify-content-text
			font-size 24rpx
			color #4A4C4C
</style>
