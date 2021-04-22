<template>
	<view class="content">
		<!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
		<me-tabs v-model="topTabIndex" :tabs="topTabs" :topTabs="true" :fixed="true" :tab-width="130" height="80" :tabsTag="tabsTag" @toggleInfo="toggleInfo">
			<view class="tabs-search" @click="toSearch">
				<image src="../../static/ic_search_gray.png" class=""></image>
			</view>
		</me-tabs>
		<me-tabs v-model="tabIndex" :tabs="tabs" :fixed="true" :tab-width="130" top="80rpx" :isShowLine="false" v-show="isShowTabs"></me-tabs>
		<swiper :style="{ height: height }" :current="topTabIndex" @change="swiperTopChange" v-show="topTabSwiper">
			<swiper-item v-for="(tab, i) in topTabs" :key="i"><mescroll-top-item :ref="'topSwiper' + i" :i="i" :index="topTabIndex" :tabs="topTabs"></mescroll-top-item></swiper-item>
		</swiper>
		<swiper class="tab-Swiper" :style="{ height: height }" :current="tabIndex" @change="swiperChange" v-show="tabSwiper" :class="tabSwiper ? 'animation-slide-right' : ''">
			<swiper-item v-for="(tab, i) in tabs" :key="i" @touchmove="handleMove" @touchstart="handleStart">
				<mescroll-item ref="mescrollItem" :i="i" :index="tabIndex" :tabs="tabs" top="144"></mescroll-item>
			</swiper-item>
		</swiper>
		<u-tabbar :list="vuex_tabbar" :mid-button="true" :border-top="false" active-color="#00A6AC" inactive-color="#c4c4c4" @change="tabbarClick"></u-tabbar>
	</view>
</template>

<script>
import MescrollItem from './mescroll-swiper-item.vue';
import MescrollTopItem from './mescroll-swiper-top-item.vue';
let refsTopSwiper = '';
export default {
	components: {
		MescrollItem,
		MescrollTopItem
	},
	data() {
		return {
			startX: '',
			isShowTabs: false,
			tabSwiper: false,
			topTabSwiper: true,
			tabsTag: '随机',
			height: '400px', // 需要固定swiper的高度
			topTabs: ['最新', '热门', '全部'],
			tabs: [],
			tabIndex: 0, // 当前tab的下标
			topTabIndex: 0 // 当前toptab的下标
		};
	},
	watch: {
		topTabIndex(newValue, oldValue) {
			if (newValue == 2) {
				this.isShowTabs = true;
				this.topTabSwiper = false;
				this.tabSwiper = true;
			} else {
				this.isShowTabs = false;
				this.topTabSwiper = true;
				this.tabSwiper = false;
			}
		}
	},
	onLoad(options) {
		// 需要固定swiper的高度
		this.height = uni.getSystemInfoSync().windowHeight + 'px';

		if (this.vuex_is_login) {
			this.canReset && refsTopSwiper.downCallback(); // 自行实现的刷新指定一条数据
			this.canReset && refsTopSwiper.mescroll.scrollTo(0, 0);
			this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.getTabsData();
			refsTopSwiper = this.$refs.topSwiper0[0];
		});
	},
	methods: {
		handleStart(e) {
			if (e.touches.length == 1) {
				this.startX = e.touches[0].clientX;
			}
		},
		handleMove(e) {
			//判断swiper滑动方向
			if (e.touches.length == 1) {
				if (this.tabIndex === 0) {
					let moveX = e.changedTouches[0].pageX;
					let diffX = this.startX - moveX;
					if (diffX < -50) {
						//向右
						this.topTabSwiper = true;
						this.tabSwiper = false;
						this.topTabIndex = 1;
					}
				}
			}
		},
		// 全部tab轮播
		swiperChange(e) {
			this.tabIndex = e.detail.current;
		},
		//顶部tab轮播
		swiperTopChange(e) {
			this.topTabIndex = e.detail.current;
		},
		toggleInfo(msg) {
			this.tabsTag = this.topTabs[0];
			this.$set(this.topTabs, 0, msg);
			setTimeout(() => {
				refsTopSwiper.trggerDownScroll(); //不延迟会造成数据更新不了
			}, 30);
		},
		getTabsData() {
			let sign = this.md5Libs.md5(`${this.signKey}`);
			this.$u
				.get('/api/master/v1/applets_cat_fact', {
					token: this.vuex_token,
					sign: sign
				})
				.then(res => {
					this.tabs = res;
				})
				.catch(err => {
					console.log(err);
				});
		},
		toSearch() {
			this.$u.route({
				type: 'switchTab',
				url: '/pages/search/search'
			});
		},
		tabbarClick(index) {
			// const isRefreshIcon = this.vuex_tabbar[0].selectedIconPath.includes('refresh');
			// if (index === 0 && isRefreshIcon) {
			// 	refsTopSwiper.trggerDownScroll();
			// }
			// if (index === 0) {
			// 	refsTopSwiper.trggerDownScroll();
			// }
		}
	},
	onShow() {
		// 返回刷新: https://www.mescroll.com/uni.html#note 第二点
		// console.log("this.vuex_is_login: ",this.vuex_is_login);
	}
};
</script>

<style lang="stylus">
.tabs-search
	position absolute
	right 51rpx
	top 50%
	transform translateY(-50%)
	width 28rpx
	height 28rpx
	image
		width 100%
		height 100%
	&::before
		content ''
		position absolute
		top -20rpx
		right -20rpx
		bottom -20rpx
		left -20rpx
.tab-Swiper
	display none
</style>
<style>
.animation-slide-right {
	animation-name: slide-right;
	animation-duration: 0.5s;
	animation-timing-function: default;
	animation-fill-mode: forwards;
	display: block;
}

@keyframes slide-right {
	0% {
		transform: translateX(60%);
	}

	100% {
		transform: translateX(0);
	}
}
</style>
