<template>
	<view>
		<view class="status-bar"></view>
		<view class="content">
			<view class="mine-info" v-show="isShowHeader">
				<view class="avatar">
					<image src="../../static/detault-avatar.png" mode="aspectFill"></image>
				</view>
				<view class="nickname">
					普通用户
				</view>
				<!-- <view class="vip">
					<image src="../../static/ds-btn.png" mode="aspectFill"></image>
				</view> -->
			</view>
			<!-- 包含图片 -->
			<uni-list>
			    <!-- <uni-list-item title="好评体验大神权利" thumb="../../static/mine-icon1.png"></uni-list-item>
			    <uni-list-item title="升级成为大神" thumb="../../static/mine-icon2.png"></uni-list-item> -->
			    <uni-list-item title="清理缓存" @click="removeDate" thumb="../../static/mine-icon3.png"></uni-list-item>
			    <uni-list-item title="版本号" thumb="../../static/mine-icon4.png" :showArrow="false" rightText="v1.0"></uni-list-item>
			</uni-list>
		</view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import uniList from "@dcloudio/uni-ui/lib/uni-list/uni-list.vue"
	import uniListItem from "@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue"
	export default {
		data() {
			return {
				isShowHeader: false
			};
		},
		components: {uniList,uniListItem},
		methods:{
			removeDate(){
				// uni.removeStorageSync();
				uni.showToast({
					icon:'none',
					title:'清除成功'
				})
			}
		}
	}
</script>

<style lang="stylus">
.content
	padding 30rpx
.mine-info
	display flex
	align-items center
	margin-bottom 30rpx
	.avatar
		width 97rpx
		height 97rpx
		margin-right 12rpx
		image
			width 100%
			height 100%
			border-radius 50%
	.nickname
		font-size 30rpx
		color #333333
	.vip
		color #f00
		font-size 26rpx
		flex 1
		display flex
		justify-content flex-end
		image
			width 190rpx
			height 44rpx
.uni-list-item
	background:rgba(255,255,255,1);
	box-shadow:0px 4rpx 32rpx 0rpx rgba(255,51,75,0.08);
	border-radius:20rpx;
	margin-bottom 30rpx
	padding-left 30rpx
	border none
	::after,::before
		display none
</style>
