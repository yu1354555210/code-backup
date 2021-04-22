<template>
	<view>
		<!-- <view class="status-bar"></view> -->
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="right">
				<view class="action">
					<navigator url="../HM-search/HM-search"><text class="cuIcon-search"></text></navigator>
				</view>
			</block>
		</cu-custom>
		<view class="main">
			<view class="this-title this-title-big"><text class="title-info">设置</text></view>
			<view class="mine-list">
				<navigator url="" class="solid-bottom mine-item arrow" @click="clearCache">
					<view class="mine-item-left">
						<image src="../../static/icon-clear.png" mode="aspectFill"></image>
						<text>清除缓存</text>
					</view>
					<view class="text-gray text-sm"></view>
				</navigator>
				<view class="solid-bottom mine-item">
					<view class="mine-item-left">
						<image src="../../static/icon-about.png" mode="aspectFill"></image>
						<text>{{ version }}</text>
					</view>
				</view>
			</view>
			<view class="logout" @click="$store.commit('logout')">退出当前账号登录</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			messageList: [],
		};
	},
	components: {},
	mounted() {
		this.$nextTick(function() {
		});
	},
	computed: {
		...mapGetters(['token']),
		version() {
			return this.$version;
		}
	},
	methods: {
		clearCache() {
			uni.clearStorageSync();
			uni.showToast({
				icon: 'none',
				title: '清理缓存'
			});
		}
	}
};
</script>

<style lang="less">
.message-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	.message-image {
		margin-right: 20rpx;
		image {
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
		}
	}
	.message-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		.message-title {
			font-size: 30rpx;
			font-weight: bold;
		}
		.message-time {
			line-height: 40rpx;
			color: rgba(164, 164, 167, 1);
			font-size: 20rpx;
		}
		.message-desc {
			font-size: 24rpx;
			color: rgba(153, 153, 153, 1);
		}
	}
}
.logout{
	height:88rpx;
	background:rgba(255,255,255,1);
	box-shadow:0px 3rpx 7rpx 0px rgba(104, 154, 257, 0.35);
	border-radius:44rpx;
	font-size:30rpx;
	color:rgba(106,149,254,1);
	margin-top: 20%;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
