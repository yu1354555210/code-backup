<template>
	<view class="content">
		<block>
			<view class="mine-user-box" v-if="getLoginStatus">
				<image :src="getInfo.avatar" mode="aspectFill"></image>
				<view class="user-info">
					<text class="username" v-text="getInfo.user_name"></text>
					<text class="uid">UID:{{ getInfo.id }}</text>
				</view>
			</view>
			<view class="mine-user-box" v-else @click="setLoginDialogStatus()">
				<image src="https://app1-api.qianr.com/static/bonus/avatar.png" mode="aspectFill"></image>
				<view class="user-info"><text class="username">未登录</text></view>
			</view>
		</block>

		<view class="mine-money-box" v-if="getLoginStatus">
			<image class="image-bg" src="https://app1-api.qianr.com/static/bonus/mine-bg.png" mode="aspectFill"></image>
			<view class="mine-money-body">
				<view class="mine-money-top">
					<image src="https://app1-api.qianr.com/static/bonus/icon-wallet.png" mode="aspectFill"></image>
					<text>账户余额(元)</text>
				</view>
				<view class="mine-money-middle" v-text="dataList.balance" @click="toPage('../account-cash/account-cash')"></view>
				<view class="mine-money-bottom">
					<view class="mine-money-bottom-item" @click="toPage('../cash-list/cash-list')">
						<text class="mine-money-bottom-text">已提现金额(元)</text>
						<text class="mine-money-bottom-price" v-text="dataList.draw"></text>
					</view>
					<view class="mine-money-bottom-item" @click="toPage('../review-list/review-list')">
						<text class="mine-money-bottom-text">审核中(元)</text>
						<text class="mine-money-bottom-price" v-text="dataList.review"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="mine-nav-list">
			<view class="mine-nav-item" v-if="getLoginStatus">
				<navigator class="mine-nav-link" url="../income-list/income-list">
					<image src="https://app1-api.qianr.com/static/bonus/mine-item-detail.png" mode="aspectFill" class="mine-item-icon"></image>
					<text>收入明细</text>
				</navigator>
				<image src="https://app1-api.qianr.com/static/bonus/mine-item-arrow.png" mode="aspectFill"></image>
			</view>
			<view class="mine-nav-item">
				<navigator class="mine-nav-link" url="../policy/policy">
					<image src="https://app1-api.qianr.com/static/bonus/mine-item-policy.png" mode="aspectFill" class="mine-item-icon"></image>
					<text>用户政策</text>
				</navigator>
				<image src="https://app1-api.qianr.com/static/bonus/mine-item-arrow.png" mode="aspectFill"></image>
			</view>
			<view class="mine-nav-item">
				<navigator class="mine-nav-link" url="../agreement/agreement">
					<image src="https://app1-api.qianr.com/static/bonus/mine-item-privacy.png" mode="aspectFill" class="mine-item-icon"></image>
					<text>隐私协议</text>
				</navigator>
				<image src="https://app1-api.qianr.com/static/bonus/mine-item-arrow.png" mode="aspectFill"></image>
			</view>
		</view>
		<button type="default" class="logout-btn btn" v-if="getLoginStatus" @click="mineLogout">退出登录</button>

		<!-- 登录弹窗 -->
		<v-login-model></v-login-model>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			dataList: ''
		};
	},
	computed: {
		...mapGetters(['getDialogStatus', 'getLoginStatus', 'getInfo','token']),
		...mapState(['loginDialogStatus'])
	},
	onShow() {
		if (!this.getLoginStatus) {
			this.setLoginDialogStatus();
		}
		this.getMineData();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
		}
		return {
			title: '天天领红包',
			imageUrl: 'https://app1-api.qianr.com/static/bonus/share.png',
			path: `/pages/index/index?inviteCode=${this.getInfo.invite_code}`
		};
	},
	//监听状态是否发生改变
	watch: {
		getLoginStatus(newValue, oldValue) {
			if (newValue) {
				//值发生改变执行的函数
				this.getMineData();
			}
		}
	},
	mounted() {
		this.$nextTick(function(){
			// this.getMineData();
		});
	},
	methods: {
		...mapMutations(['setDialogStatus', 'setLoginDialogStatus','logout']),
		toPage(path) {
			uni.navigateTo({
				url: path
			});
		},
		mineLogout(){
			this.logout();
			setTimeout(()=>{
				uni.switchTab({
					url: '../index/index'
				})
			},300);
		},
		getMineData() {
			this.checkLogin(() => {
				this.$http
					.get('/api/bonus/v1/my', {
						params: {
							token: this.token
						}
					})
					.then(res => {
						if (res.data.status == 200) {
							let data = res.data.data;
							this.dataList = data;
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: '系统错误，请稍后重试'
						});
					});
			});
		}
	}
};
</script>

<style lang="stylus">
.mine-user-box
	display flex
	align-items center
	padding 40rpx 20rpx 20rpx
	image
		margin-right 20rpx
		width 100rpx
		height 100rpx
		border-radius 50%
	.user-info
		display flex
		justify-content center
		flex-direction column
	.username
		font-size 30rpx
		font-weight bold
		color #333333
		margin-bottom 8rpx
	.uid
		font-size 24rpx
		color #999999
.mine-nav-list
	padding 0 20rpx
	.mine-nav-item
		border-bottom 1rpx solid #EEEEEE
		position relative
		.mine-nav-link
			display flex
			align-items center
			position relative
			padding 40rpx 0
			.mine-item-icon
				width 31rpx
				height 34rpx
				margin-right 13rpx
		&>image
			width 15rpx
			height 24rpx
			position absolute
			top 50%
			right 0
			transform translateY(-50%)
		&:nth-child(2)
			.mine-item-icon
				width 29rpx
				height 32rpx
		&:nth-child(3)
			.mine-item-icon
				width 28rpx
				height 36rpx
.mine-money-box
	width 100%
	height 440rpx
	position relative
	.mine-money-body
		padding 60rpx
		height calc(100% - 120rpx)
		display flex
		flex-direction column
		justify-content space-between
		.mine-money-top
			display flex
			align-items center
			image
				width 40rpx
				height 39rpx
				margin-right 20rpx
			text
				font-size 30rpx
				font-weight 500
				color #FFFFFF
		.mine-money-middle
			flex 1
			display flex
			justify-content center
			align-items center
			font-size 70rpx
			font-weight bold
			color #FFFFFF
		.mine-money-bottom
			display flex
			align-items center
			width 100%
			margin-top 20rpx
			.mine-money-bottom-item
				flex 1
				display flex
				flex-direction column
				justify-content center
				color #FFFFFF
				position relative
				&:last-child
					padding-left 40rpx
					&::after
						content ''
						display block
						width 2rpx
						height 50rpx
						background #FFB4AE
						position absolute
						left 0
						top 50%
						transform translateY(-50%)
				.mine-money-bottom-text
					font-size 24rpx
				.mine-money-bottom-price
					font-size 30rpx
					font-weight bold
button.logout-btn
	width 710rpx
	height 90rpx
	background #EEEEEE
	font-size 28rpx
	font-weight 500
	color #999999
	margin-top 46rpx
	&::after
		display none
</style>
