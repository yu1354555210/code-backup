<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(!this.vuex_is_login){
				this.$u.vuex('isLoginUrl', 'applets_');
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	page{
		background-color: #f7f8f8;
		font-family: PingFang SC;
	}
</style>

<style lang="stylus">
.mine-header
	padding 0 43rpx
	display flex
	align-items center
	.mine-header-body
		margin-left 20rpx
		text
			font-size 32rpx
			font-weight bold
			color #696A69
		.mine-header-tags
			margin-top 10rpx
			display flex
			.utag
				margin-right 32rpx
</style>