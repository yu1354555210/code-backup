<template>
	<view class="content">
		<view class="search-box">
			<!-- mSearch组件 如果使用原样式，删除组件元素-->
			<mSearch
				class="mSearch-input-box"
				:mode="1"
				button="inside"
				:placeholder="defaultKeyword"
				@search="doSearch(false)"
				@input="inputChange"
				@confirm="doSearch(false)"
				@clear="clear"
				v-model="keyword"
			></mSearch>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<!-- 						
				<view class="input-box">
					<input type="text" :adjust-position="true" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
					 placeholder-class="placeholder-class" confirm-type="search">
				</view>
				<view class="search-btn" @tap="doSearch(false)">搜索</view> 
				 -->
			<!-- 原样式 end -->
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" :down="downOption" :up="upOption" @up="upCallback" height="10%" @emptyclick="emptyClick">
			<view class="search-keyword">
				<!-- <scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<block v-for="(row, index) in keywordList" :key="index">
					<view class="keyword-entry" hover-class="keyword-entry-tap">
						<view class="keyword-text" @tap.stop="doSearch(keywordList[index].keyword)"><rich-text :nodes="row.htmlStr"></rich-text></view>
						<view class="keyword-img" @tap.stop="setKeyword(keywordList[index].keyword)"><image src="/static/HM-search/back.png"></image></view>
					</view>
				</block>
			</scroll-view> -->
				<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
					<view class="keyword-block">
						<view class="keyword-list-header"><view>热门搜索</view></view>
						<view class="keyword" v-if="forbid == ''">
							<u-tag
								v-for="(keyword, index) in hotKeywordList"
								@tap="doSearch(keyword.name,keyword.type,keyword.cat_id)"
								:key="index"
								:text="keyword.type == 1 ? keyword.name : `#${keyword.name}`"
								mode="dark"
								shape="circle"
								bg-color="#5cbbbe"
								class="utag"
							/>
						</view>
						<view class="hide-hot-tis" v-else><view>当前搜热门搜索已隐藏</view></view>
					</view>
					<view class="keyword-block" v-if="oldKeywordList.length > 0">
						<view class="keyword-list-header">
							<view>搜索记录</view>
							<view><text @tap="oldDelete">清除</text></view>
						</view>
						<view class="keyword">
							<u-tag v-for="(keyword, index) in oldKeywordList" @tap="doSearch(keyword)" :key="index" :text="keyword" mode="dark" shape="circle" bg-color="#A9D6D7" class="utag" />
						</view>
					</view>
				</scroll-view>
				<!-- <view class="no-data" v-if="!isData">
					还没有相关文案哎，要不要来
					<text>上传</text>
					一个？
				</view> -->
			</view>
			<good-list :list="resultList"></good-list>
		</mescroll-body>
		<u-tabbar :list="vuex_tabbar" :mid-button="true" :border-top="false" active-color="#00A6AC" inactive-color="#c4c4c4"></u-tabbar>
	</view>
</template>

