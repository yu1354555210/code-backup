<template>
	<view class="content">
		<view class="detail-top">
			<view class="detail-avatar">
				<image :src="inviteData.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-info">
				<view class="nickname">
					{{inviteData.username}}
				</view>
				<view class="dec">
					可以帮我助力吗？点一下助力就能帮我一个大忙～
				</view>
			</view>
		</view>
		<common-detail page='invite' ref="inviteDetail"></common-detail>
	</view>
</template>

<script>
	import commonDetail from '@/components/common-detail/index.vue'
	export default {
		data() {
			return {
				inviteData: '',
				id: 0
			}
		},
		onLoad(options) {
			this.id = options.bargain_id;
		},
		methods:{
			setInviteData(data){
				this.inviteData = data;
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			let shareInfo = getApp().globalData.shareInfo;
			let randomImg = shareInfo [Math.floor(Math.random() * shareInfo .length)];
			return {
			  title: randomImg,
			  imageUrl: getApp().globalData.imageUrl,
			  path: '/pages/invite/index?bargain_id='+ this.$refs.inviteDetail.bargain_id
			}
			
			
		},
		components: {
			commonDetail
		}
	}
</script>

<style lang="stylus">
page
	background-color #f96a2a
.content
	padding 40rpx 15rpx
	.detail-top
		background-color #FFFFFF
		padding 30rpx
		margin-bottom 30rpx
		display flex
		justify-content space-between
		align-items center
		border-radius 20rpx
		.detail-avatar
			width 106rpx
			height 106rpx
			border-radius 50%
			overflow hidden
			image
				height 100%
		.detail-info
			.nickname
				font-size 34rpx
				color #000000
				margin-bottom 10rpx
			.dec
				font-size 24rpx
				color #f9682a

</style>
