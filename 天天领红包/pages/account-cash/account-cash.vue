<template>
	<view class="content">
		<view class="account-cash">
			<image class="image-bg" src="https://app1-api.qianr.com/static/bonus/account-bg.png" mode="aspectFill"></image>
			<view class="account-cash-body">
				<view class="account-cash-left">
					<image src="https://app1-api.qianr.com/static/bonus/icon-wallet.png" mode="aspectFill"></image>
					<text>账户余额(元)</text>
				</view>
				<text v-text="dataList.balance"></text>
			</view>
		</view>
		<view class="cash-select-list">
			<view class="cash-title">请选择提现金额</view>
			<view class="cash-list">
				<view
					class="cash-item"
					v-for="(item, index) in dataList.list"
					:key="index"
					:class="curIndex == index ? 'cur' : ''"
					v-if="isNewPerson"
					@click="toggleItem(index, item.money)"
				>
					<text>{{ item.money }}元</text>
					<text v-if="item.is_new == 1">新手专属</text>
				</view>
			</view>
		</view>
		<view class="cash-rule">
			<view class="cash-rule-title">提现规则:</view>
			<view class="cash-rule-list">
				<text>1.申请提现后，3个工作日内由工作人员审核通过，自动转入微信零钱。</text>
				<text>2.由于账号违规操作导致的提现申请驳回，一经核实，本公司有权封号并清空账户余额。</text>
				<text>3.在法律允许范围内，本活动解释权归本公司所有。</text>
			</view>
		</view>
		<view class="cash-btn btn" @click="cash()">立即提现</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			curIndex: 0,
			isNewPerson: true,
			dataList: '',
			money: ''
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.getDataList();
		});
	},
	methods: {
		toggleItem(index, money) {
			this.curIndex = index;
			this.money = money;
		},
		getDataList() {
			uni.showLoading({
				title: '加载中'
			});
			this.$http
				.get('/api/bonus/v1/my_account', {
					params: {
						token: this.$store.getters.token
					}
				})
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.dataList = data;
						this.money = data.list[0].money;
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
		},
		cash() {
			this.$jiuaiDebounce.canDoFunction({
				key: 'cash',
				success: () => {
					//成功中调用应该操作的方法，被锁定状态不会执行此代码块内的方法
					uni.showLoading({
						title: '加载中'
					});
					this.$http
						.post('/api/bonus/v1/do_draw', {
							token: this.$store.getters.token,
							money: this.money
						})
						.then(res => {
							if (res.data.status == 200) {
								this.getDataList();
								uni.showToast({
									icon: 'none',
									title: '申请成功'
								});
							} else {
								if(res.data.status == 1093){
									uni.showToast({
										icon: 'none',
										title: '余额不足'
									});
								}else{
									uni.showToast({
										icon: 'none',
										title: res.data.msg
									});
								}
							}
							uni.hideLoading();
							this.$jiuaiDebounce.releaseKey('cash');
						})
						.catch(err => {
							this.$jiuaiDebounce.releaseKey('cash');
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '系统错误，请稍后重试'
							});
						});
				}
			});
		}
	}
};
</script>

<style lang="stylus">
.account-cash
	position relative
	width 100%
	height 275rpx
	.account-cash-body
		display flex
		align-items center
		justify-content space-between
		height 100%
		padding 0 60rpx
		color #FFFFFF
		.account-cash-left
			display flex
			align-items center
			image
				width 40rpx
				height 39rpx
				margin-right 20rpx
			text
				font-size 30rpx
				font-weight 500
		&>text
			font-size 70rpx
			font-weight bold
.cash-select-list
	padding 0 20rpx
	.cash-title
		font-size 28rpx
		color #333333
		padding-bottom 30rpx
	.cash-list
		display flex
		flex-wrap wrap
		justify-content space-between
		.cash-item
			width 165rpx
			height 100rpx
			display flex
			justify-content center
			align-items center
			flex-direction column
			border 2rpx solid #EEEEEE
			border-radius 20rpx
			font-size 30rpx
			font-weight bold
			color #333333
			margin-bottom 40rpx
			&.cur
				background rgba(254, 60, 45, 0.1)
				border-color #FE3C2D
			text
				&+text
					font-size 24rpx
					color #FE3A2A
		&::after
			content ''
			display inline-block
			width 165rpx
				
.cash-rule
	padding 0 20rpx
	.cash-rule-title
		color #333333
		font-size 30rpx
		font-weight bold
	.cash-rule-list
		font-size 24rpx
		color #999999
		line-height 50rpx
		display flex
		flex-direction column
.cash-btn
	width 260rpx
	height 80rpx
	background linear-gradient(0deg, #FF594F, #FE3525)
	box-shadow 0px 3rpx 38rpx 0px rgba(0, 0, 0, 0.14)
	border-radius 40rpx
	font-size 30rpx
	font-weight bold
	color #FFFFFF
	margin 120rpx auto 0
</style>
