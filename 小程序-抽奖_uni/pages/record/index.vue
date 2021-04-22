<template>
	<mescroll-uni :down="downOption" :up="upOption" @up="upCallback" @emptyclick="emptyClick" @init="mescrollInit">
		<view class="address-container">
			<view class="address-warn">
				<image src="../../static/images/warn-bg.png" mode="aspectFill"></image>
				请于7日内完善收货信息，逾期作废。
			</view>
			<view class="address-body" v-for="(item, index) in dataList" :key="index">
				<image class="address-bg" src="../../static/images/address-bg.png" mode="aspectFill"></image>
				<view class="address-main">
					<view class="address-top">
						<view class="address-top-title">
							<text><text>【{{item.periods}}】</text>{{item.choujiang_name}}</text>
							<view class="status-tag">{{ item.type == 0 ? '未发货' : '已发货' }}</view>
						</view>
						<view class="address-info">
							<text>订单号：{{ item.order_no }}</text>
							<text>快递公司：{{ item.company }}</text>
						</view>
					</view>
					<view class="address-bottom">
						<view class="address-info" v-if="item.is_input == 1">
							<text>收件人：{{ item.name }}</text>
							<text>手机号：{{ item.tel }}</text>
							<text>收货地址：{{ item.address }}</text>
						</view>
						<view class="address-to-page" v-else><navigator url="../change-address/index">去完善收货信息</navigator></view>
					</view>
				</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
export default {
	components: {
		MescrollUni
	},
	data() {
		return {
			mescroll: null, //mescroll实例对象
			address: [],
			// 下拉刷新的常用配置
			downOption: {
				use: false, // 是否启用下拉刷新; 默认true
				auto: true // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				textNoMore: '已全部加载',
				empty: {
					use: true,
					icon: '../../static/images/no-data.png',
					tip: '抽奖尚在进行中，大奖在等你哦！',
					btnText: '去抽奖'
				}
			},
			// 列表数据
			dataList: []
		};
	},
	onShow() {
		this.mescroll.resetUpScroll(); // 刷新列表数据
	},
	methods: {
		// mescroll组件初始化的回调,可获取到mescroll对象
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		/*上拉加载的回调*/
		upCallback(mescroll) {
			uni.showLoading({
				title: '加载中'
			});
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条
			let apiName = 'my_zhongjiang_record';
			uni.request({
				url: getApp().globalData.apiUrl + 'api/pchoujiang/api',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				},
				data: {
					page: pageNum,
					size: pageSize,
					api_name: apiName,
					token: uni.getStorageSync('token')
				},
				success: data => {
					uni.hideLoading();
					// 接口返回的当前页数据列表 (数组)
					let curPageData = data.data.data;
					// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
					let totalPage = data.xxx;
					// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
					let totalSize = data.xxx;
					// 接口返回的是否有下一页 (true/false)
					let hasNext = data.xxx;

					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据

					// 成功隐藏下拉加载状态
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					// mescroll.endByPage(curPageData.length, totalPage);

					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					//mescroll.endBySize(curPageData.length, totalSize);

					//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
					//mescroll.endSuccess(curPageData.length, hasNext);

					//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
					//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
					//如果传了hasNext,则翻到第二页即可显示无更多数据.
					mescroll.endSuccess(curPageData.length);

					// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
					this.$nextTick(() => {
						mescroll.endSuccess(curPageData.length);
					});
				},
				fail: () => {
					// 失败隐藏下拉加载状态
					mescroll.endErr();
					uni.hideLoading();
				}
			});
		},
		//点击空布局按钮的回调
		emptyClick(mescroll) {
			uni.switchTab({
				url: '../index/index'
			});
		}
	}
};
</script>

<style lang="less">
.address-container {
	padding-top: 100rpx;
}
.address-warn {
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	height: 70rpx;
	display: flex;
	align-items: center;
	font-size: 22rpx;
	color: #fffffe;
	padding: 0 35rpx;
	image {
		height: 100%;
		position: absolute;
		z-index: -1;
		width: 100%;
		left: 0;
		top: 0;
	}
}
</style>
