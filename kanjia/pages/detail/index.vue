<template>
	<view class="content">
		<common-detail ref="detail"></common-detail>
		<uni-popup  ref="countPopup" type="center" :animation="false">
			<view class="popup-wrapper">
				<view class="popup-info">
					<view>砍价机会已经用光</view>
					<view>快去邀请好友帮你砍价吧</view>
				</view>
				<view class="popup-btn-box">
					<button open-type="share" class="popup-btn">
						<image src="../../static/invite-person.png" mode="aspectFill"></image>
					</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import commonDetail from '@/components/common-detail/index.vue'
	export default {
		data() {
			return {
				id: 0,
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			let shareInfo = getApp().globalData.shareInfo;
			let randomImg = shareInfo [Math.floor(Math.random() * shareInfo .length)];
			console.log("this.$refs.detail.bargain_id: " + this.$refs.detail.bargain_id);
			return {
			  title: randomImg,
			  imageUrl: getApp().globalData.imageUrl,
			  path: '/pages/invite/index?bargain_id='+ this.$refs.detail.bargain_id
			}
		},
		components: {
			commonDetail,
		},
		onLoad(options) {
			// this.$refs.popup.open()
			this.id = options.id;
		},
		methods:{
			showCountPopup(){
				this.$refs.countPopup.open();
			}
		}
	}
</script>

<style lang="stylus">
page
	background-color #f96a2a
.content
	padding 40rpx 15rpx
	.success-wrapper
		width 600rpx
		height 750rpx
		background-color #FFFFFF
		border-radius 20rpx
		text-align center
		position relative
		padding 65rpx 0
		.icon-close
			position absolute
			width 32rpx
			height 30rpx
			right 30rpx
			top 30rpx
		.success-award-info
			font-size 30rpx
			color #000000
			line-height 50rpx
			text
				font-size 40rpx
				color #fb5d2b
		.sucess-image
			width 496rpx
			height 411rpx
			display inline-block
			margin 0 auto 20rpx
		.success-btn
			width 300rpx
			height 90rpx
			display inline-block
.popup-wrapper
	width 600rpx
	background-color #FFFFFF
	border-radius 20rpx
	text-align center
	padding 50rpx 0
.popup-info
	font-size 38rpx
	margin-bottom 40rpx
	text
		display block
		color #f03d0a
		margin 20rpx 0
.popup-btn-box
	display flex
	justify-content center
	align-items center
	flex-direction column
.popup-btn
	width 450rpx
	height 100rpx
	margin-bottom 20rpx
	padding 0
	&:first-child
		margin-bottom 30rpx
	image
		height 100%
</style>
