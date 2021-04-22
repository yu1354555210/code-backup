<template>
	<view>
		<view class="content">
			<view class="mine-info">
				<view class="avatar"><image :src="getInfo.avatar" mode="aspectFill"></image></view>
				<view class="nickname" v-text="getInfo.user_name"></view>
			</view>
			<view class="mine-list">
				<navigator url="../thumbs/thumbs" class="mine-item">
					<view class="mine-item-left">
						<view class="mine-icon"><image src="../../static/icon-zan.png" mode="aspectFill"></image></view>
						我的赞
					</view>
					<view class="arrow"><image src="../../static/icon-arrow.png" mode="aspectFill"></image></view>
				</navigator>
				<view class="mine-item">
					<view class="mine-item-left">
						<view class="mine-icon"><image src="../../static/icon-ver.png" mode="aspectFill"></image></view>
						版本号
					</view>
					<view class="ver-num">v1.0.0</view>
				</view>
			</view>
			<view class="banner-box">
				<ad unit-id="426bac2ced0cdc9880c5b0f8a6c648b8" type="card"></ad>
			</view>
			<view class="login-box">
				<!-- <view class="login-before">登录</view> -->
				<view class="login-after login-btn" @click="logOut">退出当前登录</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			isShowHeader: true
		};
	},
	computed:{
		...mapState(['userName','avatarUrl','loginStatus']),
		...mapGetters(['getInfo','getLoginStatus'])
	},
	mounted() {
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		// #ifdef MP-QQ
			qq.showShareMenu({
				showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
			})
		// #endif
		return {
			title: '这条说说说的就是你吧？',
			path: '/pages/index/index'
		}
	},
	methods: {
		...mapMutations(['login','logout']),
		logOut(){
			this.logout();
			setTimeout(()=>{
				uni.navigateTo({
					url:'../login/login'
				})
			},300)
		},
		removeDate() {
			// uni.removeStorageSync();
			uni.showToast({
				icon: 'none',
				title: '清除成功'
			});
		},
		
	}
};
</script>

<style lang="stylus">
.content
	padding 30rpx
	image
		width 100%
		height 100%
.mine-info
	display flex
	align-items center
	margin-bottom 30rpx
	.avatar
		width 120rpx
		height 120rpx
		margin-right 20rpx
		// border:1rpx solid rgba(198,198,198,1);
		border-radius 50%
		overflow hidden
	.nickname
		font-size 34rpx
.mine-list
	margin-top 40rpx
	.mine-item
		width 100%
		background-color #F6F6F6
		height 90rpx
		padding 0 30rpx
		margin-bottom 30rpx
		font-size 28rpx
		border-radius 20rpx
		display flex
		align-items center
		justify-content space-between
		.mine-item-left
			display flex
			align-items center
			.mine-icon
				width 40rpx
				height 40rpx
				margin-right 20rpx
		.arrow
			width 15rpx
			height 26rpx
.banner-box
	// width 690rpx
	// height 280rpx
	// background-color #0062CC
	// border-radius 20rpx
	margin 30rpx 0
.login-box
	display flex
	justify-content center
	margin-top 130rpx
	.login-btn
		width 400rpx
		height 80rpx
		border-radius 200rpx
		border none
		display flex
		justify-content center
		align-items center
		background linear-gradient(-90deg, rgba(153, 153, 153, 1), rgba(202, 202, 202, 1))
		font-size 30rpx
		font-weight bold
		color #FFFFFF
		&::after
			display none
		&.login-before
			background linear-gradient(90deg, rgba(255, 206, 0, 1), rgba(255, 180, 0, 1))
</style>
