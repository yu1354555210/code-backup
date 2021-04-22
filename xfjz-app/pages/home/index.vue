<template name="home">
	<view class="container">
		<view class="home-topbar">
			<view class="location" @click="toCity">
				<image src="../../static/icon-location.png" mode="aspectFill"></image>
				<text v-text="getCity"></text>
			</view>
			<navigator url="../HM-search/HM-search"><image src="../../static/icon-search.png" mode="aspectFill" class="search"></image></navigator>
		</view>
		<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item, index) in swiperList" :key="index" @click="openUrl(item.link)">
				<image :src="item.logo" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="main">
			<view class="this-title">
				<text class="title-info">找兼职</text>
				<navigator url="../classify/index" class="title-right">查看更多></navigator>
			</view>
			<view class="cates"><cates-item :list="catesList"></cates-item></view>
			<view class="this-title"><text class="title-info">兼职活动</text></view>
			<view class="activity">
				<view class="activity-image" @click="openUrl(item.link)" v-for="(item, index) in activityList" :key="index">
					<image :src="item.logo" mode="aspectFill"></image>
				</view>
			</view>
			<view class="tabList">
				<view class="tab-hb">
					<view class="this-title" :class="index == TabCur ? '' : 'this-title-normal'" @click="tabSelect(index)" v-for="(item, index) in tabList" :key="index">
						<text class="title-info" v-text="item"></text>
					</view>
				</view>
				<div class="tab-bd"><jobs-item :list="jobsList"></jobs-item></div>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import catesItem from '../../components/cates-item.vue';
import jobsItem from '../../components/jobs-item.vue';
export default {
	components: {
		catesItem,
		jobsItem
	},
	data() {
		return {
			TabCur: 0,
			catesList: [],
			activityList: [],
			focusList: [],
			jobsList: [],
			swiperList: [],
			hotList: [],
			newList: [],
			tabList: ['最新兼职', '最热兼职']
		};
	},
	computed:{
		...mapGetters(['token','getCity'])
	},
	mounted() {
		this.$nextTick(function() {
			this.$http
				.get('/v1/site/home', {
					params: { city: this.getCity }
				})
				.then(res => {
					let data = res.data.data;
					this.swiperList = data.banners;
					this.catesList = data.cates;
					this.activityList = data.activity;
					this.jobsList = data.new;
					this.hotList = data.hot;
					this.newList = data.new;
				})
				.catch(err => {});
		});
		// console.log("this.getCity: " + this.getCity);
		
		if(this.getCity == '获取位置'){
			//获取当前位置
			uni.getLocation({
				// 默认为 wgs84 返回 gps 坐标，
				// gcj02 返回国测局坐标，可用于 uni.openLocation 的坐标
				type: 'wgs84',
				geocode: true,
				success: data => {
					if (data.address) {
						// this.city = data.address.city;
						this.setCity(data.address.city);
					}
				},
				fail: err => {
					console.log(err);
					// this.$api.msg('获取定位失败');
				}
			});
		}

	},
	methods: {
		...mapMutations(['setCity']),
		openUrl(url) {
			// #ifdef APP-PLUS
			// plus.runtime.openWeb(url);
			console.log("url: " + url);
			uni.navigateTo({
				url: '../webview/index?url=' + url
			})
			// #endif
			// #ifdef H5
			window.location.href = url;
			// #endif
		},
		tabSelect(index) {
			this.TabCur = index;
			if (index == 0) {
				this.jobsList = this.newList;
			}
			if (index == 1) {
				this.jobsList = this.hotList;
			}
		},
		toCity(){
			uni.navigateTo({
				url: '../city/index'
			})
		}
	}
};
</script>

<style lang="less">
.container {
	position: relative;
}
.home-topbar {
	position: absolute;
	height: 45rpx;
	top: 45rpx;
	left: 0;
	width: 100%;
	padding: 0 20rpx;
	z-index: 66;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.location {
		color: #ffffff;
		font-size: 32rpx;
		image {
			width: 32rpx;
			height: 39rpx;
			margin-right: 5rpx;
		}
	}
	.search {
		width: 39rpx;
		height: 38rpx;
	}
}
.screen-swiper {
	height: 525rpx;
}
.activity {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.activity-image {
		width: 350rpx;
		height: 212rpx;
		image {
			height: 100%;
		}
	}
}
.tab-hb {
	display: flex;
	align-items: flex-end;
	.this-title {
		margin-right: 28rpx;
		&.this-title-normal {
			.title-info {
				font-size: 24rpx;
				&:after {
					display: none;
				}
			}
		}
	}
}
</style>
