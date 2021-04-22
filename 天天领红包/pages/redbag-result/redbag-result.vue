<template>
	<view class="content">
		<view class="redbag-num-box">
			<image class="image-bg" src="https://app1-api.qianr.com/static/bonus/redbag-result-bg.png" mode="aspectFill"></image>
			<view class="redbag-num" v-if="totalMoney != ''">
				<text v-text="totalMoney"></text>
				<text>元</text>
			</view>
			<text>现金红包</text>
		</view>
		<view class="redbag-person-list">
			<view class="redbag-person-item" v-for="(item,index) in dataList" :key="index" v-if="dataList.length>0">
				<view class="item-left">
					<image :src="item.avatar" mode="aspectFill"></image>
					<view class="user">
						<text class="username" v-text="item.user_name"></text>
						<text class="time" v-text="item.created_at"></text>
					</view>
				</view>
				<view class="item-right">
					<text class="price">{{item.lead_money}}元</text>
					<view class="best-person" v-if="item.is_best == 2">
						<image src="https://app1-api.qianr.com/static/bonus/icon-crown.png" mode="aspectFill"></image>
						<text>手气最佳</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			optionsList: [],
			dataList: [],
			totalMoney: ''
		};
	},
	onLoad(options) {
		this.optionsList = options;
	},
	mounted() {
		this.$nextTick(function(){
			this.getResultData();
		});
	},
	methods:{
		getResultData(){
			uni.showLoading({
				title:'加载中...'
			});
			this.$http
				.get('/api/bonus/v1/lucky', {
					params: {
						token: this.$store.getters.token,
						bonus_id: this.optionsList.id || null,
						type: this.optionsList.type
					}
				})
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.dataList = data.info;
						console.log("data: ",data);
						console.log("data.total_money: ",data.total_money);
						this.totalMoney = data.total_money;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		}
	}
};
</script>

<style lang="stylus">
.redbag-person-list
	border-top 15rpx solid #EEEEEE
	margin-top 410rpx
	padding 0 20rpx
	.redbag-person-item
		display flex
		justify-content space-between
		padding 40rpx 0
		position relative
		&::after
			content ''
			display block
			position absolute
			bottom 0
			right 0
			width: 598rpx;
			height: 1rpx;
			background: #EEEEEE;

		.item-left
			display flex
			align-items center
			width 60%
			image
				flex 0 0 90rpx
				width 90rpx
				height 90rpx
				border-radius 10rpx
				margin-right 20rpx
			.user
				display flex
				flex-direction column
				justify-content center
				.username
					font-size 28rpx
					color #333333
				.time
					font-size 24rpx
					color #999999
					margin-top 5rpx
		.item-right
			display flex
			flex-direction column
			justify-content space-between
			text-align right
			.price
				font-size 34rpx
				color #333333
			.best-person
				display flex
				align-items center
				text
					font-size 28rpx
					color #FCC800
				image
					width 39rpx
					height 27rpx
					margin-right 12rpx
.redbag-num-box
	z-index 666
	width 100%
	position fixed
	top 0
	left 0
	height 372rpx
	text-align center
	font-size 30rpx
	color #FEF3D8
	background-color #FFFFFF
	box-shadow 0 0 30rpx 10rpx rgba(255,255,255,1)
	.redbag-num
		margin-top 160rpx
		text
			font-size 150rpx
			font-weight bold
			line-height 80rpx
			&+text
				margin-left 10rpx
				font-size 30rpx
</style>
