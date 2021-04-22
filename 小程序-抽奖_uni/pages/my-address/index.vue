<template>
	<view class="address-container">
		<view class="address-body" v-if="isData">
			<image class="address-bg" src="../../static/images/address-bg.png" mode="aspectFill"></image>
			<view class="address-list">
				<view class="address-my-top">
					<view>
						<text v-text="userInfo.username"></text>
						<text v-text="userInfo.mobile"></text>
					</view>
					<navigator :url="'../change-address/index?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))">
						<image src="../../static/images/edit-icon.png" mode="aspectFill"></image>
					</navigator>
				</view>
				<view class="address-my-bottom">
					<image src="../../static/images/address-icon.png" mode="aspectFill"></image>
					<text>{{ addr + userInfo.addr_info }}</text>
				</view>
			</view>
		</view>
		<view v-else class="address-no-data">
			<button type="primary" class="public-btn" @click="toChangeAddress">设置新地址</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isData: '',
			userInfo: [],
			addr: ''
		};
	},
	computed: {
	},
	onShow() {
		this.getData();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: '大奖天天抽',
			path: '/pages/index/index'
		};
	},
	methods: {
		getData() {
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: getApp().globalData.apiUrl + 'api/paddress/api',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				},
				data: {
					token: uni.getStorageSync('token'),
					api_name: 'get_address'
				},
				success: res => {
					if (res.data.code == 1) {
						this.userInfo = res.data.data;
						this.addr = this.userInfo.addr.replace(/-/gi,'');
						this.isData = true;
					} else {
						this.isData = false;
					}
				},
				fail: res => {
					uni.showToast({
						title: res.data.msg
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		toChangeAddress(){
			uni.navigateTo({
				url: '../change-address/index'
			})
		}
	}
};
</script>

<style lang="less">
.address-my-top {
	height: 85rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx dashed #bcbcbc;
	color: #3d4347;
	font-size: 26rpx;
	position: relative;
	text {
		margin-right: 30rpx;
	}
	navigator {
		width: 50rpx;
		height: 50rpx;
		image {
			height: 100%;
		}
	}
}
.address-my-bottom {
	font-size: 24rpx;
	color: #85889a;
	display: flex;
	align-items: center;
	height: 80rpx;
	image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
	text {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}

.address-no-data{
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc( 100vh - 40rpx );
}
</style>
