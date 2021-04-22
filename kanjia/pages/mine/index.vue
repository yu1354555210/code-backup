<template>
	<view class="content">
		<view class="login-info">
			<view class="login-before"  @click="userLogin" v-if="getUserInfo == null">
				<button class="getuser-btn" v-if="!getLoginStatus" type="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo"></button>
				<image src="../../static/default-avatar.png" mode="aspectFill"></image>
				<text>点击登录</text>
			</view>
			<view class="login-after" v-else>
				<image :src="getUserInfo.avatarUrl" mode="aspectFill"></image>
				<view class="user-info">
					<view class="nickname" v-text="getUserInfo.nickName"></view>
					<view class="user-id">
						ID: {{uid}}
					</view>
				</view>
			</view>
		</view>
		<view class="mine-list">
			<navigator url="../awards/index" class="mine-item">
				<image src="../../static/mine-gift-icon.png" mode="aspectFill" class="mine-icon"></image>
				<text class="mine-name">我的奖品</text>
				<image src="../../static/right-arrow.png" mode="aspectFill" class="arrow"></image>
			</navigator>
			<navigator url="../question/index" class="mine-item">
				<image src="../../static/mine-question-icon.png" mode="aspectFill" class="mine-icon"></image>
				<text class="mine-name">常见问题</text>
				<image src="../../static/right-arrow.png" mode="aspectFill" class="arrow"></image>
			</navigator>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				uid: uni.getStorageSync('uid') || ''
			}
		},
		computed:{
			...mapGetters(['getUserInfo','getLoginStatus'])
		},
		methods:{
			...mapMutations(['login','setToken']),
			userLogin(avatar,username){
				let that = this;
				uni.login({
				  provider: 'qq',
				  success: function (loginRes) {
					let code = loginRes.code;
					that.$http.post('/bargain_v1/user/login',{
							code: code,
							avatar: avatar,
							username: username
						},{
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							}
						})
						.then(res => {
							console.log(res.data);
							let data = res.data.data;
							that.setToken(data.token);
							that.uid = data.uid;
							uni.setStorageSync('uid',data.uid);
						}).catch(err => {
							console.log(err);
						})
				  }
				});
			},
			bindGetUserInfo(e){
				if(!e.detail.iv){  
					uni.showToast({  
						icon: 'none',
						title: "登录失败！"  
					});  
					return false;  
				} else{
					let avatar = e.detail.userInfo.avatarUrl;
					let username = e.detail.userInfo.nickName;
					this.login(e.detail.userInfo);
					this.userLogin(avatar,username);
				}
			},
		},
	}
</script>

<style lang="stylus">
page{
	background-color #f8f7fb
}
.content
	padding 15rpx
	position relative
	&::after
		content ""
		width 100%
		height 120rpx
		position absolute
		background-color #2d2793
		top 0
		left 0
		z-index -1
.login-info
	background-color #FFFFFF
	padding 30rpx
	border-radius 20rpx
	box-shadow 0 6rpx 10rpx rgba(45,39,147,0.17)
	position relative
	.login-before,.login-after
		display flex
		align-items center
		font-size 30rpx
		image
			width 124rpx
			height 124rpx
			border-radius 50%
			margin-right 34rpx
	.login-after
		.user-id
			margin-top 10rpx
			font-size 22rpx
			color #000000
			padding 5rpx 20rpx 5rpx 5rpx
			background-color #f2f2f2
.mine-list
	margin-top 30rpx
	background-color #FFFFFF
	border-radius 30rpx
	overflow hidden
	.mine-item
		padding 30rpx
		display flex
		align-items center
		position relative
		border-bottom 1rpx solid #eeeeee
		&:active
			background-color #efefef
		&:last-child
			border-bottom none
		.mine-icon
			width 80rpx
			height 80rpx
			margin-right 20rpx
		.mine-name
			font-size 30rpx
		.arrow
			position absolute
			right 15rpx
			top 50%
			transform translateY(-50%)
			width 16rpx
			height 30rpx
.getuser-btn
	width 100%
	height 100%
	position absolute
	left 0
	top 0
	z-index 6
	background-color transparent !important
</style>
