<template>
	<view class="content">
		<view class="item item-fl">
			<image src="../../static/default-avatar.png" mode="aspectFill"></image>
			<view class="item-info">
				我是您的贴心小卫士请问最贵的你有什么要求？请问有什么问题？
			</view>
		</view>
		<view class="item item-fr">
			<image src="../../static/default-avatar.png" mode="aspectFill"></image>
			<view class="item-info">
				谢谢你！
			</view>
		</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="stylus">
.content
	padding 15rpx
	.item
		display flex
		align-items flex-end
		margin-bottom 80rpx
		image
			width 80rpx
			height 80rpx
			border-radius 50%
		.item-info
			max-width 80%
		&.item-fl
			image
				margin-right 20rpx
			.item-info
				font-size 28rpx
				color #FFFFFF
				background-color #2d2793
				border-radius 30rpx 30rpx 30rpx 8rpx
				padding 35rpx 20rpx
		
		&.item-fr
			flex-direction row-reverse
			image
				margin-left 20rpx
			.item-info
				font-size 28rpx
				color #1d1e2c
				background-color #f7f7fb
				border-radius 30rpx 30rpx 8rpx 30rpx 
				padding 35rpx 40rpx	
			
</style>
