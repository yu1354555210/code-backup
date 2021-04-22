<template>
	<view>
		<view class="tui-container-in">
			<view class="tui-content-out" :class="['tui-award-'+(index+1),index==indexSelect?'tui-awardSelect':'']" v-for="(item,index) in awards"
			 :key="index">
				<image class="tui-award-image" :src="item.prize_image"></image>
				<view class="award-text" v-text="item.prize_name"></view>
			</view>
			<view class="tui-btn-start pulse" :class="[isRunning?'tui-ative':'']" @tap="drawAward">
				<image src="../../static/award-btn.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="award-other">
			<text>今天剩余次数{{count}}次</text>
		</view>
	</view>
</template>

<script>
	var videoAd;
	var timer;
	export default {
		data() {
			return {
				animate: false,
				initSpeed: 200, // 初始速度
				speed: null, // 变化速度
				diff: 20, // 速度变化的值，值越大，变化地越快
				award: {}, // 抽中的奖品
				awards: [ // 奖品列表
					// {
					// 	id: 1,
					// 	img: "../hongbao.png",
					// 	name: '潘多拉音箱'
					// },
					// {
					// 	id: 2,
					// 	img: "../hongbao.png",
					// 	name: '小酷M1耳机'
					// },
					// {
					// 	id: 3,
					// 	img: "../hongbao.png",
					// 	name: '酷狗VIP会员'
					// },
					// {
					// 	id: 4,
					// 	img: "../hongbao.png",
					// 	name: '8元话费'
					// },
					// {
					// 	id: 5,
					// 	img: "../hongbao.png",
					// 	name: '12元话费'
					// },
					// {
					// 	id: 6,
					// 	img: "../hongbao.png",
					// 	name: '谢谢参与'
					// },
					// {
					// 	id: 7,
					// 	img: "../hongbao.png",
					// 	name: '4元话费'
					// },
					// {
					// 	id: 8,
					// 	img: "../hongbao.png",
					// 	name: '谢谢参与'
					// }
				],
				time: 0, // 记录开始抽奖的时间
				current: 0, // 当前转动的位置
				isRuningLucky: false, // 是否正在抽奖
				indexSelect: -1, //被选中的奖品index
				isRunning: false ,//是否正在抽奖
				count: 0 //剩余次数
			}
		},
		destroyed() {
			clearTimeout(timer);
		},
		mounted(){
			this.$nextTick(function(){
				this.getData();
			})
		},
		methods: {
			setCount(count){
				this.count = count;
			},
			getData(){
				this.$http.get('/bargain_v1/envelope/items',{
					params:{
						token: this.$store.getters.token
					}
				})
					.then(res => {
						console.log(res.data);
						let data = res.data.data;
						if(res.data.code == 1){
							this.awards = data.prizeList;
							this.count = data.time;
						}
					}).catch(err => {
						console.log(err);
					})
			},
			handleStart() {
				if (this.isRunning) {
					return uni.showToast({
						title: '正在抽奖中...',
						icon: 'none'
					});
				}
				if (isNaN(Number(this.initSpeed))) {
					return false;
				}
				this.speed = this.initSpeed;
				// 开始抽奖
				this.isRunning = true;
				this.time = Date.now();
				this.getAwardId();
				
			},
			drawAward() {
				if (!this.isRunning) {
					if(this.count <= 0){
						this.$parent.showInvitePopup();
						return false;
					}
					this.$parent.initBtnStatus();
					this.openVideoAd();
				}else{
					uni.showToast({
						title: '正在抽奖中...',
						icon: 'none'
					});
				}
			},
			getAwardId(){
				this.$http.get('/bargain_v1/envelope/win',{
					params:{
						token: this.$store.getters.token
					}
				})
					.then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							let data = res.data.data;
							this.award = {
								id: data.prize_id
							}
							this.move();
							this.count = data.envelope_time;
						}
						if(res.data.code == 0){
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
							this.isRunning = false;
							clearTimeout(timer);
							return;
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							icon: 'none',
							title: '请求失败'
						})
						this.isRunning = false;
					})
			},
			move() {
				timer = setTimeout(() => {
					this.indexSelect++;
					if (this.indexSelect > 7) {
						this.indexSelect = 0;
					}
					// 若抽中的奖品id存在，则开始减速转动
					if (this.award.id && (Date.now() - this.time) / 1000 > 1) {
						this.speed += this.diff; // 转动减速

						// 若转动时间超过4秒，并且奖品id等于小格子的奖品id，则停下来
						if (
							(Date.now() - this.time) / 1000 > 2 && this.award.id == this.awards[this.indexSelect].id
						) {
							clearTimeout(timer);

							setTimeout(() => {
								this.isRunning = false;
								// 这里写停下来要执行的操作（弹出奖品框）
								let awardData = {
									name: this.awards[this.indexSelect].prize_name,
									id: this.awards[this.indexSelect].id,
									count: this.count,
									type: this.awards[this.indexSelect].prize_type
								};
								this.$parent.awardData(awardData);
								this.$parent.getNoticeData();
								// uni.showModal({
								// 	title: '恭喜您',
								// 	content: "您抽中的奖品是" + this.awards[this.indexSelect].name + ",奖品id是" + this.awards[this.indexSelect].id,
								// 	confirmColor: '#5677FC',
								// 	showCancel: false, //去掉取消按钮
								// 	success: (res) => {
								// 		if (res.confirm) {
								// 			this.isRunning = false
								// 		}
								// 	}
								// })
							}, 400);
							return;
						}

						// 若抽中的奖品不存在，则加速转动
					} else {
						if (this.speed >= 50) {
							this.speed -= this.diff; // 转动加速
						}
					}

					this.move();
				}, this.speed);
			},
			openVideoAd(){
				console.log('打开激励视频');
				this.adGet();//这个地方就是调用了广告函数，然后直接展示
				if (videoAd) {
				  videoAd.load()
				    .then(() => {
				  	console.log('激励视频加载成功');
				  	videoAd.show().then(() => {
				  	  console.log('激励视频 广告显示成功')
				  	})
				  	.catch(err => {
				  	  console.log('激励视频 广告显示失败')
				  	})
				    })
				    .catch(err => {
				  	console.log('激励视频加载失败');
				    })
				}
			},
			adGet(){
				let that = this;
				console.log(timer);
				if (qq.createRewardedVideoAd) {
					videoAd = qq.createRewardedVideoAd({
					  adUnitId: 'bd236d90efb9379b38e3bd54ab9c2dd6'
					})
					
					videoAd.onError(function(res){
					  console.log('videoAd onError',res)
					})
					videoAd.onLoad(function(res){
					  console.log('videoAd onLoad',res)
					})
					videoAd.onClose(function(status){
					  console.log('videoAd onClose',status)
					   if (status && status.isEnded || status === undefined) {
							// 正常播放结束，下发奖励
							// continue you code
							console.log(' 正常播放结束，下发奖励');
							that.handleStart();
						  } else {
							  console.log('播放中途退出，进行提示');
							  uni.showToast({
								 icon:'none',
							  	title: '视频看完有才有奖励哦'
							  })
							// 播放中途退出，进行提示
						  }
					})
					
				}
			}
		}
	}
