<template>
	<view>
		<uni-popup type="center" :animation="false" ref="qqnum">
			<view class="popup-wrapper">
				<view class="popup-qq-title">
					填写QQ号码
				</view>
				<view class="popup-qq-input">
					<input type="number" value="" />
				</view>
				<view class="popup-qq-sub">
					<image src="../../static/ok-btn.png" mode="aspectFill"></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '../uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				
			};
		},
		components: {
			uniPopup
		},
		mounted() {
			
		},
		methods:{
			showPopup(){
				this.$refs.qqnum.open();
			}
		}
	}
</script>

<style lang="stylus">
.popup-wrapper
	width 600rpx
	background-color #FFFFFF
	border-radius 20rpx
	padding 50rpx
	.popup-qq-title
		font-size 36rpx
		color #999999
		text-align left
	.popup-qq-input
		margin 20rpx 0
		input
			width 100%
			height 60rpx
			line-height 60rpx
			padding-left 10rpx
			border 1rpx solid #999999
			border-radius 20rpx
			font-size 36rpx
			text-align left
	.popup-qq-sub
		width 230rpx
		height 80rpx
		margin 0 auto
		image
			height 100%
</style>
