<!-- tab组件: <me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs> -->
<template>
	<view class="me-tabs" :class="{ 'tabs-fixed': fixed, 'top-tabs': topTabs, 'other-tabs': otherTabs, 'mine-tabs': mineTabs }" :style="{ height: tabHeightVal, top: top }">
		<scroll-view v-if="tabs.length" :id="viewId" :scroll-left="scrollLeft" scroll-x scroll-with-animation :scroll-animation-duration="300">
			<view class="tabs-item" :class="{ 'tabs-flex': !isScroll, 'tabs-scroll': isScroll }">
				<!-- tab -->
				<view
					class="tab-item"
					:style="{ width: tabWidthVal, height: tabHeightVal, 'line-height': tabHeightVal }"
					v-for="(tab, i) in tabs"
					:class="{ active: value === i }"
					:key="i"
					@click="tabClick(i)"
				>
				<!-- {{tab}} -->
					{{ getTabName(tab) }}
					<image src="../../static/ic_new_down.png" mode="widthFix" class="tab-arrow" :class="arrowCur ? 'cur' : ''" v-if="value == 0 && topTabs && i == 0"></image>
				</view>
				<!-- 下划线 -->
				<view class="tabs-line" v-if="isShowLine" :style="{ left: lineLeft }"></view>
				
				<view class="tabs-mask" v-if="tabsMask" @click="tabsMask = false">
					<view class="tabs-dropdown" @click.stop="">
						<view class="tabs-dropdown-item">
							<u-tag :text="tabsTag" mode="dark" bg-color="#F2F2F2" color="#4A4C4C" type="info" class="utag" @click="tabsItem" />
						</view>
					</view>
				</view>
				
			</view>
		</scroll-view>
		<slot></slot>
	</view>
</template>

<script>
export default {
	props: {
		tabs: {
			// 支持格式: ['全部', '待付款'] 或 [{name:'全部'}, {name:'待付款'}]
			type: Array,
			default() {
				return [];
			}
		},
		isShowLine: {
			default: true
		},
		nameKey: {
			// 取name的字段
			type: String,
			default: 'name'
		},
		value: {
			// 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
			type: [String, Number],
			default: 0
		},
		topTabs: Boolean,
		otherTabs: Boolean,
		mineTabs: { //是否是我的文案页的tabs
			default: false,
			type: Boolean
		},
		fixed: Boolean, // 是否悬浮,默认false
		tabWidth: Number, // 每个tab的宽度,默认不设置值,为flex平均分配; 如果指定宽度,则不使用flex,每个tab居左,超过则水平滑动(单位默认rpx)
		height: {
			// 高度,单位rpx
			default: 64
		},
		top: '',
		tabsTag: {
			default: '随机'
		}
	},
	data() {
		return {
			viewId:
				'id_' +
				Math.random()
					.toString(36)
					.substr(2, 16),
			scrollLeft: 0,
			flag: false,
			arrowCur: false,
			tabsMask: false
		};
	},
	computed: {
		isScroll() {
			return this.tabWidth && this.tabs.length; // 指定了tabWidth的宽度,则支持水平滑动
		},
		tabHeightPx() {
			return uni.upx2px(this.height);
		},
		tabHeightVal() {
			return this.tabHeightPx + 'px';
		},
		tabWidthPx() {
			return uni.upx2px(this.tabWidth);
		},
		tabWidthVal() {
			return this.isScroll ? this.tabWidthPx + 'px' : '';
		},
		lineLeft() {
			if (this.isScroll) {
				return this.tabWidthPx * this.value + this.tabWidthPx / 2 + 'px'; // 需转为px (用rpx的话iOS真机显示有误差)
			} else {
				return (100 / this.tabs.length) * (this.value + 1) - 100 / (this.tabs.length * 2) + '%';
			}
		}
	},
	watch: {
		tabs() {
			this.warpWidth = null; // 重新计算容器宽度
			this.scrollCenter(); // 水平滚动到中间
		},
		value() {
			this.scrollCenter(); // 水平滚动到中间
		},
		tabsMask(){
			this.arrowCur = this.tabsMask;
		}
	},
	methods: {
		getTabName(tab) {
			return typeof tab === 'object' ? tab[this.nameKey] : tab;
		},
		tabClick(i) {
			
			if(!this.mineTabs){  //首页tabs遮罩
				if(i != 0){
					this.flag = true;
					this.tabsMask = false;
				}else{
					if(!this.flag && this.topTabs) this.tabsMask = !this.tabsMask;
					this.flag = false;
				}
			}
			
			if (this.value != i) {
				this.$emit('input', i);
				this.$emit('change', i);
			}
		},
		async scrollCenter() {
			if (!this.isScroll) return;
			if (!this.warpWidth) {
				// tabs容器的宽度
				let rect = await this.initWarpRect();
				this.warpWidth = rect ? rect.width : uni.getSystemInfoSync().windowWidth; // 某些情况下取不到宽度,暂时取屏幕宽度
			}
			let tabLeft = this.tabWidthPx * this.value + this.tabWidthPx / 2; // 当前tab中心点到左边的距离
			let diff = tabLeft - this.warpWidth / 2; // 如果超过tabs容器的一半,则滚动差值
			this.scrollLeft = diff;
			// #ifdef MP-TOUTIAO
			this.scrollTimer && clearTimeout(this.scrollTimer);
			this.scrollTimer = setTimeout(() => {
				// 字节跳动小程序,需延时再次设置scrollLeft,否则tab切换跨度较大时不生效
				this.scrollLeft = Math.ceil(diff);
			}, 400);
			// #endif
		},
		initWarpRect() {
			return new Promise(resolve => {
				setTimeout(() => {
					// 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
					// #endif
					query
						.select('#' + this.viewId)
						.boundingClientRect(data => {
							resolve(data);
						})
						.exec();
				}, 20);
			});
		},
		tabsItem(e){
			this.$emit('toggleInfo', this.tabsTag);
			this.tabsMask = false;
		}
	},
	mounted() {
		this.scrollCenter(); // 滚动到当前下标
	}
};
</script>

