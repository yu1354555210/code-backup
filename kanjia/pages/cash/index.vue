<template>
	<view class="content">
		<view class="cash-box">
			<view class="cash-title">
				<image src="../../static/cash-title.png" mode="aspectFill"></image>
			</view>
			<view class="cash-list">
				<view class="cash-item" :class="curIndex == index? 'active': ''" v-for="(item,index) in cashList" :key="index" @click="selectItem(index)">
					<text>15</text>元
				</view>
			</view>
		</view>
		<view class="cash-user-info">
			提现给 <text>咏春皮长山</text>
		</view>
		<view class="cash-btn">
			<image src="../../static/cash-long-btn.png" mode="aspectFill"></image>
		</view>
		<view class="rules">
			<view class="rules-title">
				<image src="../../static/cash-rules-title.png" mode="aspectFill"></image>
			</view>
			<view class="rules-list">
				<text>1、红包余额将直接提现到指定的微信中</text>
				<text>2、提现需要1-3个工作日进行审核</text>
				<text>3、如发现有刷号、作弊等行为，将不予打款</text>
			</view>
		</view>
		<uni-popup ref="popup" type="center" :animation="false">
			<view class="cash-popup-wrapper">
				<view class="cash-popup-title">
					申请成功
				</view>
				<view class="cash-popup-info">
					我们将在1-3个工作日内进行审核
				</view>
				<view class="cash-popup-btn" @click="$refs.popup.close()">
					<image src="../../static/ok-btn.png" mode="aspectFill"></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				cashList: 6,
				curIndex: 0
			};
		},
		mounted() {
			// this.$refs.popup.open();
		},
		components:{
			uniPopup
		},
		methods:{
			selectItem(index){
				this.curIndex = index;
			}
		}
	}
</script>

<style lang="stylus">
.content
	padding 15rpx
.rules
	margin-top 30rpx
	.rules-title
		image
			width 254rpx
			height 35rpx
	.rules-list
		font-size 26rpx
		margin-top 20rpx
		text
			display block
			margin-bottom 20rpx
.cash-title
	width 324rpx
	height 35rpx
	image
		height 100%
.cash-list
	padding 10rpx 0
	display flex
	justify-content space-between
	align-items center
	flex-wrap wrap
	.cash-item
		width 208rpx
		height 62rpx
		text-align center
		display flex
		justify-content center
		align-items center
		font-size 30rpx
		border 4rpx solid #EEEEEE
		border-radius 31rpx
		margin 15rpx 0
		&.active
			background-color #fdece9
			color #eb4025
			border-color #ec4626
.cash-user-info
	font-size 30rpx
	text
		color #377d22
		margin-left 10rpx
.cash-btn
	width 591rpx
	height 106rpx
	margin 40rpx auto
	image
		height 100%
.cash-popup-wrapper
	width 600rpx
	height 330rpx
	background-color #fff
	border-radius 20rpx
	text-align center
	padding 50rpx 0
	.cash-popup-title
		font-size 40rpx
		color #f03e0a
	.cash-popup-info
		font-size 34rpx
		margin-top 20rpx
	.cash-popup-btn
		width 230rpx
		height 80rpx
		margin 40rpx auto 0
		image
			height 100%
</style>
