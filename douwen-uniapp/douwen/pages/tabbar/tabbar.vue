<template>
	<view>
		<index v-if="PageCur=='index'"></index>
		<contribution v-if="PageCur=='contribution'"></contribution>
		<mine v-if="PageCur=='mine'"></mine>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="index">
				<view class='cuIcon-cu-image'>
					<image :src="'../../static/index' + [PageCur=='index'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='index'?'text-red':'text-gray'">抖文</view>
			</view>
			<view class="action" @click="NavChange" data-cur="contribution">
				<view class='cuIcon-cu-image' style="width: 216rpx; height: 92rpx;">
					<image src="../../static/gx.png" style="width: 100%; height: 100%; margin-top: 10rpx;"></image>
				</view>
			</view>
			<view class="action" @click="NavChange" data-cur="mine">
				<view class='cuIcon-cu-image'>
					<image :src="'../../static/mine' + [PageCur == 'mine'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='mine'?'text-red':'text-gray'">我的	</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'index'
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			}
		}
	}
</script>

<style>

</style>
