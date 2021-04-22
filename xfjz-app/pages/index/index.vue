<template>
	<view class="content">
		<view class="status-bar"><!-- 这里是状态栏 --></view>
		<home v-if="PageCur == 'home'"></home>
		<classify v-if="PageCur == 'classify'"></classify>
		<mine v-if="PageCur == 'mine'"></mine>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="classify">
				<view class="cuIcon-cu-image"><image :src="'/static/icon-tabbar1' + [PageCur == 'classify' ? '-cur' : ''] + '.png'"></image></view>
				<view :class="PageCur == 'classify' ? 'text-blue' : 'text-gray'">分类</view>
			</view>
			<view class="action text-gray add-action" data-cur="home" @click="NavChange">
				<button class="cu-btn cuIcon-index bg-white"><image src="../../static/icon-home.png" mode=""></image></button>
			</view>
			<view class="action" @click="NavChange" data-cur="mine">
				<view class="cuIcon-cu-image"><image :src="'/static/icon-tabbar2' + [PageCur == 'mine' ? '-cur' : ''] + '.png'"></image></view>
				<view :class="PageCur == 'mine' ? 'text-blue' : 'text-gray'">我的</view>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			PageCur: 'home'
		};
	},
	mounted() {
	},
	methods: {
		NavChange: function(e) {
			this.PageCur = e.currentTarget.dataset.cur;
		},
	}
};
</script>

<style lang="less">
.text-blue {
	color: #64abfe;
}

.cuIcon-index {
	width: 88rpx !important;
	height: 88rpx !important;
	top: -42rpx !important;
	image {
		width: 100%;
		height: 100%;
	}
}
</style>
