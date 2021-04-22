<template>
	<view class="content">
		<block v-if="hasData">
			<view class="award-rules">
				<view class="award-rules-wrapper">
					<view class="award-rules-title"><image src="../../static/award-rules-title.png" mode="aspectFill"></image></view>
					<view class="award-rules-list">
						<view>1、如需兑奖请先关注微信公众号“免费抓娃娃”</view>
						<view>2、点击底部菜单->服务->兑换奖品 打开兑换奖品页面</view>
						<view>3、将您的“奖品兑换码”填入文本框中，点击“立即兑换”</view>
						<view>
							4、完成兑换申请，工作人员将会再1-3个工作日内将
							<text>奖品等价的红包</text>
							发放到您的微信号中
						</view>
					</view>
				</view>
			</view>
			<view class="award-item" v-for="(item, index) in awardList" :key="index" v-if="item.prize_type != 1">
				<image src="../../static/award-item-bg.png" mode="aspectFill" class="award-item-bg"></image>
				<view class="award-name" v-text="item.prize_name"></view>
				<view class="award-info">
					<view class="award-redbags-num">该奖品折合{{ item.worth }}元微信红包</view>
					<view class="award-time">{{ getdate(item.lottery_time) }}</view>
				</view>
				<view class="award-item-bottom">
					<view class="award-code-info">
						<text>奖品兑换码</text>
						<view v-text="item.redemption_code"></view>
					</view>
					<image src="../../static/copy-btn.png" mode="aspectFill" @click="setClipboardData(item.redemption_code)"></image>
				</view>
			</view>
		</block>
		<view class="no-data" v-else>
			<image src="../../static/no-data.png" mode="aspectFill"></image>
			<view class="no-data-info">
				<text>没有奖品，快去</text>
				<navigator url="../index/index">免费领奖品吧</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			hasData: true,
			awardList: ''
		};
	},
	components: {},
	onLoad() {
		this.getData();
	},
	methods: {
		getData() {
			uni.showLoading({
				title: '加载中'
			});
			this.$http
				.get('/bargain_v1/user/prize', { params: { token: this.$store.getters.token } })
				.then(res => {
					console.log(res.data);
					if (res.data.code == 1) {
						let data = res.data.data;
						this.awardList = data;
						this.hasData = true;
					}
					uni.hideLoading();
				})
				.catch(err => {
					console.log(err);
					uni.hideLoading();
				});
		},
		getdate(time) {
			var now = new Date(time * 1000),
				y = now.getFullYear(),
				m = now.getMonth() + 1,
				d = now.getDate();
			return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8);
		},
		setClipboardData(data) {
			uni.setClipboardData({
				data: data,
				success: function() {
					console.log('success');
				}
			});
		}
	}
};
</script>

<style lang="stylus">
.content
	padding 15rpx
	.award-item
		position relative
		padding 30rpx
		height 270rpx
		margin-top 30rpx
		background-image url('../../static/award-list-bg.png')
		background-size 719rpx 100%
		background-repeat no-repeat
		.award-item-bg
			width 198rpx
			height 199rpx
			position absolute
			right 30rpx
			top 50%
			transform translateY(-50%)
		.award-name
			font-size 44rpx
			color #000000
			position relative
			z-index 111
			font-weight 600
		.award-info
			position relative
			z-index 66
			display flex
			justify-content space-between
			align-items center
			font-size 24rpx
			line-height 70rpx
			.award-redbags-num
				// width 425rpx
				flex 0 0 400rpx
				white-space nowrap
				border-bottom 1rpx dashed #EEEEEE
			.award-time
				color #999999
				line-height 40rpx
		.award-item-bottom
			position relative
			z-index 66
			margin-top 10rpx
			display flex
			justify-content space-between
			align-items center
			font-size 20rpx
			.award-item-info
				font-size 26rpx
			image
				width 214rpx
				height 82rpx
			.award-code-info
				text
					font-size 26rpx
					color #999999
					display block
				&>view
					// margin-top 10rpx
					font-weight 600
					color #ed4b32
					font-size 32rpx
	.no-data
		text-align center
		padding 100rpx 0
		image
			width 374rpx
			height 406rpx
			margin 20rpx auto
		.no-data-info
			font-size 30rpx
			color #999999
			display flex
			justify-content center
			navigator
				color #2d2793
				text-decoration underline
.popup-wrapper
	width 600rpx
	background-color #FFFFFF
	border-radius 20rpx
	padding 50rpx
	.popup-qq-title
		font-size 36rpx
		color #999999
		text-align left
	.popup-qq-input
		margin 20rpx 0
		input
			width 100%
			height 60rpx
			line-height 60rpx
			padding-left 10rpx
			border 1rpx solid #999999
			border-radius 20rpx
			font-size 36rpx
			text-align left
	.popup-qq-sub
		width 230rpx
		height 80rpx
		margin 0 auto
		image
			height 100%
.award-rules
	border 5rpx solid #ffde7f
	border-radius 15rpx
	padding 25rpx
	.award-rules-wrapper
		border 1rpx solid #f5daaa
		border-radius 15rpx
		padding 35rpx
		.award-rules-title
			width 254rpx
			height 34rpx
			margin 0 auto
			image
				height 100%
.award-rules-list
	font-size 26rpx
	margin-top 30rpx
	color #333333
	line-height 45rpx
	text
		color #ed4b32
		font-size 28rpx
</style>
