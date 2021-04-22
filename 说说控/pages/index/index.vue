<template>
	<view>
		<image src="../../static/nav-top.png" mode="aspectFill" class="nav-to-top" @click="toNavigateToMiniProgram()"></image>
		<view class="content">
			<view class="index-tab">
				<view v-for="(item,index) in tabList" :key="index" v-text="item" :class="tabIndex == index ? 'cur' : ''" @click="selectTab(index)"></view>
			</view>
			<navigator url="../search/list-search" hover-class="none" class="search">
				<image src="../../static/search.png" mode="aspectFill"></image>
				搜索
			</navigator>
			<t-list :dataList="dataList"></t-list>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import tList from '@/components/list/list.vue'
import md5 from 'js-md5';
export default {
	data() {
		return {
			catId: '',
			type: 1,
			// 列表数据
			dataList: [],
			tabIndex: 0,
			tabList: ['最新','热门']
		};
	},
	components: {
		tList
	},
	onLoad(options) {
	},
	computed:{
		...mapGetters(['getInfo'])
	},
	mounted() {
		this.$nextTick(function(){
			
		})
	},
	onShow() {
		if(this.getInfo.token){
			this.getData();
		}else{
			uni.switchTab({
				url:'../mine/mine'
			})
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		// #ifdef MP-QQ
			qq.showShareMenu({
				showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
			})
		// #endif
		return {
			title: '这条说说说的就是你吧？',
			path: '/pages/index/index'
		}
	},
	methods: {
		...mapMutations(['login','logout']),
		toNavigateToMiniProgram(){
			uni.navigateToMiniProgram({
			  appId: '1110662175',
			  path: 'pages/index/index',
			  success(res) {
			    // 打开成功
					console.log('打开成功');
			  }
			})
		},
		getData() {
			uni.showLoading({
				title: '加载中'
			})
			let sign = md5(`${this.type}${this.signKey}`);
			uni.request({
				url: this.apiUrl + '/api/master/v1/talk_index',
				data: {
					token: this.getInfo.token,
					sign: sign,
					type: this.type,
				},
				success: res => {
					let data = res.data.data;
					if(res.data.status == 200){
						this.dataList = data;
					}else{
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
						// if(res.data.code == 2000){
						// 	this.logout();
						// 	setTimeout(()=>{
						// 		uni.navigateTo({
						// 			url:'../login/login'
						// 		})
						// 	},300)
						// }
					}
				},
				fail: () => {
					uni.showToast({
						title: '系统错误，请稍后重试'
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		selectTab(index){
			this.tabIndex = index;
			index == 0 ? this.type = 1 : this.type = 2;
			this.getData();
		}
	}
};
</script>

<style lang="stylus">
.index-tab
	display flex
	align-items center
	font-size 30rpx
	view
		margin-right 28rpx
		position relative
		margin-bottom 10rpx
		text-align center
		&.cur
			font-size 44rpx
			border-bottom 8rpx solid #ffc800
.search
	height 60rpx
	background #eaeaea
	border-radius 200px
	position relative
	display flex
	align-items center
	justify-content center
	padding-left 5%
	font-size 30rpx
	color #A7A7A7
	margin 40rpx 0
	image
		position absolute
		width 38rpx
		height 38rpx
		left 45%
		top 50%
		transform translate(-50%, -50%)
.nav-to-top
	margin 20rpx 0 0
	width 100%
	height 112rpx
</style>
