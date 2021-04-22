<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.content{
		padding: 20rpx;
		color: #333333;
	}
	image {
		width: 100%;
		max-width: 100%;
	}
	page {
		font-family: "PingFangSC-Regular", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
		background-color: #FFFFFF;
		box-sizing: border-box;
	}
</style>
<style lang="stylus">
.avatar-list
	.avatar-item
		display flex
		align-items center
		justify-content space-between
		margin-bottom 40rpx
		.avatar
			image
				width 280rpx
				height 280rpx
				border-radius 20rpx
				border 2px solid #FC5575
		.avatar-heart
			image
				width 88rpx
				height 72rpx
</style>
