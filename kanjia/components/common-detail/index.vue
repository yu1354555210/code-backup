<template>
	<view>
		<view class="bargain">
			<image class="bargain-bg" src="../../static/bargain-bg.png" mode="aspectFill"></image>
			<view class="bargain-top">
				<image :src="dataList.active_image" mode="aspectFill"></image>
				<view class="bargain-top-info">
					<view class="bargain-top-title" v-text="dataList.active_name"></view>
					<view class="bargain-top-dec">砍到0{{dataList.prize_unit}}免费拿</view>
					<view class="bargain-top-outtime">
						{{hour}}小时{{min}}分{{second}}秒后结束</text>
					</view>
				</view>
			</view>
			<view class="bargain-body">
				<view class="progress-box">
					<view class="progress-info">已砍<text>{{dataList.chopped_money}}</text>{{dataList.prize_unit}}，还差<text>{{dataList.need_money}}{{dataList.prize_unit}}</text>可提现</view>
					<progress :percent="dataList.bargain_per" active stroke-width="8" border-radius="4" activeColor="#ff5754" backgroundColor="#d9d9d9"/>
				</view>
				<view class="bargain-btn-box">
					<view class="video-ad-btn bargain-btn pulse">
						<block v-if="page == 'invite'">
							<button class="getuser-btn" v-if="!getLoginStatus" type="primary" open-type="getUserInfo"  @getuserinfo="bindGetUserInfo"></button>
							<image src="../../static/friend-btn.png" mode="aspectFill"  @click="openVideoAd()" ></image>
						</block>
						<image src="../../static/again2-btn.png" mode="aspectFill" v-else  @click="openVideoAd()"></image>
					</view>
					<button open-type="share" class="bargain-btn">
						<image src="../../static/bargain-yellow-btn.png" mode="aspectFill" class="bargain-btn-bg"></image>
						<text>邀请好友助力，领取更多红包</text>
					</button>
				</view>
				<view class="bargain-other-info">
					秘籍：邀请新用户助力提现更快速～
				</view>
			</view>
		</view>
		<view class="notice-box">
			<notice></notice>
		</view>
		<view class="record">
			<image src="../../static/record-title.png" mode="aspectFill" class="record-title"></image>
			<view class="record-item" v-for="(item,index) in recordList" :key="index" v-if="recordList">
				<view class="record-item-fl">
					<image :src="item.avatar" mode="aspectFill"></image>
					<text v-text="item.username"></text>
				</view>
				<view class="record-item-fr">
					帮你砍了<text>{{item.bargain_price}}{{item.prize_unit}}</text>
				</view>
			</view>
		</view>
		<uni-popup type="center" ref='popup'>
			<view class="success-wrapper">
				<image src="../../static/close.png" mode="aspectFill" class="icon-close" @click="$refs.popup.close()"></image>
				<view class="success-award-info">
					<view><text v-text="dataList.active_name"></text></view>
					<view>砍价成功，快去领奖吧</view>
				</view>
				<image src="../../static/success-img.png" mode="aspectFill" class="sucess-image"></image>
				<image src="../../static/success-btn.png" mode="aspectFill" class="success-btn" @click="toAwardsPage"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import notice from '@/components/notice/index.vue'
	import { mapState, mapMutations, mapGetters } from 'vuex'
	var videoAd;
	export default {
		data() {
			return {
				recordList: '',
				bargain_id: 0,
				dataList: '',
				id: '',
				curStartTime: '',
				day: '0',
				hour: '00',
				min: '00',
				second: '00',
			}
		},
		props:{
			page: {
				default: 'detail'
			}
		},
		components:{
			...mapGetters(['getLoginStatus','token']),
			notice,
			uniPopup
		},
		mounted() {
			this.$nextTick(function(){
				uni.showLoading({
					title:'加载中'
				});
				this.id = this.$parent.id;
				this.getDetailData();
				this.adGet();//这个地方就是调用了广告函数，然后直接展示
			})
		},
		onLoad() {
		},
		computed:{
			...mapGetters(['token','getLoginStatus']),
		},
		methods: {
			...mapMutations(['login','setToken']),
			getDetailData(){
				let url = 'detail';
				let data = {
					token: this.token, 
					active_id: this.id
				}
				if(this.page == 'invite'){
					url = 'invite-detail';
					data = {
						bargain_id: this.id
					}
				}
				this.$http.get( `/bargain_v1/bargain/${url}`,{params: {...data}})
					.then(res => {
						uni.hideLoading();
						console.log(res.data);
						if(res.data.code == 1){
							let data = res.data.data;
							this.dataList = data;
							this.bargain_id = data.bargain_id;
							this.curStartTime = data.expire_time;
							this.newPersonCountTime();
							this.getRecordList();
							if(this.page == 'invite'){
								this.$parent.setInviteData(data);
							}
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							setTimeout(()=>{
								uni.switchTab({
									url: '../../pages/index/index'
								})
							},1500)
						}
					}).catch(err => {
						console.log(err);
					})
			},
			getRecordList(){
				this.$http.get('/bargain_v1/invite/list',{
					params: {
						token: this.token,
						bargain_id: this.bargain_id,
					}})
					.then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							let data = res.data.data;
							this.recordList = data;
						}
					}).catch(err => {
						console.log(err);
					})
			},
			// 倒计时
			newPersonCountTime () {
			  // 获取当前时间
			  let date = new Date()
			  let now = date.getTime()
			  // 设置截止时间
			  // let endDate = new Date(this.curStartTime) // this.curStartTime需要倒计时的日期
			  // let end = endDate.getTime()
			  let end = this.curStartTime
			  // 时间差
			  let leftTime = end - now
			  // 定义变量 d,h,m,s保存倒计时的时间
			  if (leftTime >= 0) {
			    // 天
			    this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
			    // 时
			    let h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
			    this.hour = h < 10 ? '0' + h : h
			    // 分
			    let m = Math.floor(leftTime / 1000 / 60 % 60)
			    this.min = m < 10 ? '0' + m : m
			    // 秒
			    let s = Math.floor(leftTime / 1000 % 60)
			    this.second = s < 10 ? '0' + s : s
			  } else {
			    this.day = 0
			    this.hour = '00'
			    this.min = '00'
			    this.second = '00'
			  }
			  // 等于0的时候不调用
			  if (Number(this.hour) === 0 && Number(this.day) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {
				  console.log('到点了')
				  this.newPersonGift = false;
			    return
			  } else {
			  // 递归每秒调用newPersonCountTime方法，显示动态时间效果,
			    setTimeout(this.newPersonCountTime, 1000)
			  }
			},
			bargain(){
				this.$http.get('/bargain_v1/invite/bargain',{params: {token: this.token, bargain_id: this.bargain_id}})
					.then(res => {
						console.log(res.data);
						if(res.data.code == 1){
							let data = res.data.data;
							if(data.result == 1){
								this.$refs.popup.open();
							}else{
								this.getDetailData();
							}
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
						}
					}).catch(err => {
						console.log(err);
					})
			},
			openVideoAd(){
				this.$http.get('/bargain_v1/bargain/time',{params: {token: this.token,bargain_id: this.bargain_id}})
					.then(res => {
						let data = res.data.data;
						console.log(res);
						if(res.data.code == 1){
							if(res.data.data.own_time != 0){
								if (videoAd) {
									console.log('打开激励视频');
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
								 //  videoAd.show().catch(err => {
									// // 失败重试
									// videoAd.load()
									//   .then(() => videoAd.show())
								 //  })
								}
							}else{
								if(this.page == 'detail'){
									this.$parent.showCountPopup();
								}else{
									uni.showToast({
										title: '砍价次数不足'
									})
								}
							}
						}else{
							uni.showToast({
								title: res.data.msg || '请求失败'
							})
						}
					}).catch(err => {
						console.log(err);
					})
				
			},
			adGet(){
				let that = this;
				if (qq.createRewardedVideoAd) {
					videoAd = qq.createRewardedVideoAd({
					  adUnitId: 'f77ed470fc7ac19f34d0558baa78e500'
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
							that.bargain();
							console.log(' 正常播放结束，下发奖励');
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
			},
			toAwardsPage(){  //砍价成功弹窗去领奖
				this.$http.get('/bargain_v1/bargain/read-new',{params: {token: this.token,id: this.bargain_id}})
					.then(res => {
						let data = res.data.data;
						if(res.data.code == 1){
							uni.navigateTo({
								url: '../awards/index',
								success: ()=> {
									this.$refs.popup.close();
								}
							})
						}else{
							uni.showToast({
								title: res.data.msg
							})
						}
					}).catch(err => {
						console.log(err);
					})
			},
			userLogin(avatar,username){
				let that = this;
				uni.login({
				  provider: 'qq',
				  success: function (loginRes) {
					let code = loginRes.code;
					that.$http.post('/bargain_v1/user/login',{
							code: code,
							avatar: avatar,
							username: username
						},{
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							}
						})
						.then(res => {
							console.log(res.data);
							let data = res.data.data;
							that.setToken(data.token);
							uni.setStorageSync('uid',data.uid);
							that.openVideoAd();
						}).catch(err => {
							console.log(err);
						})
				  }
				});
			},
			bindGetUserInfo(e){
				console.log(e);
				if(!e.detail.iv){  
					uni.showToast({  
						icon: 'none',
						title: "登录失败！"  
					});  
					return false;  
				} else{
					let avatar = e.detail.userInfo.avatarUrl;
					let username = e.detail.userInfo.nickName;
					this.login(e.detail.userInfo);
					this.userLogin(avatar,username);
					
				}
			},
		}
	}
</script>

<style lang="stylus">
.bargain
	position relative
	width 718rpx
	height 807rpx
	margin  0 0 30rpx
	.bargain-bg
		position absolute
		width 100%
		height 100%
		z-index -1
	.bargain-top
		display flex
		align-items center
		height 228rpx
		padding 0 30rpx
		image
			width 166rpx
			height 166rpx
			border-radius 50%
			margin-right 38rpx
		.bargain-top-info
			height 166rpx
			padding 10rpx 0
			display flex
			flex-direction column
			justify-content space-between
			.bargain-top-title
				font-size 34rpx
				font-weight bold
			.bargain-top-dec
				font-size 30rpx
				color #ff5754
			.bargain-top-outtime
				color #ff9031
				font-size 24rpx
	.progress-box
		text-align center
		padding 85rpx 0 0
		progress
			margin 20rpx auto
			width 480rpx
		.progress-info
			font-size 40rpx
			color #000000
			font-size bold
			text
				color #ec473f
	.bargain-btn-box
		margin 0 auto
		display flex
		justify-content center
		flex-direction column
		align-items center
		.bargain-btn
			width 591rpx
			height 106rpx
			margin-bottom 20rpx
			position relative
			display flex
			align-items center
			justify-content center
			color #cb6328
			background-color transparent
			padding 0
			font-size 38rpx
			font-weight 600
			.bargain-btn-bg
				position absolute
				z-index -1
				width 100%
				height 100%
			&>image{
				height 100%
			}
			&.video-ad-btn
				color #FFFFFF
			.icon-video
				width 50rpx
				height 43rpx
				margin-right 10rpx
		.align-center
			display flex
			align-items center
	.bargain-other-info			
		font-size 30rpx
		color #cb6328
		text-align center
.notice-box
	height 84rpx
	overflow hidden
	border-radius 10rpx
.record
	text-align center
	background-color rgba(0,0,0,.3)
	border-radius 10rpx
	margin-top 30rpx
	padding 30rpx 25rpx 15rpx
	overflow hidden
	.record-title
		width 254rpx
		height 35rpx
.record-item
	width 100%
	height 100rpx
	display flex
	align-items center
	justify-content space-between
	color #FFFFFF
	background-color rgba(0,0,0,.3)
	font-size 30rpx
	padding 0 30rpx
	border-radius 10rpx
	margin-top 28rpx
	.record-item-fl
		display flex
		align-items center
		image
			width 80rpx
			height 80rpx
			border-radius 50%
			margin-right 20rpx
	.record-item-fr
		text
			color #feee85
.success-wrapper
	width 600rpx
	height 750rpx
	background-color #FFFFFF
	border-radius 20rpx
	text-align center
	position relative
	padding 65rpx 0
	.icon-close
		position absolute
		width 32rpx
		height 30rpx
		right 30rpx
		top 30rpx
	.success-award-info
		font-size 30rpx
		color #000000
		line-height 50rpx
		text
			font-size 40rpx
			color #fb5d2b
	.sucess-image
		width 496rpx
		height 411rpx
		display inline-block
		margin 0 auto 20rpx
	.success-btn
		width 300rpx
		height 90rpx
		display inline-block
.getuser-btn
	width 100%
	height 100%
	position absolute
	left 0
	top 0
	z-index 6
	background-color transparent !important
</style>