<style lang="scss">
.me-tabs {
	position: relative;
	font-size: 24rpx;
	background-color: #fff;
	box-sizing: border-box;
	overflow-y: hidden;
	background-color: #edf0f0;
	&.tabs-fixed {
		z-index: 990;
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
	}

	.tabs-item {
		position: relative;
		white-space: nowrap;
		padding-bottom: 30rpx; // 撑开高度,再配合me-tabs的overflow-y: hidden,以达到隐藏滚动条的目的
		box-sizing: border-box;
		.tab-item {
			position: relative;
			text-align: center;
			box-sizing: border-box;
			font-size: 24rpx;
			color: #c0c6c7;
			&.active {
				color: #00a6ac;
				font-weight: bold;
			}
		}
	}

	&.top-tabs {
		background-color: #ffffff;
		.tabs-item {
			color: #99a3a4;
			.active {
				font-size: 32rpx;
			}
		}
	}
	
	&.other-tabs {
		background-color: #ffffff;
		.tabs-item {
			color: #696A69;
			.active {
				color: #696A69;
				font-size: 24rpx;
			}
		}
	}
	
	&.mine-tabs {
		background-color: #f7f8f8;
		.tabs-item {
			color: #4A4C4C;
			.active {
				color: #4A4C4C;
				font-size: 24rpx;
			}
		}
	}

	// 平分的方式显示item
	.tabs-flex {
		display: flex;
		.tab-item {
			flex: 1;
		}
	}
	// 居左显示item,支持水平滑动
	.tabs-scroll {
		.tab-item {
			display: inline-block;
		}
	}

	// 选中tab的线
	.tabs-line {
		z-index: 1;
		position: absolute;
		bottom: 30rpx; // 至少与.tabs-item的padding-bottom一致,才能保证在底部边缘
		width: 100rpx;
		height: 10rpx;
		transform: translateX(-50%);
		transition: left 0.3s;
		background: #00a6ac;
	}
}

.tab-arrow {
	width: 22rpx;
	height: 11rpx;
	margin-left: 10rpx;
	display: inline-block;
	vertical-align: middle;
	transition: all 0.3s ease;
	&.cur{
		transform: rotate(-180deg);
	}
}

.tabs-mask{
	position: fixed;
	top: 80rpx;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba($color: #000000, $alpha: 0.5);
}

.tabs-dropdown{
	height: 100rpx;
	background-color: #ffffff;
	padding: 24rpx;
	// margin-top: -4rpx;
}
</style>
