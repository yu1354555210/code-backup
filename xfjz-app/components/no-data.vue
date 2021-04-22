<template>
	<view>
		<view class="no-data">
			<image src="../../static/no-data.png" mode="aspectFill"></image>
			<text class="no-data-text" v-text="title"></text>
			<navigator class="no-data-btn" url="../../pages/index/index"><image src="../../static/no-data-btn.png" mode="aspectFill"></image></navigator>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
	props: {
		title: ''
	},
	methods:{
	}
};
</script>

<style lang="less">
.no-data{
	width: 100%;
	height: 60vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	image{
		width: 298rpx;
		height: 339rpx;
		margin: 30rpx 0 90rpx;
	}
	.no-data-text{
		font-size: 30rpx;
		color: #999;
	}
	.no-data-btn{
		width: 342rpx;
		height: 100rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
}
</style>
