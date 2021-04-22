<template>
	<view class="content">
		<view class="redbags">
			<image src="../../static/hb-bg.png" mode="aspectFill" class="redbags-bg"></image>
			<view class="redbags-fl">
				<view class="redbags-info">
					<view>当前红包余额</view>
					<view class="redbags-num"><text v-text="money"></text>元</view>
				</view>
			</view>
			<view class="redbags-fr">
				<image src="../../static/cash-btn.png" mode="aspectFill" @click="toCash"></image>
			</view>
		</view>
		<view class="redbags-rules">
			<view class="redbags-title">
				<image src="../../static/redbags-title.png" mode="aspectFill"></image>
			</view>
			<view class="redbags-rules-list">
				<text>1、获得红包后直接汇总成红包余额</text>
				<text>2、余额永久有效，可随时提现</text>
				<text>3、余额只支持提现到微信</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: ''
			};
		},
		mounted() {
			this.$nextTick(function(){
				this.$http.get('/bargain_v1/user/envelope',{
					params:{
						token: this.$store.getters.token
					}
				})
					.then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							let data = res.data.data;
							this.money = data.money.toFixed(2);
						}
					}).catch(err => {
						console.log(err);
					})
			})
		},
		methods:{
			toCash(){
				if(this.money > 0){
					uni.navigateTo({
						url: '../cash/index'
					})
				}else{
					uni.showToast({
						icon: 'none',
						title:'没有钱怎么提现呢?'
					})
				}
			}
		}
	}
</script>

<style lang="stylus">
.content
	padding 15rpx
	.redbags
		width 718rpx
		height 324rpx
		display flex
		justify-content space-between
		align-items center
		border-radius 20rpx
		position relative
		padding 30rpx
		.redbags-bg
			position absolute
			z-index -1
			height 100%
			left 0
			top 0
	.redbags-fl
		font-size 30rpx
		color #ffffff
		.redbags-num
			margin-top 30rpx
			text
				font-size 80rpx
	.redbags-fr
		image
			width 200rpx
			height 60rpx
.redbags-rules
	margin-top 30rpx
	.redbags-title
		image
			width 254rpx
			height 35rpx
	.redbags-rules-list
		font-size 26rpx
		margin-top 20rpx
		text
			display block
			margin-bottom 20rpx
</style>
