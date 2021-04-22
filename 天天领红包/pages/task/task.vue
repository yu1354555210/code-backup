<template>
	<view class="content">
		<view class="task-header">
			<text>可领红包个数：{{ totalNum }}</text>
			<view
				class="task-rule-btn btn"
				@click="
					setDialogStatus();
					dialogType = 1;
				"
			>
				<text>任务规则</text>
				<image src="https://app1-api.qianr.com/static/bonus/icon-help.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="task-video-box" v-if="dataList.length > 0">
			<image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-video-bg.png" mode="aspectFill"></image>
			<view class="task-video-title">看视频</view>
			<view class="task-video-step">
				<image
					:src="index < videoNum ? 'https://app1-api.qianr.com/static/bonus/task-video-ok.png' : `https://app1-api.qianr.com/static/bonus/${index + 1}.png`"
					mode="aspectFill"
					v-for="(item, index) in imgList"
					:key="index"
				></image>
			</view>
			<view class="btn video-btn" @click="tapVideoAd()" v-show="!isCountDown" v-text="videoNum == 10 ? '已完成' : '去完成'"></view>
			<view class="btn video-btn countdown-btn" v-show="isCountDown">
				<countdown-timer ref="countdown" :time="getTime" @finish="onFinish">
					<template v-slot="{ minute, second }">
						<text>{{ minute }}</text>
						<text>:</text>
						<text>{{ second }}</text>
					</template>
				</countdown-timer>
			</view>
		</view>
		<view class="task-other-list">
			<block v-for="(item, index) in dataList" :key="index">
				<view class="task-other-item" v-if="item.name == '签到'">
					<image class="image-bg" :src="`https://app1-api.qianr.com/static/bonus/task-item-img1.png`" mode="aspectFill"></image>
					<view class="title">每日签到</view>
					<view class="btn" :class="item.status == 1 ? 'cur' : ''" @click="signIn(item.status)" v-text="statusInfo(item.status)"></view>
				</view>
				<view class="task-other-item" v-if="item.name == '邀请好友'">
					<image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-item-img2.png" mode="aspectFill"></image>
					<view class="title">新用户助力</view>
					<button class="btn" v-if="getLoginStatus" open-type="share" :class="item.status == 1 ? 'cur' : ''" @click="inviteStatus = true" v-text="statusInfo(item.status)"></button>
					<view class="btn" v-else :class="item.status == 1 ? 'cur' : ''" v-text="statusInfo(item.status)" @click="inviteShare()"></view>
				</view>
				<view class="task-other-item" v-if="item.name == '分享群聊'">
					<image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-item-img3.png" mode="aspectFill"></image>
					<view class="title">告诉朋友们</view>
					<block>
						<view class="btn cur" v-if="item.status == 1" v-text="statusInfo(item.status)" @click="shareDialog()"></view>
						<view class="btn" v-else v-text="statusInfo(item.status)" @click="tellFriend()"></view>
					</block>
				</view>
			</block>
		</view>

		<view class="ad-view"><ad unit-id="adunit-77fa0902d43cd522"></ad></view>

		<block v-show="dialogType != 0">
		<!-- 规则弹窗 -->
		<v-dialog v-show="dialogType == 1">
			<view class="dialog-rule">
				<view class="rule-title">规则</view>
				<view class="rule-list">
					<text>1.完成当日任务，随机掉落红包次数</text>
					<text>2.每日任务可能不同</text>
					<text>3.新用户助力：只有邀请新用户才算哦</text>
				</view>
			</view>
		</v-dialog>

		<!-- 转发弹窗 -->
		<v-dialog v-show="dialogType == 2">
			<view class="dialog-text"><text>发送到群聊才有效哦~</text></view>
			<button class="dialog-btn" open-type="share" @click="shareStatus = true">去发送</button>
		</v-dialog>
		</block>

		<!-- 提示toast -->
		<view class="cu-modal" :class="isShowToast ? 'show' : ''">
			<view class="toast-wrapper">
				<text>完成{{ taskName }}任务</text>
				<text>可领取红包个数+{{ bonus }}</text>
			</view>
		</view>

		<!-- 登录弹窗 -->
		<v-login-model></v-login-model>
	</view>
</template>

