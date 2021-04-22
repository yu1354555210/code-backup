<template name="mine">
	<view>
		<view class="mine-top-main main">
			<view class="notes-link"><navigator url="../perfect/index">完善简历</navigator></view>
			<view class="mine-info">
				<view class="mine-avatar"><image :src="avatarUrl" mode="aspectFill"></image></view>
				<!-- <view class="mine-login-text">未登录</view> -->
				<view class="mine-login-info">
					<text v-if="nickname != null" v-text="nickname"></text>
					<text v-if="mobile != null">电话: {{ mobile }}</text>
					<view v-if="tags != null" class="mine-login-tag" v-text="tags"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="mine-navbar">
				<view class="this-title this-title-mine"><text class="title-info">我的兼职</text></view>
				<view class="mine-navbar-list">
					<navigator url="../nav-list/index?page=baoming">
						<image src="../../static/mine-navbar1.png" mode="aspectFill"></image>
						<text>已报名</text>
					</navigator>
					<navigator url="../nav-list/index?page=luyong">
						<image src="../../static/mine-navbar2.png" mode="aspectFill"></image>
						<text>已录用</text>
					</navigator>
					<navigator url="../nav-list/index?page=shoucang">
						<image src="../../static/mine-navbar3.png" mode="aspectFill"></image>
						<text>已收藏</text>
					</navigator>
				</view>
			</view>
			<view class="mine-list">
				<navigator url="../message/index" class="solid-bottom mine-item arrow">
					<view class="mine-item-left">
						<image src="../../static/icon-message.png" mode="aspectFill"></image>
						<text>我的消息</text>
					</view>
				</navigator>
				<view @click="openScore" class="solid-bottom mine-item arrow">
					<view class="mine-item-left">
						<image src="../../static/icon-score.png" mode="aspectFill"></image>
						<text>给我们评分</text>
					</view>
				</view>
				<navigator url="../setting/index" class="solid-bottom mine-item arrow">
					<view class="mine-item-left">
						<image src="../../static/icon-setting.png" mode="aspectFill"></image>
						<text>设置</text>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			name: ''
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.getData();
		});
	},
	computed: {
		...mapGetters(['token', 'avatarUrl', 'nickname', 'mobile', 'tags'])
	},
	methods: {
		...mapMutations(['setMobile', 'setTag', 'setNickname']),
		getData() {
			if (!this.avatarUrl) {
				uni.request({
					url: 'http://ubase.qianr.com/api/public/?service=user.getAvatar',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: this.token
					},
					success: res => {
						if (res.data.code == 1) {
							this.updateAvatar(res.data.data.avatar);
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
			this.$http
				.get('/v1/user/resume-view', {
					params: {
						token: this.token
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 1) {
						let data = res.data.data;
						// this.name = this.nickname || data.real_name;
						console.log('data.real_name: ' + data.real_name);
						this.setNickname(data.real_name);
						this.setMobile(data.mobile);
						this.setTag(data.tag);
					}
				})
				.catch(err => {});
		},
		openScore() {
			let url = 'https://apps.apple.com/cn/app/id1493744393';
			// #ifdef APP-PLUS
			plus.runtime.openURL(url);
			// #endif
			// #ifdef H5
			window.location.href = url;
			// #endif
		}
	}
};
</script>

<style lang="less">
.mine-top-main {
	height: 489rpx;
	width: 100%;
	background-size: 100% 100%;
	background-image: url('~@/static/mine-bg.png');
}
.notes-link {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	color: #ffffff;
	font-size: 30rpx;
	padding-top: 70rpx;
}
.mine-info {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding-top: 60rpx;
	.mine-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: #ffffff;
		border: 3rpx solid rgba(71, 168, 215, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}
	.mine-login-text {
		color: #ffffff;
		font-size: 30rpx;
		font-weight: bold;
	}
	.mine-login-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 24rpx;
		text {
			margin-bottom: 10rpx;
		}
		.mine-login-tag {
			font-size: 20rpx;
			background-image: url('~@/static/mine-info-bg.png');
			background-size: 100% 100%;
			padding-bottom: 8rpx;
			width: 507rpx;
			height: 52rpx;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
.mine-navbar {
	width: 100%;
	min-height: 221rpx;
	box-shadow: 0px 3px 7px 0px rgba(104, 155, 254, 0.35);
	border-radius: 20px;
	padding: 20rpx 0;
	margin-top: 20rpx;
	.mine-navbar-list {
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
		navigator {
			display: flex;
			flex-direction: column;
			image {
				width: 100rpx;
				height: 100rpx;
			}
			text {
				font-size: 20rpx;
			}
		}
	}
}
</style>