<script>
//引用mSearch组件，如不需要删除即可
import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			upOption: {
				auto: false, //是否在初始化后,自动执行上拉回调callback; 默认true
				// page: {
				// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
				// 	size: 10 // 每页数据的数量
				// }
				noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				empty: {
					icon: '',
					tip: '还没有相关文案哎，要不要来',
					btnText : "上传",
					 // 提示
				}
			},
			downOption: {
				use: false,
				auto: false
			},
			defaultKeyword: '',
			keyword: '',
			oldKeywordList: [],
			hotKeywordList: [],
			keywordList: [],
			forbid: '',
			isShowKeywordList: false,
			resultList: []
		};
	},
	watch: {},
	onLoad() {
		this.init();
	},
	components: {
		//引用mSearch组件，如不需要删除即可
		mSearch,
		MescrollEmpty
	},
	methods: {
		init() {
			this.loadDefaultKeyword();
			this.loadOldKeyword();
			this.loadHotKeyword();
		},
		blur() {
			uni.hideKeyboard();
		},
		//加载默认搜索关键字
		loadDefaultKeyword() {
			//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
			this.defaultKeyword = '默认关键字';
		},
		//加载历史搜索,自动读取本地Storage
		loadOldKeyword() {
			uni.getStorage({
				key: 'OldKeys',
				success: res => {
					var OldKeys = JSON.parse(res.data);
					this.oldKeywordList = OldKeys;
				}
			});
		},
		//加载热门搜索
		loadHotKeyword() {
			let sign = this.md5Libs.md5(`${this.signKey}`);
			this.$u
				.get('/api/master/v1/applets_hot', {
					token: this.vuex_token,
					sign: sign
				})
				.then(res => {
					this.hotKeywordList = res;
				})
				.catch(err => {
					console.log(err);
				});
		},
		//监听输入
		inputChange(event) {
			//兼容引入组件时传入参数情况
			var keyword = event.detail ? event.detail.value : event;
			if (!keyword) {
				this.keywordList = [];
				this.isShowKeywordList = false;
				return;
			}
			this.isShowKeywordList = true;
			//以下示例截取淘宝的关键字，请替换成你的接口
			// uni.request({
			// 	url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //仅为示例
			// 	success: res => {
			// 		this.keywordList = [];
			// 		this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
			// 	}
			// });
		},
		//高亮关键字
		drawCorrelativeKeyword(keywords, keyword) {
			var len = keywords.length,
				keywordArr = [];
			for (var i = 0; i < len; i++) {
				var row = keywords[i];
				//定义高亮#9f9f9f
				var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + '</span>');
				html = '<div>' + html + '</div>';
				var tmpObj = {
					keyword: row[0],
					htmlStr: html
				};
				keywordArr.push(tmpObj);
			}
			return keywordArr;
		},
		//顶置关键字
		setKeyword(index) {
			this.keyword = this.keywordList[index].keyword;
		},
		//清除历史搜索
		oldDelete() {
			uni.showModal({
				content: '确定清除历史搜索记录？',
				success: res => {
					if (res.confirm) {
						console.log('用户点击确定');
						this.oldKeywordList = [];
						uni.removeStorage({
							key: 'OldKeys'
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//热门搜索开关
		hotToggle() {
			this.forbid = this.forbid ? '' : '_forbid';
		},
		//执行搜索
		doSearch(keyword, type, cat_id) {
			if(type === 2){
				this.$u.route('/pages/classify/classify',{cat_id, keyword})
				return false
			}
			keyword = keyword === false ? this.keyword : keyword;
			if (keyword != '') {
				this.keyword = keyword;
				this.saveKeyword(keyword); //保存为历史
				this.isShowKeywordList = true;
				this.resultList = []; // 先清空列表,显示加载进度
				this.mescroll.resetUpScroll();
			} else {
				this.isShowKeywordList = false;
			}

			//以下是示例跳转淘宝搜索，可自己实现搜索逻辑
			/*
				//#ifdef APP-PLUS
				plus.runtime.openURL(encodeURI('taobao://s.taobao.com/search?q=' + keyword));
				//#endif
				//#ifdef H5
				window.location.href = 'taobao://s.taobao.com/search?q=' + keyword
				//#endif
				*/
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
					this.oldKeywordList = OldKeys; //更新历史搜索
				},
				fail: e => {
					var OldKeys = [keyword];
					uni.setStorage({
						key: 'OldKeys',
						data: JSON.stringify(OldKeys)
					});
					this.oldKeywordList = OldKeys; //更新历史搜索
				}
			});
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			let sign = this.md5Libs.md5(`${this.keyword}${page.num}${page.size}${this.signKey}`);
			this.$u
				.get(`/api/master/v1/${this.isLoginUrl}fac_search`, {
					token: this.vuex_token,
					name: this.keyword,
					page: page.num,
					limit: page.size,
					sign: sign
				})
				.then(curPageData => {
					curPageData = curPageData.info;
					this.mescroll.endSuccess(curPageData.length);
					//如果是第一页需手动制空列表
					if (page.num == 1) this.resultList = [];
					//追加新数据
					this.resultList = this.resultList.concat(curPageData);
				})
				.catch(err => {
					console.log(err);
					this.mescroll.endErr();
				});
		},
		clear() {
			this.resultList = [];
			this.keyword = '';
			this.mescroll.removeEmpty();
		},
		emptyClick(){
			this.$u.route({
				url: '/pages/add/add',
				type: 'switchTab'
			})
		}
	}
};
</script>
<style lang="scss">
view {
	display: block;
}
page {
	background-color: #f2f3f3;
	.mescroll-empty{
		margin-top: 30%;
		.empty-btn{
			border: none;
			min-width: auto;
			margin: 0;
			color: #1f969b;
			display: inline-block;
			font-size: 26rpx;
			padding: 0;
			&::after{
				content: "一个?";
				display: inline-block;
				color: #4A4C4C;
			}
		}
		.empty-tip{
			font-size: 26rpx;
		 	display: inline-block;
			color: #4A4C4C;
		 }
	}
}

.search-box {
	width: 100%;
	background-color: #ffffff;
	padding: 15upx 40rpx;
	display: flex;
	justify-content: space-between;
	position: sticky;
	top: 0;
	z-index: 666;
}
.search-box .mSearch-input-box {
	width: 100%;
}
.search-box .input-box {
	width: 85%;
	flex-shrink: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f2f3f3;
}
.search-box .search-btn {
	width: 15%;
	margin: 0 0 0 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	font-size: 28upx;
	color: #fff;
	background: linear-gradient(to right, #ff9801, #ff570a);
	border-radius: 60upx;
}
.search-box .input-box > input {
	width: 100%;
	height: 60upx;
	font-size: 32upx;
	border: 0;
	border-radius: 60upx;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	padding: 0 3%;
	margin: 0;
	background-color: #ffffff;
}
.placeholder-class {
	color: #9e9e9e;
}
.search-keyword {
	width: 100%;
	background-color: rgb(242, 242, 242);
}
.keyword-list-box {
	// height: calc(100vh - 110upx);
	padding-top: 10upx;
	border-radius: 20upx 20upx 0 0;
	background-color: #fff;
}
.keyword-entry-tap {
	background-color: #eee;
}
.keyword-entry {
	width: 94%;
	height: 80upx;
	margin: 0 3%;
	font-size: 30upx;
	color: #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: solid 1upx #e7e7e7;
}
.keyword-entry image {
	width: 60upx;
	height: 60upx;
}
.keyword-entry .keyword-text,
.keyword-entry .keyword-img {
	height: 80upx;
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
	// height: calc(100vh - 110upx);
	border-radius: 20upx 20upx 0 0;
	background-color: #f2f2f2;
}
.keyword-box .keyword-block {
	padding: 30upx 0 20rpx;
}
.keyword-box .keyword-block .keyword-list-header {
	width: 94%;
	padding: 10upx 3% 30rpx;
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
	font-weight: bold;
	color: #383534;
	text {
		color: #aaaaa7;
		font-size: 24rpx;
		font-weight: normal;
	}
}
.keyword-box .keyword-block .keyword-list-header image {
	width: 40upx;
	height: 40upx;
}
.keyword-box .keyword-block .keyword {
	width: 94%;
	padding: 3px 3%;
	display: flex;
	flex-flow: wrap;
	justify-content: flex-start;
	.utag {
		margin: 0 32rpx 20rpx 0;
		.u-tag {
			padding: 18rpx 32rpx;
			font-size: 24rpx;
		}
	}
}
.keyword-box .keyword-block .hide-hot-tis {
	display: flex;
	justify-content: center;
	font-size: 28upx;
	color: #6b6b6b;
}
.keyword-box .keyword-block .keyword > view {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 60upx;
	padding: 0 20upx;
	margin: 10upx 20upx 10upx 0;
	height: 60upx;
	font-size: 28upx;
	background-color: rgb(242, 242, 242);
	color: #6b6b6b;
}

</style>