<script>
import vDialog from '@/components/vDialog.vue';
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			dialogType: 0,
			videoNum: 0,
			imgList: 10,
			totalNum: 0,
			dataList: '',
			bonus: '', //返回可领红包个数
			isShowToast: false,
			isCountDown: false,
			time: 15, //默认15秒
			videoBtnStatus: false,
			shareStatus: false, //点击分享按钮后改变状态
			inviteStatus: false,
			timer: null, //轮询定时器
			taskName: '',
			videoAd: null,
			subStatus: 1
		};
	},
	onLoad() {
		this.$utils.videoAdInit("adunit-ac3122f99ef897e2");
		// if (wx.createRewardedVideoAd) {
		// 	this.videoAd = wx.createRewardedVideoAd({
		// 		adUnitId: 'adunit-9762db7761c52528'
		// 	});
		// 	this.videoAd.onLoad(() => {
		// 		console.log('onLoad')
		// 	});
			
		// 	this.videoAd.onError(err => {
		// 		console.log(err);
		// 	});
		// }
	},
	onShow() {
		if (!this.getLoginStatus) {
			this.setLoginDialogStatus();
		} else {
			if (this.inviteStatus) {
				this.timer = setInterval(() => {
					this.getInviteStatus();
				}, 1000 * 10);
			}
		}
		if (this.shareStatus) {
			this.shareStatus = false;
			this.tellFriend();
		}
		if (this.inviteStatus) {
			this.inviteStatus = false;
		}

		this.getTaskData();
	},
	mounted() {
		this.$nextTick(function() {
			setTimeout(()=>{
				this.getTaskData(() => {
					this.countTime();
				});
			},30);
		});
	},
	computed: {
		...mapGetters(['getDialogStatus', 'token', 'getLoginStatus', 'getInfo']),
		...mapState(['loginDialogStatus']),
		getTime() {
			let time = parseInt(this.time * 1000);
			return time;
		}
	},
	components: {
		vDialog
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
		}
		return {
			title: '天天领红包',
			imageUrl: 'https://app1-api.qianr.com/static/bonus/share.png',
			path: `/pages/index/index?inviteCode=${this.getInfo.invite_code}`
		};
	},
	//监听状态是否发生改变
	watch: {
		getLoginStatus(newValue, oldValue) {
			if (newValue) {
				//值发生改变执行的函数
				this.getTaskData(() => {
					this.countTime();
				});
			}
		}
	},
	methods: {
		...mapMutations(['setDialogStatus', 'setLoginDialogStatus']),
		showToast() {
			this.isShowToast = true;
			setTimeout(() => {
				this.isShowToast = false;
			}, 2000);
		},
		statusInfo(status) {
			return status == 1 ? '未完成' : '已完成';
		},
		signIn(status) {
			let tmplIds = 'VNmGHIB7BZVQ8trb1kr0BIvlPOj3AS99Y-NHsPjInxk';
			this.checkLogin(() => {
				if (status == 1) {
					if(this.subStatus == 2){ //如果没有订阅过, 弹出订阅弹窗
						uni.requestSubscribeMessage({
							tmplIds: [tmplIds],
							success: res => {
								this.showVideoAd(() => {
									this.getSignInData();
								});
								if (res[tmplIds] === 'accept') {
									this.postSubscribe();
									uni.showToast({
										icon: 'none',
										title: '订阅成功'
									});
								}
							}
						});
					}else{
						this.showVideoAd(() => {
							this.getSignInData();
						});
					}
				} else {
					this.getSignInData();
				}
			});
		},
		postSubscribe(){ //订阅接口
			this.$http
				.post('/api/bonus/v1/subscribe', { token: this.token })
				.then(res => {
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},
		getSignInData() {
			this.$http
				.post('/api/bonus/v1/sign_in', { token: this.token })
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.bonus = data.bonus;
						this.taskName = '签到';
						this.showToast();
						this.getTaskData();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},
		showVideoAd(callback) {
			
			uni.showLoading({
				title: '广告加载中'
			})
			
			// 显示
			this.$utils.videoAdShow(()=>{
				uni.hideLoading();
					if((this.videoNum + 1) % 5 == 0){
						uni.showToast({
							icon: 'none',
							duration: 20000,
							title: '点击下方按钮，可能触发惊喜'
						});
					}
						}) 
				.then((res) => {
					if (res) {
					 // 成功
						callback && callback();
					} else {
						console.log("失败了");
					}
				})
				.catch((err) => {
					uni.hideLoading();
							uni.showToast({
								icon: 'none',
						title: '视频加载失败了,稍后再试'
							});
						});
			
			// this.videoAd.onClose(res => {
			// 	if (!this.videoAd) return;
			// 	this.videoAd.offClose();
			// 	// 用户点击了【关闭广告】按钮
			// 	if (res && res.isEnded) {
			// 		// 正常播放结束，可以下发游戏奖励
			// 		callback && callback();
			// 	} else {
			// 		// 播放中途退出，不下发奖励
			// 		uni.showToast({
			// 			icon: 'none',
			// 			title: '播放中途退出，不下发奖励'
			// 		});
			// 	}
			// });
			
			// // 用户触发广告后，显示激励视频广告
			// if (this.videoAd) {
			// 	this.videoAd.show().then(()=>{
			// 		if((this.videoNum + 1) % 5 == 0){
			// 			uni.showToast({
			// 				icon: 'none',
			// 				duration: 20000,
			// 				title: '点击下方按钮，可能触发惊喜'
			// 			});
			// 		}
			// 	}).catch(() => {
			// 		// 失败重试
			// 		this.videoAd
			// 			.load()
			// 			.then(() => {
			// 				this.videoAd.show();
			// 			}) 
			// 			.catch(err => {
			// 				uni.showToast({
			// 					icon: 'none',
			// 					title: '广告显示失败'
			// 				});
			// 				console.log('激励视频 广告显示失败');
			// 			});
			// 	});
			// }
		},
		shareDialog() {
			this.checkLogin(() => {
				this.setDialogStatus();
				this.dialogType = 2;
			});
		},
		inviteShare() {
			this.checkLogin();
		},
		tellFriend() {
			this.$http
				.post('/api/bonus/v1/tell_friend', { token: this.token })
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.bonus = data.bonus;
						this.taskName = '告诉朋友们';
						this.showToast();
						this.getTaskData();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},
		watchVideo() {
			this.$http
				.post('/api/bonus/v1/watch_video', { token: this.token })
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.videoNum = data.num;
						if (data.bonus > 0) {
							this.bonus = data.bonus;
							this.taskName = '看视频';
							this.showToast();
							this.getTaskData();
						}
						//最后一个任务看完视频直接变成已完成,不需要倒计时
						if (this.videoNum === 10) {
							this.videoBtnStatus = true;
							this.isCountDown = false;
							this.$refs.countdown.reset();
						} else {
							this.toggleCountDown();
							this.$refs.countdown.start();
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},
		onFinish() {
			this.countTime();
			this.toggleCountDown();
		},
		tapVideoAd() {
			this.checkLogin(() => {
				if (this.videoNum === 10) {
					uni.showToast({
						icon: 'none',
						title: '今日任务已完成'
					});
					return;
				}

				this.showVideoAd(() => {
					this.watchVideo();
				});
			});
		},
		toggleCountDown() {
			this.isCountDown = !this.isCountDown;
		},
		countTime() {
			return (this.time = 15 + this.videoNum * 5);
			// return this.time = 1 + this.videoNum * 0.5;
		},
		getTaskData(callback) {
			//写回调
			this.$http
				.get('/api/bonus/v1/task', {
					params: {
						token: this.token
					}
				})
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.totalNum = data.total;
						this.videoNum = data.video_num;
						this.dataList = data.info;
						this.subStatus = data.sub_status;
						callback && callback();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},
		getInviteStatus() {
			this.$http
				.get('/api/bonus/v1/get_status', {
					params: {
						token: this.token
					}
				})
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						if (data.num > 0) {
							this.bonus = data.num;
							this.taskName = '新用户助力';
							this.showToast();
							this.getTaskData();
							clearInterval(this.timer);
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		}
	},
	onHide() {
		this.setDialogStatus(false);
		this.dialogType = 0;
		clearInterval(this.timer);
	}
};
</script>

<style lang="stylus">
.ad-view
	margin 20rpx
.task-other-list
	display flex
	justify-content space-between
	padding 40rpx 20rpx
	.task-other-item
		position relative
		width 223rpx
		height 300rpx
		text-align center
		display flex
		flex-direction column
		align-items center
		.title
			font-size 34rpx
			font-weight bold
			color #FFFFFF
			margin 15rpx 0 10rpx
		.btn
			width 100rpx
			height 40rpx
			border 1rpx solid #FFFFFF
			font-size 24rpx
			color #FFFFFF
			&.cur
				background-color #FFFFFF
				color #FE3226
.task-header
	display flex
	justify-content space-between
	align-items center
	height 130rpx
	padding 0 20rpx
	&>text
		font-size 30rpx
		color #999999
	.task-rule-btn
		width 161rpx
		height 50rpx
		background rgba(254, 50, 38, 0)
		border 1rpx solid #FE3226
		text
			font-size 26rpx
			color #FE3226
		image
			width 25rpx
			height 25rpx
			margin-left 12rpx
.task-video-box
	position relative
	height 277rpx
	&::after
		content ''
		display block
		width 613rpx
		height 3rpx
		background #D1160A
		position absolute
		top 133rpx
		left 63rpx
		z-index -1
	.task-video-title
		font-size 34rpx
		color #FFFFFF
		padding 30rpx 20rpx 0
	.task-video-step
		padding 30rpx 20rpx
		display flex
		align-items center
		justify-content space-between
		image
			width 62rpx
			height 62rpx
	.video-btn
		width 160rpx
		height 50rpx
		background #FFFFFF
		border 1rpx solid #FFFFFF
		font-size 28rpx
		color #FF5045
		margin-left auto
		margin-right 20rpx
		font-weight bold
		&.countdown-btn
			background-color transparent
			color #FFFFFF
.rule-title
	text-align center
	font-size 28rpx
	font-weight bold
	color #333333
	margin 20rpx 0
.rule-list
	display flex
	flex-direction column
	font-size 24rpx
	color #999999
	line-height 48rpx
	text-align left
.toast-wrapper
	width 354rpx
	height 186rpx
	background #FFFFFF
	border-radius 18px
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -50%)
	display flex
	align-items center
	justify-content center
	flex-direction column
	font-size 28rpx
	font-weight bold
	color #333333
	line-height 40rpx
</style>
