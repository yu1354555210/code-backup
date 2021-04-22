<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="stylus">
page
	font-family PingFang SC
/* 每个页面公共css */
.btn
	display flex
	justify-content center
	align-items center
	border-radius 200rpx
	line-height 2.55555556
	padding 0
	background-color transparent
	color #FFFFFF
	&::after
		display none
.image-bg
	position absolute
	z-index -1
	width 100%
	height 100%
	left 0
	top 0
	display block
.dialog-mask
	position fixed
	width 100%
	height 100%
	background rgba(0, 0, 0, 0.5)
	z-index 777
	left 0
	top 0
.dialog-wrapper
	width 432rpx
	// height 500rpx
	background #FFFFFF
	border-radius 18rpx
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -50%)
	display flex
	flex-direction column
	align-items center
	justify-content space-between
	padding 20rpx 30rpx 30rpx
	&>image
		width 305rpx
		height 284rpx
		margin-left 50rpx
	.dialog-text
		text-align center
		font-size 30rpx
		font-weight bold
		color #F73C17
		line-height 40rpx
		display flex
		flex-direction column
		align-items center
		justify-content center
		height 100rpx
	.dialog-btn
		width 240rpx
		height 60rpx
		line-height 60rpx
		background linear-gradient(0deg, #FF594F, #FE3525)
		border-radius 30rpx
		font-size 26rpx
		color #FFFFFF
		text-align center
.cu-modal
	position fixed
	top 0
	right 0
	bottom 0
	left 0
	z-index 1110
	opacity 0
	outline 0
	text-align center
	-ms-transform scale(1.185)
	transform scale(1.185)
	backface-visibility hidden
	perspective 2000upx
	background rgba(0, 0, 0, 0.6)
	transition all 0.3s ease-in-out 0s
	pointer-events none
.cu-modal::before
	content '\200B'
	display inline-block
	height 100%
	vertical-align middle
.cu-modal.show
	opacity 1
	transition-duration 0.3s
	-ms-transform scale(1)
	transform scale(1)
	overflow-x hidden
	overflow-y auto
	pointer-events auto
</style>
