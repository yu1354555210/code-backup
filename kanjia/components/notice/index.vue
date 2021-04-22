<template>
	<view class="notice-content">
		<block v-if="isShowNoitce">
			<block v-if="isLottery">
				<view class="notice notice-lottery">
					<scroll-view scroll-y="true" style="height: 60rpx;">
						<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration" :vertical="vertical">
							<swiper-item v-for="(item,index) in swiperList" :key="index">
								<image :src="item.avatar" mode="aspectFill"></image>
								<view class="text-red">
									{{item.username}}成功领取<text>{{item.prize_name}}</text>
								</view>
							</swiper-item>
						</swiper>
					</scroll-view>
				</view>
			</block>
			<block v-else>
				<view class="notice" :class="isHome?'notice-home':''">
					<scroll-view scroll-y="true" style="height: 60rpx;">
						<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration" :vertical="vertical">
							<swiper-item v-for="(item,index) in swiperList" :key="index">
								<image :src="item.avatar" mode="aspectFill"></image>
								<view :class="isHome?'text-yellow':''">
									{{item.username}}成功领取<text>{{item.active_name}}</text>
								</view>
							</swiper-item>
						</swiper>
					</scroll-view>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				autoplay: true,
				interval: 1000,
				duration: 500,
				vertical: true,
				swiperList: 5,
				isShowNoitce: false
			}
		},
		props:{
			isHome: { //判断是否是首页的通告,  首页通告样式有些区别
				type: Boolean,
				default: false
			},
			isLottery: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.$nextTick(function(){
				if(this.isLottery){
					this.getLotteryData();
				}else{
					this.getData();
				}
			})
		},
		methods: {
			getData(){
				this.$http.get('/bargain_v1/bargain/success-list')
					.then(res => {
						console.log(res.data);
						let data = res.data.data;
						if(res.data.code == 1){
							if(data.length > 0){
								this.isShowNoitce = true;
								this.swiperList = data;
							}
						}
					}).catch(err => {
						console.log(err);
					})
			},
			getLotteryData(){
				this.$http.get('/bargain_v1/envelope/list',{
					params:{
						token: this.$store.getters.token
					}
				})
					.then(res => {
						console.log(res.data);
						let data = res.data.data;
						if(res.data.code == 1){
							if(data.length > 0){
								this.isShowNoitce = true;
								this.swiperList = data;
							}
						}
					}).catch(err => {
						console.log(err);
					})
			}
		}
	}
</script>

<style lang="stylus">
.notice-content
	width 100%
	height 100%
.notice
	width 100%
	height 100%
	display flex
	justify-content center
	align-items center
	overflow hidden
	color #FFFFFF
	font-size 26rpx
	padding 0 40rpx
	background-color rgba(0,0,0,.3)
	z-index 66
	&.notice-home
		background-color rgba(0,0,0,.5)
	&.notice-lottery
		background-color transparent
	image
		width 50rpx
		height 50rpx
		border-radius 50%
		margin-right 20rpx
	swiper
		height 100%
		swiper-item
			display flex
			align-items center
			.text-yellow
				text
					color #fbe884
			.text-red
				color #000000
				text
					color #d03a1c
</style>
