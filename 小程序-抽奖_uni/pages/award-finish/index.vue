<template>
	<view>
		<view class="award-container">
			<view class="award-info">
				<view class="award-info-top">
					<image src="../../static/images/item-finish.png" class="award-finish-tag" mode="aspectFill"></image>
					<image src="../../static/images/award-bg.png" class="award-info-bg" mode="aspectFill"></image>
					<image :src="awardInfo.img" class="award-image" mode="aspectFill"></image>
				</view>
				<view class="award-info-bottom">
					<text v-text="awardInfo.name"></text>
					<text>{{awardInfo.start_time}} 开奖</text>
				</view>
			</view>
			<view class="award-user award-ranking">
				<view class="award-user-title">
					<image src="../../static/images/gift-icon.png" mode="aspectFill"></image>
					<text>中奖用户</text>
				</view>
				<view class="award-ranking-body">
					<view class="no-ranking" v-if="awardUserList.length == 0">
						<text>暂无数据</text>
					</view>
					<view class="award-ranking-list" v-else>
						<view class="award-ranking-item" v-for="(item,index) in awardUserList" :key="index">
							<view class="avatar">
								<image :src="item.img" mode="aspectFill"></image>
							</view>
							<view class="nickname">{{item.user_show_name|Base64Decode}}</view>
							<view class="total">
								<image src="../../static/images/gold-icon.png" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="award-total-person">已有<text>{{totalCount}}</text>人参与</view>
			<view class="award-person-list">
				<image class="award-person-item" v-for="(item,index) in personList" :key="index" :src="item.avatar" mode="aspectFill" v-if="index < 17"></image>
				<image class="more" v-if="personList.length > 18" src="../../static/images/more-icon.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { Base64 } from 'js-base64';
	export default {
		data() {
			return {
				seeAdCount: 0,
				awardInfo: '',
				personList: [],
				totalCount: 0,
				awardUserList: []
			}
		},
		onLoad(option) {
			console.log(option)
			this.getData(option)
		},
		filters: {
			Base64Decode(value){
				return Base64.decode(value)
			}
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
			getData(option) {
				uni.request({
					url: getApp().globalData.apiUrl	+ 'api/pchoujiang/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						token: uni.getStorageSync('token'),
						choujiang_id: option.id,
						api_name: 'choujiang_detail2',
					},
					success: res => {
						if(res.data.code == 1){
							this.awardInfo = res.data.data.xcx_choujiang_manage_list;
							this.seeAdCount = res.data.data.see_ad_counts;
						}else{
							uni.showToast({
								title: res.data.msg
							});
						}
					},
					fail: (res) => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {}
				});
				uni.request({
					url: getApp().globalData.apiUrl	+ 'api/pchoujiang/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						token: uni.getStorageSync('token'),
						choujiang_id: option.id,
						api_name: 'zhongjiang_user',
					},
					success: res => {
						this.awardUserList = res.data.data;
					},
					fail: (res) => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {}
				});
				uni.request({
					url: getApp().globalData.apiUrl	+ 'api/pchoujiang/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						token: uni.getStorageSync('token'),
						choujiang_id: option.id,
						api_name: 'part_users',
					},
					success: res => {
						this.totalCount = res.data.data.total_part_users_counts;
						this.personList = res.data.data.list;
					},
					fail: (res) => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang="less">
.award-user{
	margin: 30rpx 0;
	.award-user-title{
		width: 100%;
		color: #FFFFFF;
		font-size: 36rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		border: 8rpx solid transparent;
		background-clip: padding-box;
		image{
			width: 41rpx;
			height: 41rpx;
			margin-right: 10rpx;
		}
		:after {
			position: absolute;
			top: -8px;
			bottom: -8px;
			left: -8px;
			right: -8px;
			background: linear-gradient(to bottom, #ff9579, #ff9579);
			content: '';
			z-index: -1;
			border-radius: 20rpx 20rpx 0 0;
		}
	}
}
.award-finish-tag{
	width: 140rpx;
	height: 120rpx;
	position: absolute;
	left: 0;
	top: 0;
}
</style>
