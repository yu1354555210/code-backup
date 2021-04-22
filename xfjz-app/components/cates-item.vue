<template>
	<view>
		<view class="cates-item" v-for="(item, index) in list" :key="index">
			<image class="cates-item-bg" :src="'../../static/item-' + (index + 1) + '-bg.png'"></image>
			<view class="cates-fl">
				<view v-text="item.title" @click="toNavList(item)"></view>
			</view>
			<view class="cates-fr">
				<view v-for="(it, idx) in item.child" :key="idx" @click="toNavList(it)" v-text="it.title"></view>
			</view>
		</view>
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
		}
	},
	methods:{
		toNavList(item){
			console.log(item);
			uni.navigateTo({
				url:`../../pages/nav-list/index?id=${item.id}&where=cateList&cateTitle=${item.title}`
			})
		}
	}
};
</script>

<style lang="less">
.cates-item {
	width: 100%;
	height: 180rpx;
	background-size: 100% 100%;
	display: flex;
	align-items: center;
	color: #ffffff;
	margin-bottom: 20rpx;
	border-radius: 20rpx;
	position: relative;
	.cates-item-bg{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.cates-fl {
		width: 240rpx;
		flex: 0 0 240rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		&>view {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 100%;
		}
	}
	.cates-fr {
		display: flex;
		flex-wrap: wrap;
		flex: 1;
		&>view {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 90rpx;
			flex: 0 0 50%;
			font-size: 24rpx;
		}
	}
}
</style>
