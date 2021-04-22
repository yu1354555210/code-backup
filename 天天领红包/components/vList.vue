<template>
	<view class="this-list">
		<view v-for="(item, index) in dataList" :key="index" class="this-item">
			<view class="this-title" v-text="item.title"></view>
			<view class="this-body" v-for="(it, idx) in item.info" :key="idx">
				<view class="this-info">
					<image :src="`https://app1-api.qianr.com/static/bonus/icon-${iconName}.png`" mode="aspectFill"></image>
					<view>
						<text v-if="iconName == 'cash'">账户余额提现-到微信零钱</text>
						<text v-else-if="iconName == 'review'">提现申请-审核中</text>
						<text v-else>{{ it.total }}元红包</text>
						<text v-text="it.time"></text>
					</view>
				</view>
				<text class="this-num" v-text="it.money"></text>
			</view>
		</view>

		<view class="no-data" v-if="dataList.length === 0">
			<!-- <image src="../static/image/no-data.png" mode="aspectFill"></image> -->
			<text>暂无数据</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			noData: false
		};
	},
	props: {
		iconName: {
			default: 'income', //income-收入明细,review-审核中,cash-已提现
			type: String
		},
		dataList: {
			default: []
		}
	},
	mounted() {
	}
};
</script>

<style lang="stylus">
.this-list
	padding 20rpx
	.this-title
		font-size 24rpx
		color #999999
		margin-bottom 10rpx
	.this-item
		margin-bottom 40rpx
	.this-body
		padding 35rpx 0
		display flex
		justify-content space-between
		align-items center
		border-bottom 1rpx solid #EEEEEE
		.this-info
			display flex
			align-items center
			image
				width 52rpx
				height 52rpx
				margin-right 24rpx
			view
				display flex
				flex-direction column
				text
					font-size 28rpx
					font-weight 500
					color #333333
					&+text
						font-size 24rpx
						color #999999
						margin-top 10rpx
		.this-num
			font-size 40rpx
			font-weight bold
			color #333333
.no-data
	display flex
	align-items center
	justify-content center
	flex-direction column
	height 80vh
	image
		width 231rpx
		height 186rpx
	text
		font-size 28rpx
		color #999999
		margin-top 30rpx
</style>
