<template>
	<view class="content">
		<view class="lottery-bg">
			<image src="../../static/lottery-bg.jpg" mode="aspectFill"></image>
		</view>
		<view class="notice-box">
			<notice :isLottery="true" ref="notice"></notice>
		</view>
		<view class="lottery-box">
			<lottery ref="lottery"></lottery>
		</view>
		<uni-popup  ref="popup" type="center" :animation="false">
			<view class="popup-wrapper">
				<view class="popup-info">
					<view v-text="awardInfo"></view>
					<text v-text="award"></text>
				</view>
				<view class="popup-btn-box">
					<view class="popup-btn pulse" v-show="isShowAgainBtn" @click="againAward">
						<image src="../../static/again-btn.png" mode="aspectFill"></image>
					</view>
					<button open-type="share" class="popup-btn" v-show="isShowInviteBtn">
						<image src="../../static/invite-popup-btn.png" mode="aspectFill"></image>
					</button>
					<view class="popup-btn" v-show="isShowInputQqBtn" @click="showQqPopup">
						<image src="../../static/input-qq-btn.png" mode="aspectFill"></image>
					</view>
					<navigator url="../awards/index" class="popup-btn" v-show="isShowMyAwardBtn">
						<image src="../../static/my-award-btn.png" mode="aspectFill"></image>
					</navigator>
					<navigator url="../cash/index" class="popup-btn" v-show="isShowCashBtn">
						<image src="../../static/award-cash-btn.png" mode="aspectFill"></image>
					</navigator>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import notice from '@/components/notice/index.vue'
	import lottery from '@/components/luckdraw/luckdraw.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				awardInfo: '运气好到爆，你抽到了',
				award: '', //中奖信息
				isShowInviteBtn: false, //显示邀请按钮
				isShowAgainBtn: false, //显示再玩一次按钮
				isShowInputQqBtn: false, //显示输入qq按钮
				isShowMyAwardBtn: false, //显示我的奖品按钮
				isShowCashBtn: false, //显示提现按钮
			};
		},
		onLoad() {
		},
		components: {
			notice,
			lottery,
			uniPopup
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			let shareInfo = getApp().globalData.shareInfo;
			let randomImg = shareInfo [Math.floor(Math.random() * shareInfo .length)];
			return {
			  title: randomImg,
			  imageUrl: getApp().globalData.imageUrl,
			  path: '/pages/invite/index?shareid='+ uni.getStorageSync('uid'),
			  complete: ()=>{
				  this.$http.get('/bargain_v1/envelope/add-time',{
					  params: {
						  token: this.$store.getters.token
					  }
				  })
				  	.then(res => {
				  		console.log(res.data);
						if(res.data.code == 1){
							this.$refs.lottery.setCount(res.data.data.envelope_time);
						}else{
							uni.showToast({
								icon:'none',
								title: '今日获取次数达到上限'
							})
						}
				  	}).catch(err => {
				  		console.log(err);
				  	})
					this.$refs.popup.close();
			  }
			}
		},
		methods:{
			initBtnStatus(){
				this.isShowInviteBtn = false;
				this.isShowAgainBtn = false;
				this.isShowInputQqBtn = false;
				this.isShowMyAwardBtn = false;
				this.isShowCashBtn = false;
				this.awardInfo = '运气好到爆，你抽到了';
			},
			awardData(data){
				//通过抽奖子组件传入中奖名称
				console.log(data);
				this.award = data.name;
				switch (data.type){
					case 1:
						this.isShowMyAwardBtn = true;
						break;
					case 2:
						this.isShowMyAwardBtn = true;
						break;
					case 3:
						this.isShowMyAwardBtn = true;
						break;
					case 4:
						this.isShowAgainBtn = true;
						this.awardInfo = '差一点就抽中了';
						this.award = '';
						break;
					default:
						break;
				}
				if(data.count > 0){
					this.isShowAgainBtn = true;
					this.isShowInviteBtn = false;
				}else{
					this.isShowInviteBtn = true;
					this.isShowAgainBtn = false;
				}
				this.$refs.popup.open();
			},
			againAward(){
				this.$refs.popup.close();
				this.$refs.lottery.drawAward();
			},
			showQqPopup(){
				this.$refs.inputQq.showPopup();
			},
			getNoticeData(){
				this.$refs.notice.getLotteryData();
			},
			showInvitePopup(){
				this.awardInfo = '剩余次数不足';
				this.award = '';
				this.isShowInviteBtn = true;
				this.$refs.popup.open();
			}
		}
	}
</script>

<style lang="stylus">
page
	background-color #fd572b
	width 100%
.content
	position relative
	.lottery-bg
		position absolute
		z-index -1
		width 100%
		height 100%
		image
			height 1206rpx
.notice-box
	width 100%
	height 110rpx
	padding 0 16rpx
	position absolute
	top 255rpx
.lottery-box
	position absolute
	top 364rpx
	left 50%
	transform translateX(-50%)
	width 630rpx
	height 670rpx
.popup-wrapper
	width 600rpx
	background-color #FFFFFF
	border-radius 20rpx
	text-align center
	padding 50rpx 0
.popup-info
	font-size 38rpx
	text
		display block
		color #f03d0a
		margin 20rpx 0
.popup-btn-box
	display flex
	justify-content center
	align-items center
	flex-direction column
.popup-btn
	width 450rpx
	height 100rpx
	margin-bottom 20rpx
	padding 0
	&:first-child
		margin-bottom 30rpx
	image
		height 100%
</style>
