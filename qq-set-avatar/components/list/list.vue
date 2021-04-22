<template>
	<view>
		<view class="avatar-list">
			<view class="avatar-item" v-for="(item,index) in dataList" :key="index">
				<view class="avatar-left avatar" @click="toDetail(item.img_a)"><image :src="AES.Decrypt(item.img_a)" mode="aspectFill"></image></view>
				<view class="avatar-heart"><image src="../../static/heart.png" mode="aspectFill"></image></view>
				<view class="avatar-right avatar" @click="toDetail(item.img_b)"><image :src="AES.Decrypt(item.img_b)" mode="aspectFill"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			dataList: { // 数据列表
				type: Array,
				default(){
					return []
				}
			}
		},
		methods: {
			toDetail(url){
				uni.navigateTo({
					url:`/detail/detail?baseUrl=${url}&aesUrl=${this.AES.Decrypt(url)}`
				})
			},
		}
	}
</script>

<style lang="stylus">
.list
	padding 50rpx 18rpx
.item
	padding 30rpx
	background:rgba(255,255,255,1);
	box-shadow:0px 12rpx 32rpx 0px rgba(255,51,75,0.08);
	border-radius:20rpx;
	margin-bottom 30rpx
	font-size 30rpx
	font-weight bold
	display flex
	align-items center
	justify-content space-between
	.text-info
		flex 1
		line-height 40rpx
		.text-tag
			width:160rpx;
			height:44rpx;
			background:rgba(255,255,255,1);
			border:1rpx solid rgba(153, 153, 153, 1);
			border-radius:22rpx;
			font-size 26rpx
			color #999999
			line-height 44rpx
			text-align center
			margin-top 30rpx
			font-weight 500
	.copy-btn
		width 100rpx
		display flex
		justify-content center
		image
			width 44rpx
			height 44rpx
</style>
