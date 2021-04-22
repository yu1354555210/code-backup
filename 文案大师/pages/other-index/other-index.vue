<template>
	<view class="content">
		<view class="other-content">
			<view class="mine-header">
				<u-avatar :src="avatar" mode="circle" size="150"></u-avatar>
				<view class="mine-header-body">
					<text v-text="userInfo.name"></text>
					<view class="mine-header-tags">
						<u-tag :text="userInfo.copy_mark" v-if="userInfo.copy_mark" mode="dark" shape="circle" size="mini" bg-color="#FFB351" class="utag" />
						<u-tag :text="userInfo.thumb_mark" v-if="userInfo.thumb_mark" mode="dark" shape="circle" size="mini" bg-color="#33CC00" class="utag" />
					</view>
				</view>
			</view>
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange" :otherTabs="true" :isShowLine="false"></me-tabs>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="20" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<good-list :list="goods" :isOther="true" :type="type"></good-list>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				upOption:{
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						icon: false,
						tip: '~ 无数据 ~', // 提示
					}
				},
				goods: [], //列表数据
				tabs: ['文案', '点赞'],
				tabIndex: 0, // tab下标
				userInfo: {},
				type: 1,
				tabsNum: '',
				avatar: ''
			}
		},
		onLoad(options) {
			this.userInfo = options;
			this.avatar = decodeURIComponent(this.userInfo.avatar);
		},
		mounted() {
			this.$nextTick(function(){
				this.getTabsNum();
			})
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				let sign = this.md5Libs.md5(`${page.num}${page.size}${this.type}${this.userInfo.id}${this.signKey}`);
				this.$u
					.get(`/api/master/v1/${this.isLoginUrl}other_list`, {
						token: this.vuex_token,
						page: page.num,
						limit: page.size,
						sign: sign,
						type: this.type,
						copy_id: this.userInfo.id
					})
					.then(curPageData => {
						this.mescroll.endSuccess(curPageData.length);
						//如果是第一页需手动制空列表
						if (page.num == 1) this.goods = [];
						//追加新数据
						this.goods = this.goods.concat(curPageData);
					})
					.catch(err => {
						console.log(err);
						this.mescroll.endErr();
					});
			},
			getTabsNum(){
				let sign = this.md5Libs.md5(`${this.userInfo.id}${this.signKey}`);
				this.$u
					.get('/api/master/v1/applets_other_mess', {
						token: this.vuex_token,
						sign: sign,
						copy_id: this.userInfo.id
					})
					.then(res => {
						this.tabsNum = res;
						this.tabs = [`文案(${res.copy_num})`,`点赞(${res.prise_num})`];
					})
					.catch(err => {
						console.log(err);
					});
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},
			
			// 切换菜单
			tabChange() {
				this.goods = []// 先置空列表,显示加载进度
				this.type = this.tabIndex + 1;
				this.mescroll.resetUpScroll() // 再刷新列表数据
			}
		}
	}
</script>

<style lang="stylus">
.other-content
	background-color #ffffff
	overflow hidden
	padding 35rpx 0 0
.mine-header
	margin-bottom 60rpx
</style>
