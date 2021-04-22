<template>
	<view>
		<block v-if="isStyle == 'horizontal'">
			<view class="jobs-item solid-bottom" v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
				<view class="jobs-fl">
					<image :src="item.cate_logo" mode="aspectFill"></image>
					<view class="jobs-info">
						<view class="jobs-name" v-text="item.title"></view>
						<view class="jobs-cates">{{item.city}} / {{item.settlement}}</view>
						<view class="jobs-tags">
							<text v-for="(it,idx) in item.labels" :key="idx" v-text="it"></text>
						</view>
					</view>
				</view>
				<view class="jobs-fr">
					<text class="jobs-money-icon" v-if="isShowIcon"></text>
					<text class="jobs-money-text" v-text="item.money"></text>
				</view>
			</view>
		</block>
		<block v-if="isStyle == 'vertical'">
			<view class="jobs-vertical-body">
				<view class="jobs-item solid-bottom jobs-vertical-item" v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
					<image :src="item.cate_logo || item.cate" mode="aspectFill"></image>
					<view class="jobs-info">
						<view class="jobs-name text-cut text-center" style="width: 150px;" v-text="item.title"></view>
						<view class="jobs-cates text-center">{{item.city}} / {{item.settlement}}</view>
					</view>
					<text class="jobs-money-text" v-text="item.money"></text>
					<view class="jobs-tags">
						<text v-for="(it,idx) in item.labels" :key="idx" v-text="it"></text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		list: {
			type: Array
		},
		isStyle: {
			default: 'horizontal' //horizontal 横版  vertical 竖版
		},
		isShowIcon: {
			type: Boolean,
			default: false
		}
	},
	methods:{
		toDetail(id){
			uni.navigateTo({
				url:'../detail/index?id=' + id
			})
		}
	}
};
</script>

<style lang="less">
.jobs-vertical-body{
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	.jobs-vertical-item{
		margin-bottom: 20rpx;
		flex: 0 0 344rpx;
		width: 344rpx;
		height:378rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 0px 13rpx 0px rgba(104, 154, 255, 0.35);
		border-radius:20rpx;
		flex-direction: column;
	}
}
.jobs-item{
	width: 100%;
	padding: 30rpx 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.jobs-fl{
		display: flex;
		align-items: center;
	}
	image{
		width: 96rpx;
		height: 96rpx;
	}
	.jobs-info{
		margin-left: 20rpx;
		.jobs-name{
			font-size: 30rpx;
			font-weight: bold;
		}
		.jobs-cates{
			font-size:20rpx;
			font-weight:500;
			color:rgba(164,164,167,1);
			margin: 15rpx 0;
		}
	}
	.jobs-tags{
		display: flex;
		text{
			display: flex;
			align-items: center;
			margin-right: 10rpx;
			text-align: center;
			height: 40rpx;
			padding: 0 20rpx;
			color: #2e2e30;
			font-size: 20rpx;
			border-radius: 5rpx;
			background: #fcf5ee;
		}
	}
	.jobs-fr{
		position: relative;
	}
	.jobs-money-text{
		color: #ff5f56;
		font-size: 30rpx;
		font-weight: bold;
		display: inline-block;
		vertical-align: middle;
	}
	.jobs-money-icon{
		display: inline-block;
		vertical-align: middle;
		background-image: url('~@/static/icon-money.png');
		background-size: 100% 100%;
		margin-right: 10rpx;
		width: 42rpx;
		height: 42rpx;
	}
}
</style>
