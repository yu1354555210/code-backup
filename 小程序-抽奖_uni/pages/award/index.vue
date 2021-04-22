<template>
	<view>
		<view class="award-container">
			<view class="award-info">
				<view class="award-info-top">
					<image src="../../static/images/award-bg.png" class="award-info-bg" mode="aspectFill"></image>
					<image :src="awardInfo.img" class="award-image" mode="aspectFill"></image>
				</view>
				<view class="award-info-bottom">
					<text v-text="awardInfo.name"></text>
					<text>
						<text v-text="awardInfo.start_time"></text>
						开奖
					</text>
				</view>
			</view>
			<view class="award-lottery">
				<image src="../../static/images/award-btn.png" mode="aspectFill" @click="openVideoAd"></image>
				<view>
					<image src="../../static/images/quan-icon.png" mode="aspectFill"></image>
					抽奖券: {{ award_counts }}张
				</view>
			</view>
			<view class="award-total-person">
				已有
				<text>{{ totalCount }}</text>
				人参与
			</view>
			<view class="award-person-list">
				<image class="award-person-item" v-for="(item, index) in personList" :key="index" :src="item.avatar" mode="aspectFill" v-if="index < 17"></image>
				<image class="more" v-if="personList.length >= 17" src="../../static/images/more-icon.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="invite-popup-container" v-if="isShowPopup" @click="isShowPopup = false">
			<view class="invite-popup" @click.stop="isShowPopup = true">
				<image src="../../static/images/invite-popup.png" class="invite-popup-bg" mode="aspectFill"></image>
				<view class="invite-popup-info">
					<view>今天的视频都看完啦！</view>
					<view>快去邀请好友，+5奖券/人哦！</view>
				</view>
				<view class="invite-popup-btn"><button type="primary" class="public-btn" open-type="share">去邀请</button></view>
			</view>
		</view>
	</view>
</template>

<script>
// import { Base64 } from 'js-base64';
import { mapState, mapMutations, mapGetters } from 'vuex';
var videoAd = null;
export default {
	data() {
		return {
			award_counts: 0,
			awardInfo: '',
			personList: [],
			totalCount: 0,
			awardId: '',
			isShowPopup: false
		};
	},
	// filters: {
	// 	Base64Decode(value){
	// 		return Base64.decode(value)
	// 	}
	// },
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
			return {
				title: '大奖天天抽',
				path: `/pages/index/index?sid=${this.getOpenid}&awardId=${this.awardId}`
			};
		}
		return {
			title: '大奖天天抽',
			path: '/pages/index/index'
		};
	},
	computed: {
		...mapGetters(['getOpenid'])
	},
	onShow() {
		this.getData();
	},
	onLoad(option) {
		this.awardId = option.id;
		// 在页面中定义激励视频广告
		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-4a96e5b8c27a94c1'
			});
			videoAd.onLoad(() => {
				console.log('onLoad event emit');
			});
			videoAd.onError(err => {
				console.log(err.errCode);
				if (err.errCode == 1004) {
					this.isShowPopup = true;
				} else {
					uni.showToast({
						icon: 'none',
						title: '视频播放失败,紧急修复中！'
					});
				}
				console.log('onError event emit', err);
			});
			videoAd.onClose(res => {
				console.log('onClose event emit', res);
			});
		}
		videoAd.offClose();
		videoAd.onClose(res => {
			if (res && res.isEnded) {
				// 正常播放结束，可以下发游戏奖励
				uni.request({
					url: getApp().globalData.apiUrl + 'api/pchoujiang/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						token: uni.getStorageSync('token'),
						choujiang_id: this.awardId,
						api_name: 'choujiang_ad_log2'
					},
					success: res => {
						console.log('正常播放结束，下发游戏奖励');
						this.getData();
					},
					fail: res => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {}
				});
			} else {
				console.log('播放中途退出，不下发游戏奖励');
				// 播放中途退出，不下发游戏奖励
			}
		});
	},
	methods: {
		getData() {
			uni.showLoading({
				title: '加载中'
			});
			uni.request({
				url: getApp().globalData.apiUrl + 'api/pchoujiang/api',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				},
				data: {
					token: uni.getStorageSync('token'),
					choujiang_id: this.awardId,
					api_name: 'choujiang_detail2'
				},
				success: res => {
					if (res.data.code == 1) {
						this.awardInfo = res.data.data.xcx_choujiang_manage_list;
						this.award_counts = res.data.data.see_ad_counts;
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
					uni.hideLoading();
				},
				fail: res => {
					uni.showToast({
						title: res.data.msg
					});
					uni.hideLoading();
				},
				complete: () => {}
			});
			uni.request({
				url: getApp().globalData.apiUrl + 'api/pchoujiang/api',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				},
				data: {
					token: uni.getStorageSync('token'),
					choujiang_id: this.awardId,
					api_name: 'part_users'
				},
				success: res => {
					this.totalCount = res.data.data.total_part_users_counts;
					this.personList = res.data.data.list;
				},
				fail: res => {
					uni.showToast({
						title: res.data.msg
					});
				},
				complete: () => {}
			});
		},
		openVideoAd() {
			// 用户触发广告后，显示激励视频广告
			if (videoAd) {
				videoAd.show().catch(() => {
					// 失败重试
					videoAd
						.load()
						.then(() => videoAd.show())
						.catch(err => {
							console.log('激励视频 广告显示失败', err);
						});
				});
			}
		}
	}
};
</script>

<style lang="less">
.invite-popup-container {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background-color: rgba(0, 0, 0, 0.5);
	.invite-popup {
		width: 572rpx;
		height: 484rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding-top: 160rpx;
		.invite-popup-info {
			text-align: center;
			color: #ffffff;
			font-size: 32rpx;
		}
		.invite-popup-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
	}
}
.invite-popup-btn {
	padding: 100rpx 100rpx 0;
	.public-btn {
		width: 100%;
	}
}
</style>
