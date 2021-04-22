<template>
	<view class="content">
		<view class="notice-box">
			<notice :isHome="true"></notice>
		</view>
		<view class="focus">
			<image src="../../static/focus.jpg" mode="aspectFill"></image>
		</view>
		<view class="section" v-if="newPersonGift">
			<view class="home-title">
				<view class="title-fl">
					<image src="../../static/icon-gift.png" mode="aspectFill"></image>
					<text>新手福利</text>
				</view>
				<view class="title-fr">
					{{hour}}小时{{min}}分{{second}}秒后福利失效
				</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in newPersonList" :key="index" >
					<view class="item-fl">
						<image :src="item.prize_image" mode="aspectFill"></image>
					</view>
					<view class="item-fr">
						<view class="item-title" v-text="item.name"></view>
						<block v-if="item.bargain_status == 1">
							<view class="progress-box">
								<progress :percent="item.bargain_per" active stroke-width="8" border-radius="4" activeColor="#ff5754" backgroundColor="#d9d9d9"/>
							</view>
							<view class="item-bottom">
								<view class="percent">
									已砍{{item.bargain_per}}%
								</view>
								<view class="outtime">
									<down-time :endTime="item.expire_time" :startTime="new Date().getTime()" :endMsg="砍价结束" ></down-time>
								</view>
								<button type="primary" class="item-btn"  @click="toDetail(item.id)">继续砍价</button>
							</view>
						</block>
						<view class="item-bottom" v-else>
							<view class="user-num">{{item.own_user_number}}人已成功领取</view>
							
							<view class="pos-r">
								<button class="getuser-btn" v-if="!getLoginStatus" type="primary" open-type="getUserInfo" data-router='detail' :data-id='item.id' @getuserinfo="bindGetUserInfo"></button>
								<button type="primary" class="item-btn active" @click="toDetail(item.id)">点击免费拿</button>
							</view>
							
						</view>
					</view>
				</view>	
			</view>
		</view>
		<view class="section">
			<view class="home-title">
				<view class="title-fl">
					<image src="../../static/icon-kanjia.png" mode="aspectFill"></image>
					<text>热门砍价</text>
				</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in hotList" :key="index">
					<view class="item-fl">
						<image :src="item.prize_image" mode="aspectFill"></image>
					</view>
					<view class="item-fr">
						<view class="item-title" v-text="item.name"></view>
						<block v-if="item.bargain_status == 1">
							<view class="progress-box">
								<progress :percent="item.bargain_per" active stroke-width="8" border-radius="4" activeColor="#ff5754" backgroundColor="#d9d9d9"/>
							</view>
							<view class="item-bottom">
								<view class="percent">
									已砍{{item.bargain_per}}%
								</view>
								<view class="outtime">
									<down-time :endTime="item.expire_time" :startTime="new Date().getTime()" :endMsg="砍价结束" ></down-time>
								</view>
								<button type="primary" class="item-btn"  @click="toDetail(item.id)">继续砍价</button>
							</view>
						</block>
						<view class="item-bottom" v-else>
							<view class="user-num">{{item.own_user_number}}人已成功领取</view>
							<view class="pos-r">
								<button class="getuser-btn" v-if="!getLoginStatus" type="primary" open-type="getUserInfo" data-router='detail' :data-id='item.id' @getuserinfo="bindGetUserInfo"></button>
								<button type="primary" class="item-btn active" @click="toDetail(item.id)">点击免费拿</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fix-redbags swing">
			<image src="../../static/fix-redbags.png" mode="aspectFill" @click="toLottery"></image>
			<button class="getuser-btn" v-if="!getLoginStatus" type="primary" open-type="getUserInfo" data-router='lottery' @getuserinfo="bindGetUserInfo"></button>
		</view>
		<uni-popup type="center" ref="redbagsPopup">
			<view class="redbags-popup-wrapper">
				<image src="../../static/icon-close.png" mode="aspectFill" class="icon-close" @click="$refs.redbagsPopup.close()"></image>
				<image src="../../static/redbags-popup.png" mode="aspectFill" class="redbags-popup" @click="newPersonRedbags(newPersonData.id)"></image>
				<button class="getuser-btn" v-if="!getLoginStatus" type="primary" open-type="getUserInfo" data-router='detail' :data-id='newPersonData.id'  @getuserinfo="bindGetUserInfo"></button>
			</view>
		</uni-popup>
		<uni-popup type="center" ref='isWinPopup'>
			<view class="success-wrapper">
				<image src="../../static/close.png" mode="aspectFill" class="icon-close" @click="$refs.isWinPopup.close()"></image>
				<view class="success-award-info">
					<view><text v-text="bargainData.name"></text></view>
					<view>砍价成功，快去领奖吧</view>
				</view>
				<image src="../../static/success-img.png" mode="aspectFill" class="sucess-image"></image>
				<image src="../../static/success-btn.png" mode="aspectFill" class="success-btn" @click="toAwardsPage(bargainData.id)"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import notice from '@/components/notice/index.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import downTime from '@/components/downTime/index.vue'
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				newPersonGift: false,
				curStartTime: '',
				day: '0',
				hour: '00',
				min: '00',
				second: '00',
				newPersonData: '',
				newPersonList: '',
				hotList: '',
				bargainData: ''
			}
		},
		computed: {
			...mapGetters(['getLoginStatus','token'])
		},
		components: {
			notice,
			uniPopup,
			downTime
		},
		onLoad() {
			this.$http.get('/bargain_v1/active/default',{params: {token: this.token}})
				.then(res => {
					console.log(res.data);
					let data = res.data.data;
					if(res.data.code == 1){
						this.newPersonData = data;
					}
				}).catch(err => {
					console.log(err);
				})
				
		},
		onShow() {
			this.unitData();
		},
		methods: {
			...mapMutations(['login','setToken']),
			unitData(){
				if(this.token){
					this.getUserStatus();
				}
				this.getHotList();
				if(this.newPersonGift){
					this.getNewPersonList();
				}
				if(this.token){
					this.getIsWinAward();
				}
			},
			toDetail(id){
				uni.navigateTo({
					url: `../detail/index?id=${id}`
				})
			},
			newPersonRedbags(id){
				if(this.getLoginStatus == false){
					this.userLogin();
				}else{
					this.toDetail(id);
				}
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
			getUserStatus(){
				this.$http.get('/bargain_v1/user/status',{params: {token: this.token}})
					.then(res => {
						let data = res.data.data;
						console.log(data);
						if(res.data.code == 1){
							if(data.is_new == 1){
								this.newPersonGift = true;
								this.curStartTime = data.last_time
								this.newPersonCountTime(); //新手倒计时
								this.getNewPersonList();
							}
							if(data.first_status === 0){ //用户首次进入小程序
								this.$refs.redbagsPopup.open();
							}
						}
					}).catch(err => {
						console.log(err);
					})
			},
			getNewPersonList(){
				this.$http.get('/bargain_v1/active/new-welfare',{params: {token: this.token}})
					.then(res => {
						let data = res.data.data;
						console.log(data);
						if(res.data.code == 1){
							this.newPersonList = data;
						}
					}).catch(err => {
						console.log(err);
					})
			},
			getHotList(){
				this.$http.get('/bargain_v1/active/hot-list',{params: {token: this.token}})
					.then(res => {
						let data = res.data.data;
						console.log(data);
						if(res.data.code == 1){
							this.hotList = data;
						}
					}).catch(err => {
						console.log(err);
					})
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
					let router = e.currentTarget.dataset.router;
					let id = e.currentTarget.dataset.id || '';
					this.login(e.detail.userInfo);
					this.userLogin(avatar,username,router,id);
					
				}
			},
			toLottery(){
				uni.navigateTo({
					url: '../lottery/index'
				})
			},
			getIsWinAward(){ //检查是否有砍价成功的
				this.$http.get('/bargain_v1/bargain/has-new',{params: {token: this.token}})
					.then(res => {
						let data = res.data.data;
						console.log(data);
						if(res.data.code == 1){
							if(res.data.data.bargainStatus == 1){
								this.bargainData = data.bargainList[0];
								this.$refs.isWinPopup.open();
							}
						}
					}).catch(err => {
						console.log(err);
					})
			},
			toAwardsPage(){  //砍价成功弹窗去领奖
				this.$http.get('/bargain_v1/bargain/read-new',{params: {token: this.token,id: this.bargainData.id}})
					.then(res => {
						let data = res.data.data;
						if(res.data.code == 1){
							uni.navigateTo({
								url: '../awards/index',
								success: ()=> {
									this.$refs.isWinPopup.close();
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
			userLogin(avatar,username,router,id){
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
							that.getHotList();
							that.getUserStatus();
							uni.navigateTo({
								url: `../${router}/index?id=${id}`
							})
							
						}).catch(err => {
							console.log(err);
						})
				  }
				});
			},
			outTimeEnd(){
				this.unitData();
				this.getHotList();
				console.log('结束啦')
			}
			
		}
	}
</script>
<style lang="stylus">
.notice-box
	width 100%
	z-index 66
	position absolute
	height 66rpx
.focus
	width 100%
	height 266rpx
	position relative
	image
		height 100%
.pos-r
	position relative
.section
	overflow hidden
	padding 25rpx 15rpx
.home-title
	display flex
	justify-content space-between
	align-items center
	.title-fl
		font-size 34rpx
		color #ff5754
		display flex
		align-items center
		image
			width 40rpx
			height 40rpx
			margin-right 10rpx
			display inline-block
			vertical-align middle
	.title-fr
		font-size 26rpx
		color #999999
		display flex
		align-items center
.item
	padding 30rpx 0
	display flex
	justify-content space-between
	align-items center
	height 260rpx
	border-bottom 2rpx solid #eeeeee
	.item-fl
		width 206rpx
		height 206rpx
		flex 0 0 206rpx
		border-radius 50%
		margin-right 25rpx
		overflow hidden
		image
			height 100%
	.item-fr
		flex 1
		height 100%
		display flex
		flex-direction column
		justify-content space-around
		.item-title
			font-size 30rpx
			color #000000
			font-weight bold
			white-space nowrap
			overflow hidden
		.progress-box
			width 380rpx
			margin-left 10rpx
		.item-bottom
			margin-left 10rpx
			display flex
			justify-content space-between
			align-items center
			.user-num
				color #ff6600
				font-size 30rpx
			.percent
				font-size 30rpx
				color #ff5754
			.outtime
				font-size 24rpx
				color #999999
				margin-left 35rpx
			.item-btn
				width 182rpx
				height 66rpx
				font-size 30rpx
				padding 0
				margin 0
				background-color #ff9031
				&.active
					background-color #d84936
.redbags-popup-wrapper
	position relative
	width 600rpx
	height 760rpx
	.redbags-popup
		height 100%
	.icon-close
		width 78rpx
		height 78rpx
		position absolute
		top 12rpx
		right 12rpx
		z-index 666
.getuser-btn
	width 100%
	height 100%
	position absolute
	left 0
	top 0
	z-index 6
	background-color transparent !important
.fix-redbags
	position fixed
	width 160rpx
	height 160rpx
	right 30rpx
	top 318rpx
	image
		height 100%
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
</style>
