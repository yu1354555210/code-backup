<template>
	<view>
		<view class="animate-bg">
			<div class="animate-img-item" v-for="(item, index) in repeat" :key="index">
				<view class="animate-left-img animate-img">
					<image src="../../static/bg-man.png" mode="aspectFill"></image>
					<image src="../../static/bg-man.png" mode="aspectFill"></image>
				</view>
				<view class="animate-right-img animate-img">
					<image src="../../static/bg-woman.png" mode="aspectFill"></image>
					<image src="../../static/bg-woman.png" mode="aspectFill"></image>
				</view>
			</div>
			<view class="match-popup">
				<view class="search-icon"><image src="../../static/search.png" mode="aspectFill"></image></view>
				<view class="animate-left-img animate-img">
					<image src="../../static/bg-man.png" mode="aspectFit"></image>
					<image src="../../static/bg-man.png" mode="aspectFit"></image>
				</view>
				<view class="match-text">匹配中...</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			repeat: 6
		};
	}
};
</script>

<style lang="stylus">
.match-popup
	width 600rpx
	height 500rpx
	background-color #FFFFFF
	position absolute
	left 50%
	top 50%
	transform translate(-50%, -50%)
	border-radius 40rpx
	z-index 888
	overflow hidden
	.animate-left-img
		margin-top 106rpx
		image
			animation-duration 4s !important
	.search-icon
		position absolute
		top 80rpx
		right -20rpx
		z-index 555
		width 217rpx
		height 222rpx
		transform scale(0.8)
		image
			width 100%
			height 100%
	.match-text
		text-align center
		font-size 50rpx
		font-weight 800
		color rgba(51, 51, 51, 1)
		line-height 40rpx
		margin-top 120rpx
.animate-bg
	position fixed
	top 0
	left 0
	width 100%
	height 100vh
	background-color #FFFFFF
	&::after
		content ''
		display block
		width 100%
		height 100%
		position fixed
		left 0
		top 0
		z-index 444
		background-color rgba(0, 0, 0, 0.3)
	.animate-img
		height 145rpx
		display flex
		image
			animation 30s move infinite linear normal
			flex 0 0 100%
			width 100%
			height 145rpx
		&.animate-right-img
			flex-direction row-reverse
			image
				animation-name move2
@keyframes move
	0%
		transform translate3d(0, 0, 0)
		backface-visibility hidden
		perspective 1000
	100%
		transform translate3d(-100%, 0, 0)
@keyframes move2
	0%
		transform translate3d(0, 0, 0)
		backface-visibility hidden
		perspective 1000
	100%
		transform translate3d(100%, 0, 0)
</style>
