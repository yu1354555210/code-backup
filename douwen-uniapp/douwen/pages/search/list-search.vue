<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="status-bar"></view>
		<view class="content">
			<mSearch
				class="mSearch-input-box"
				:mode="2"
				button="inside"
				:placeholder="defaultKeyword"
				@search="doSearch(false)"
				@input="inputChange"
				@confirm="doSearch(false)"
				@removeEmpty="removeEmpty"
				v-model="keyword"
			></mSearch>
			<view class="search-keyword" @touchstart="blur">
				<detail-list :dataList="goods" v-show="isShowgoods" :keyword="keyword"></detail-list>
				<scroll-view class="keyword-box" scroll-y v-show="!isShowgoods">
					<view class="keyword-block" v-show="oldgoods.length > 0">
						<view class="keyword-list-header">
							<view>搜索历史</view>
							<view><image @click="oldDelete" src="../../static/icon-delete.png"></image></view>
						</view>
						<view class="keyword">
							<view v-for="(keyword, index) in oldgoods" @click="doSearch(keyword)" :key="index">{{ keyword }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
import md5 from 'js-md5';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
import detailList from '@/components/list/list.vue';

export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	components: {
		detailList,
		mSearch
	},
	data() {
		return {
			downOption: {
				use: false // 不使用下拉刷新
			},
			upOption: {
				auto: false, //是否在初始化后,自动执行上拉回调callback; 默认true
				// page: {
				// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
				// 	size: 10 // 每页数据的数量
				// }
				noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				textNoMore: '数据已全部加载',
				empty: {
					tip: '~ 搜索无结果 ~' // 提示
				}
			},
			goods: [], // 数据列表
			keyword: '', //当前搜索关键词
			defaultKeyword: '请输入搜索内容',
			oldgoods: [],
			hotgoods: [],
			forbid: '',
			isShowgoods: false,
			isDelShow: false
		};
	},
	watch: {
		//关键词变化的时候,重置列表数据
		keyword() {
			// 重置列表数据 (tip:此处最好做节流,避免输入过快多次请求)
			// this.mescroll.resetUpScroll();
		}
	},
	mounted() {},
	methods: {
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		/*上拉加载的回调*/
		upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			let sign = md5(`${this.keyword}${pageNum}${pageSize}${this.signKey}`);
			uni.request({
				url: this.apiUrl + '/api/master/v1/fee_search',
				data: {
					sign: sign,
					name: this.keyword,
					page: pageNum,
					limit: pageSize
				},
				success: data => {
					let curPageData = data.data.data.info;
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					if (page.num == 1) this.goods = [];
					this.mescroll.endSuccess(curPageData.length);
					//追加新数据
					this.goods = this.goods.concat(curPageData);
				},
				fail: () => {
					//  请求失败,隐藏加载状态
					this.mescroll.endErr();
				}
			});
		},
		onLoad() {
			this.init();
		},
		init() {
			this.loadDefaultKeyword();
			this.loadOldKeyword();
		},
		blur() {
			uni.hideKeyboard();
		},
		removeEmpty(){
			this.mescroll.removeEmpty()
		},
		//加载默认搜索关键字
		loadDefaultKeyword() {
			//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
			this.defaultKeyword = '请输入搜索内容';
		},
		//加载历史搜索,自动读取本地Storage
		loadOldKeyword() {
			uni.getStorage({
				key: 'OldKeys',
				success: res => {
					var OldKeys = JSON.parse(res.data);
					this.oldgoods = OldKeys;
				}
			});
		},
		//监听输入
		inputChange(event) {
			//兼容引入组件时传入参数情况
			var keyword = event.detail ? event.detail.value : event;
			if (!keyword) {
				this.goods = [];
				this.isShowgoods = false;
				return;
			}
			this.isShowgoods = true;
		},
		//顶置关键字
		setkeyword(data) {
			this.keyword = data.keyword;
		},
		//清除历史搜索
		oldDelete() {
			uni.showModal({
				content: '确定清除历史搜索记录？',
				success: res => {
					if (res.confirm) {
						console.log('用户点击确定');
						this.oldgoods = [];
						uni.removeStorage({
							key: 'OldKeys'
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//执行搜索
		doSearch(key) {
			key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
			this.keyword = key;
			this.saveKeyword(key); //保存为历史
			this.mescroll.resetUpScroll();
			if (key != '') {
				this.isShowgoods = true;
			}
		},
		//保存关键字到历史记录
		saveKeyword(keyword) {
			uni.getStorage({
				key: 'OldKeys',
				success: res => {
					var OldKeys = JSON.parse(res.data);
					var findIndex = OldKeys.indexOf(keyword);
					if (findIndex == -1) {
						OldKeys.unshift(keyword);
					} else {
						OldKeys.splice(findIndex, 1);
						OldKeys.unshift(keyword);
					}
					//最多10个纪录
					OldKeys.length > 10 && OldKeys.pop();
					uni.setStorage({
						key: 'OldKeys',
						data: JSON.stringify(OldKeys)
					});
					this.oldgoods = OldKeys; //更新历史搜索
				},
				fail: e => {
					var OldKeys = [keyword];
					uni.setStorage({
						key: 'OldKeys',
						data: JSON.stringify(OldKeys)
					});
					this.oldgoods = OldKeys; //更新历史搜索
				}
			});
		}
	}
};
</script>

<style>
view {
	display: block;
}
.search-box {
	width: 100%;
	padding: 15rpx 17rpx;
	display: flex;
	justify-content: space-between;
}
.search-box .mSearch-input-box {
	width: 100%;
}
.search-box .input-box {
	width: 640rpx;
	flex-shrink: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	text-indent: 60rpx;
}
.search-box .input-box image {
	width: 30rpx;
	height: 30rpx;
	position: absolute;
	left: 30rpx;
	top: 50%;
	transform: translateY(-50%);
}
.search-box .search-btn {
	width: 15%;
	margin: 0 0 0 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	font-size: 28rpx;
	color: #fff;
	background: linear-gradient(to right, #ff9801, #ff570a);
	border-radius: 60rpx;
}
.search-box .cancel-btn {
	margin: 0 0 0 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	font-size: 30rpx;
	color: #333;
}
.search-box .input-box > input {
	width: 100%;
	height: 60rpx;
	background-color: #f1f1f1;
	font-size: 30rpx;
	border: 0;
	border-radius: 60rpx;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	padding: 0 3%;
	margin: 0;
}

.placeholder-class {
	color: #9e9e9e;
}
.search-keyword {
	width: 100%;
	/* background-color: rgb(242, 242, 242); */
}
.keyword-list-box {
	height: calc(100vh - 110rpx);
	padding-top: 10rpx;
	border-radius: 20rpx 20rpx 0 0;
	background-color: #fff;
}
.keyword-entry-tap {
	background-color: #eee;
}
.keyword-entry {
	width: 94%;
	height: 80rpx;
	margin: 0 3%;
	font-size: 30rpx;
	color: #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: solid 1rpx #e7e7e7;
}
.keyword-entry image {
	width: 60rpx;
	height: 60rpx;
}
.keyword-entry .keyword-text,
.keyword-entry .keyword-img {
	height: 80rpx;
	display: flex;
	align-items: center;
}
.keyword-entry .keyword-text {
	width: 90%;
}
.keyword-entry .keyword-img {
	width: 10%;
	justify-content: center;
}
.keyword-box {
	height: 100%;
	border-radius: 20rpx 20rpx 0 0;
	background-color: #fff;
}
.keyword-box .keyword-block {
	padding: 10rpx 0;
}
.keyword-box .keyword-block .keyword-list-header {
	width: 100%;
	padding: 10rpx 18rpx;
	font-size: 44rpx;
	color: #333;
	display: flex;
	justify-content: space-between;
}
.keyword-box .keyword-block .keyword-list-header image {
	width: 27rpx;
	height: 40rpx;
}
.keyword-box .keyword-block .keyword {
	width: 100%;
	padding: 28rpx 18rpx;
	display: flex;
	flex-flow: wrap;
	justify-content: flex-start;
}
.keyword-box .keyword-block .hide-hot-tis {
	display: flex;
	justify-content: center;
	font-size: 28rpx;
	color: #6b6b6b;
}
.keyword-box .keyword-block .keyword > view {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rpx;
	font-size: 30rpx;
	color: #333;
	margin-bottom: 30rpx;
	width: 100%;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 4px 32px 0px rgba(255, 51, 75, 0.08);
	border-radius: 20px;
}
</style>
