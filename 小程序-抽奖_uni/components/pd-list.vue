<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view class="list">
		<view class="item" v-for="(item,index) in list" :key="index" @click="toAward(item.choujiang_id)" >
			<view class="item-top">
				<image src="../static/images/item-finish.png" mode="aspectFill" class="finish-tag" v-if="isShowFinish"></image>
				<view class="item-image award-image">
					<image :src="item.img" mode="aspectFill"></image>
				</view>
				<view class="item-body">
					<view class="item-title" v-text="item.periods"></view>
					<view class="item-name" v-text="item.name"></view>
					<view class="item-time">{{item.start_time}}开奖</view>
					<view class="item-person">已有{{item.see_ad_counts}}人参与</view>
				</view>
			</view>
			<view class="item-bottom" v-if="isShowBottom">
				<button type="primary" v-text="btnText"></button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list: { // 数据列表
				type: Array,
				default(){
					return []
				}
			},
			isShowBottom: {
				type: Boolean,
				default(){
					return false
				}
			},
			isShowFinish: {
				type: Boolean,
				default(){
					return false
				}
			},
			btnText: {
				type: String,
				default(){
					return '去抽奖'
				}
			}
		},
		methods: {
			emptyClick(mescroll) {
				uni.switchTab({
					url: '../index/index'
				})
			},
			toAward(id){
				let url = '../award/index';
				if(this.isShowFinish){
					url = '../award-finish/index';
				}
				uni.navigateTo({
					url: `${url}?id=${id}`
				})
			}
		},
	}
</script>

<style lang="less">
	
</style>
