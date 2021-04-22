<template>
	<view>
		<index v-if="PageCur=='index'"></index>
		<category v-if="PageCur=='category'"></category>
		<mine v-if="PageCur=='mine'"></mine>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="index">
				<view class='cuIcon-cu-image'>
					<image :src="'../../static/index' + [PageCur=='index'?'-cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='index'?'text-yellow':'text-gray'">抖文</view>
			</view>
			<view class="action" @click="NavChange" data-cur="category">
				<view class='cuIcon-cu-image'>
					<image :src="'../../static/category' + [PageCur == 'category'?'-cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='category'?'text-yellow':'text-gray'">分类</view>
			</view>
			<view class="action" @click="NavChange" data-cur="mine">
				<view class='cuIcon-cu-image'>
					<image :src="'../../static/mine' + [PageCur == 'mine'?'-cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='mine'?'text-yellow':'text-gray'">我的	</view>
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
.text-yellow{
	color: #FFBB00;
}
</style>