</script>

<style>
	.container {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.tui-container-in {
		width: 100%;
		height: 600rpx;
		padding: 40rpx;
		margin: auto;
	}

	.tui-content-out {
		position: absolute;
		height: 160rpx;
		width: 163rpx;
		background-color: #fff4d0;
		border-radius: 15upx;
		box-shadow: 0 3px 0 #fbd161;
	}

	/* 580 530  */

	.tui-award-1 {
		left: 43upx;
		top: 44upx;
	}

	.tui-award-2 {
		left: 232upx;
		top: 44upx;
	}

	.tui-award-3 {
		left: 422upx;
		top: 44upx;
	}

	.tui-award-4 {
		left: 422upx;
		top: 232upx;
	}

	.tui-award-5 {
		left: 422upx;
		top: 418upx;
	}

	.tui-award-6 {
		left: 232upx;
		top: 418upx;
	}

	.tui-award-7 {
		left: 43upx;
		top: 418upx;
	}

	.tui-award-8 {
		left: 43upx;
		top: 232upx;
	}

	/**居中 加粗*/

	.tui-btn-start {
		position: absolute;
		top: 232upx;
		left: 229rpx;
		height: 170rpx;
		width: 170rpx;
	}

	.tui-btn-start image {
		height: 100%;
	}

	.tui-ative {
		opacity: 0.6 !important;
	}

	.tui-award-image {
		height: 100upx;
		width: 163upx;
		display: block;
		position: relative;
	}

	.award-text {
		color: #cb6328;
		font-size: 24rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
	}

	.tui-awardSelect::after {
		background: url(../../static/award-cur-bg.gif);
		width: 193rpx;
		height: 193rpx;
		background-size: 100% 100%;
		position: absolute;
		border-radius: 20rpx;
		top: -14rpx;
		left: -16rpx;
		z-index: -1;
		content: "";
	}
	.award-other{
		text-align: center;
		color: #FFFFFF;
		margin-top: 10rpx;
		font-size: 26rpx;
	}
</style>
