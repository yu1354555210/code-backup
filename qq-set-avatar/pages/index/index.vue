<template>
	<view class="content">
		<view class="title">匹配头像</view>
		<view class="select-tab">
			<view class="select-btn" @click="toCategory('选小姐姐头像')"><image src="../../static/w-btn.png" mode="aspectFill"></image></view>
			<view class="select-btn" @click="toCategory('找小哥哥头像')"><image src="../../static/b-btn.png" mode="aspectFill"></image></view>
		</view>
		<view class="title">情侣头像</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :down="downOption" :up="upOption">
			<avatar-list :dataList="dataList"></avatar-list>
		</mescroll-body>
	</view>
</template>

<script>
import md5 from 'js-md5';
import avatarList from '@/components/list/list.vue';
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			dataList: [],
			// 下拉刷新的常用配置
			downOption: {
				use: false // 是否启用下拉刷新; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 10, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				textNoMore: '数据已全部加载',
				empty: {
					tip: '暂无相关数据'
				}
			},
		};
	},
	onLoad() {
	},
	components: {
		avatarList
	},
	methods: {
		toCategory(title){
			uni.navigateTo({
				url:'../../category/category?title=' + title
			})
		},
		/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		/*上拉加载的回调*/
		upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			let sign = md5(`${pageNum}${pageSize}${this.signKey}`);
			uni.request({
				url: this.apiUrl + '/cp_v1/index/index',
				data: {
					page: pageNum,
					limit: pageSize,
					sign: sign
				},
				success: data => {
					data = data.data.data;
					// 接口返回的当前页数据列表 (数组)
					let curPageData = data.data;
					// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
					let curPageLen = curPageData.length;
					// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
					// let totalPage = data.xxx;
					// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
					let totalSize = data.total;
					// 接口返回的是否有下一页 (true/false)
					// let hasNext = data.xxx;
					
					//设置列表数据
					if (page.num == 1) this.dataList = []; //如果是第一页需手动置空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
		
					// 请求成功,隐藏加载状态
					//方法一(推荐): 后台接口有返回列表的总页数 totalPage
					// this.mescroll.endByPage(curPageLen, totalPage);
		
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					this.mescroll.endBySize(curPageLen, totalSize);
		
					//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
					//this.mescroll.endSuccess(curPageLen, hasNext);
		
					//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
					//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
					//如果传了hasNext,则翻到第二页即可显示无更多数据.
					//this.mescroll.endSuccess(curPageLen);
		
					// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
					this.$nextTick(() => {
						this.mescroll.endSuccess(curPageLen);
					});
		
					//curPageLen必传的原因:
					// 1. 使配置的noMoreSize 和 empty生效
					// 2. 判断是否有下一页的首要依据:
					//    当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
					//    比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
					// 3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
					// 传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
		
					// 提示: 您无需额外维护页码和判断显示空布局,mescroll已自动处理好.
					// 当您发现结果和预期不一样时, 建议再认真检查以上参数是否传正确
				},
				fail: () => {
					//  请求失败,隐藏加载状态
					this.mescroll.endErr();
				}
			});
		}
	}
};
</script>

<style lang="stylus">
.title
	font-size 40rpx
	margin 30rpx 0
.select-tab
	display flex
	justify-content space-between
	align-items center
	.select-btn
		image
			width 345rpx
			height 110rpx
</style>
