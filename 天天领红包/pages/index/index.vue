<template>
	<view class="content">
		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback" @emptyclick="emptyClick" v-if="!onlineStatus" @init="mescrollInit">
			<view class="news-list">
				<view class="news-item new-oneimg-item" @click="toDetail(item.id)" v-for="(item, index) in newsList" :key="index">
					<view class="news-img"><image :src="it" v-for="(it, idx) in item.thumbs" :key="idx"></image></view>
					<view class="news-title">
						{{ item.title }}
						<text class="time">{{ item.create_time }}</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<block v-else>
			<image src="https://app1-api.qianr.com/static/bonus/home-bg.png" mode="aspectFill" class="home-bg image-bg"></image>
			<swiper v-if="swiperList.length > 0" :indicator-dots="true" :autoplay="true" :interval="3000" class="home-swiper" indicator-color="#ff3125" indicator-active-color="#ffdace" :circular="true">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<view class="swiper-item"><image :src="item.image" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="home-wrapper" v-if="redbagData.isNewPerson == 1">
				<view class="home-title">
					<image src="https://app1-api.qianr.com/static/bonus/home-title-l.png" mode="aspectFill" class="home-title-line"></image>
					<text>新手专属</text>
					<image src="https://app1-api.qianr.com/static/bonus/home-title-r.png" mode="aspectFill" class="home-title-line"></image>
				</view>
				<view class="home-scroll-body">
					<view class="home-scroll-line">
						<view class="redbag-list">
							<view class="redbag-item redbag-normal" @click="openNewPersonRedbag()">
								<image class="redbag-bg" :src="listRedbagBgList.normalBg" mode="aspectFill"></image>
								<view class="redbag-body">
									<image class="redbag-btn" src="https://app1-api.qianr.com/static/bonus/list-redbag-btn.png" mode="aspectFill"></image>
									<text class="redbag-info">新手红包</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="home-wrapper">
				<view class="home-title">
					<image src="https://app1-api.qianr.com/static/bonus/home-title-l.png" mode="aspectFill" class="home-title-line"></image>
					<text>拼手气红包</text>
					<image src="https://app1-api.qianr.com/static/bonus/home-title-r.png" mode="aspectFill" class="home-title-line"></image>
				</view>
				<view class="home-scroll-body">
					<view class="home-scroll-line">
						<view class="redbag-num-box">
							<view class="redbag-num">
								<text v-text="redbagData.myPack"></text>
								<image src="https://app1-api.qianr.com/static/bonus/add-num.png" mode="aspectFill" class="add-num" @click="addNum"></image>
							</view>
							<view class="redbag-num-text"><text>可领红包个数</text></view>
						</view>
						<view class="redbag-list">
							<view
								class="redbag-item"
								v-for="(item, index) in dataList"
								:class="[
									item.status == 1 ? 'redbag-normal' : '',
									item.status == 2 ? 'redbag-open' : '',
									item.status == 3 ? 'redbag-end' : '',
									item.status == 4 ? 'redbag-wait' : ''
								]"
								:key="index"
								@click="openItemRedbag(item)"
							>
								<block>
									<view class="redbag-item-mask" v-if="item.status == 3"><text>已抢光</text></view>
									<view class="redbag-item-mask" v-if="item.status == 4">
										<text>{{ item.time }}</text>
										<text>开启</text>
									</view>
								</block>

								<block>
									<image class="redbag-bg" v-if="item.status == 2" :src="listRedbagBgList.openBg" mode="aspectFill"></image>
									<image class="redbag-bg" v-else-if="item.status == 3" :src="listRedbagBgList.endBg" mode="aspectFill"></image>
									<image class="redbag-bg" v-else :src="listRedbagBgList.normalBg" mode="aspectFill"></image>
								</block>

								<block>
									<view class="redbag-body" v-if="item.status == 1">
										<image class="redbag-btn" src="https://app1-api.qianr.com/static/bonus/list-redbag-btn.png" mode="aspectFill"></image>
										<text class="redbag-info">{{ item.money }}元现金</text>
									</view>
									<view class="redbag-body" v-else-if="item.status == 2">
										<view class="redbag-body-num">
											<text>{{ item.money }}</text>
											<text>元现金</text>
										</view>
										<view class="redbag-more" @click="toResultPage(item)">
											<text>查看大家的手气</text>
											<image src="https://app1-api.qianr.com/static/bonus/list-redbag-arrow.png" mode="aspectFill"></image>
										</view>
									</view>
									<view class="redbag-body" v-else-if="item.status == 3">
										<text class="redbag-info">{{ item.money }}元现金</text>
									</view>
									<view class="redbag-body" v-else>
										<image class="redbag-btn" src="https://app1-api.qianr.com/static/bonus/list-redbag-btn.png" mode="aspectFill"></image>
										<text class="redbag-info">{{ item.money }}元现金</text>
									</view>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 红包弹窗 -->
			<view class="redbag-dialog-container cu-modal" @touchmove.stop.prevent :class="rbagmodelshow ? 'show' : ''" @click="hideModel()">
				<view class="redbag-dialog-wrapper" @click.stop="">
					<image class="redbag-bg" src="https://app1-api.qianr.com/static/bonus/big-redbag-normal.png" mode="aspectFill"></image>
					<view class="redbag-body">
						<image class="redbag-dialog-btn" src="https://app1-api.qianr.com/static/bonus/list-redbag-btn.png" mode="aspectFit" :animation="openbrnanimation" @click="openBtn()"></image>
						<text class="redbag-info" v-text="redbagCurData.info"></text>
					</view>
					<image src="https://app1-api.qianr.com/static/bonus/big-redbag-close.png" mode="aspectFill" class="redbag-close-btn"></image>
				</view>
			</view>

			<!-- 打开红包 -->
			<view class="redbag-dialog-container dialog-mask" @touchmove.stop.prevent v-if="openrbagmodelshow" @click="hideOpenBtn()">
				<view class="redbag-dialog-wrapper" @click.stop="">
					<image class="redbag-bg" src="https://app1-api.qianr.com/static/bonus/big-redbag-open.png" mode="aspectFill"></image>
					<view class="redbag-body">
						<view class="redbag-body-num" v-if="redbagResultData.status !== 1085">
							<text v-text="redbagResultData.money"></text>
							<text>元现金</text>
						</view>
						<view class="redbag-null" v-else><text>来晚了，没抢到</text></view>
						<view class="redbag-more" @click="toResultPage()">
							<text>查看大家的手气</text>
							<image src="https://app1-api.qianr.com/static/bonus/big-redbag-arrow.png" mode="aspectFill"></image>
						</view>
					</view>
					<image src="https://app1-api.qianr.com/static/bonus/big-redbag-close.png" mode="aspectFill" class="redbag-close-btn"></image>
				</view>
			</view>

			<v-dialog>
				<view class="dialog-text">
					<text v-if="dialogType == 2">可领红包个数为0</text>
					<text>完成今日任务即可获得红包次数</text>
				</view>
				<view class="dialog-btn" @click="jump()">去完成</view>
			</v-dialog>

			<!-- 登录弹窗 -->
			<v-login-model></v-login-model>
		</block>
	</view>
</template>

<script>
// 引入mescroll-mixins.js
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';

// 引入mescroll-uni组件 (如已在main.js注册全局组件,则省略此步骤)
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
// 应用数字滚动插件
import countup from '@/components/countUp.vue';
import vDialog from '@/components/vDialog.vue';
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			swiperList: {},
			redbagData: {
				myPack: 0, //可领红包个数
				isNewPerson: false //1展示新手专属红包 2不展示新手专属红包
			},
			redbagResultData: {
				//打开红包结果
				money: '',
				status: ''
			},
			redbagCurData: {
				//当前弹出红包数据
				info: '新手红包',
				id: '',
				money: '',
				type: 1
			},
			timer: null,
			num: 12.68,
			bag1animation: {},
			openbrnanimation: {},
			rbagmodelshow: false,
			openrbagmodelshow: false,
			listRedbagBgList: {
				normalBg: 'https://app1-api.qianr.com/static/bonus/list-redbag-normal.png',
				openBg: 'https://app1-api.qianr.com/static/bonus/list-redbag-open.png',
				endBg: 'https://app1-api.qianr.com/static/bonus/list-redbag-end.png'
			},
			dialogType: 2, //1或2  2为2行文字, 默认为2
			// status	int	状态: 1是可抢该系列红包 2已经抢过 3红包被抢光 4还没到时间开抢
			dataList: [],
			mescroll: null,
			onlineStatus: false,
			// 下拉刷新的常用配置
			downOption: {
				use: false, // 是否启用下拉刷新; 默认true
				auto: true // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				textColor: '#fff',
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				textNoMore: '已全部加载'
			},
			newsList: [],
			videoAd: null,
			videoCount: 0
		};
	},
	computed: {
		...mapGetters(['getDialogStatus', 'getLoginStatus', 'token', 'getInfo']),
		...mapState(['loginDialogStatus'])
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
		}
		return {
			title: '天天领红包',
			imageUrl: 'https://app1-api.qianr.com/static/bonus/share.png',
			path: `/pages/index/index?inviteCode=${this.getInfo.invite_code}`
		};
	},
	components: {
		countup,
		vDialog,
		MescrollUni
	},
	//监听状态是否发生改变
	watch: {
		getLoginStatus(newValue, oldValue) {
			if (newValue) {
				//值发生改变执行的函数
				this.getHomeData();
			}
		}
	},
	onShow() {

		if(this.onlineStatus){
			
			if (!this.getLoginStatus) {
				this.setLoginDialogStatus();
			}
			
			this.getHomeData();

			this.hourlyRefresh((hour, minute) => {
				console.log('执行整点计划 =>', `${hour}:${minute}`);
				this.getHomeData();
			});
			
		}
	},
	onLoad(options) {
		if (options) {
			this.setInviteCode(options.inviteCode);
		}
		
		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			this.videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-3718775ed7c3516f'
			});
			
			this.videoAd.onLoad(() => {
			});
			
			this.videoAd.onError(err => {
				console.log("视频加载失败");
				uni.showToast({
					icon: 'none',
					title: '广告显示失败'
				});
			});
			
		}
		

		if (this.countTimer() >= 0) {
			this.onlineStatus = true;
		} else {
			uni.setNavigationBarTitle({
				title: '红包攻略'
			});
			this.onlineStatus = false;
			this.mescroll.resetUpScroll();
			uni.hideTabBar();
		}
	},
	mounted() {
		this.$nextTick(function() {
			// this.getHomeData();
		});
	},
	methods: {
		...mapMutations(['setDialogStatus', 'setLoginDialogStatus', 'setInviteCode',]),
		openModel(type = 2) {
			//type=1, 列表红包  type=2, 新手红包
			this.rbagmodelshow = true;
			if (type == 1) {
				this.redbagCurData.type = 1;
				this.redbagCurData.info = `${this.redbagCurData.money}元现金`;
			} else {
				this.redbagCurData.type = 2;
				this.redbagCurData.info = '新手红包';
			}
		},
		// 红包封面 => 关闭按钮
		hideModel() {
			this.rbagmodelshow = false;
		},
		// 红包封面 => 開红包按钮
		openBtn() {
			let animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease'
			});
			this.openbrnanimation = animation;
			animation.rotateY(360).step();
			this.openbrnanimation = animation.export();
			
			if (this.redbagCurData.type == 1) {
				//看广告
				this.showVideoAd();	
			} else {
				this.getNewPersonRedbagResult();
			}
			
			
			setTimeout(() => {
				animation.rotateY(0).step();
				this.openbrnanimation = animation.export();
			}, 1000);
		},
		showVideoAd() {
			
			uni.showLoading({
				title: '广告加载中'
			})
			
			this.videoAd.onClose(res => {
				if(!this.videoAd) return;
				this.videoAd.offClose();
				
				// 用户点击了【关闭广告】按钮
				if (res && res.isEnded) {
					// 正常播放结束，可以下发游戏奖励
					this.adVideoRes();
					this.videoCount++;
				} else {
					// 播放中途退出，不下发奖励
					uni.showToast({
						icon: 'none',
						title: '播放中途退出，不下发奖励'
					});
				}
			});
			
			// 用户触发广告后，显示激励视频广告        
			
			if (this.videoAd) {
					let index = 3;  //每3个广告弹一次
					this.videoAd.show().then(()=>{
						uni.hideLoading();
						if((this.videoCount + 1) % index == 0){
							uni.showToast({
								icon: 'none',
								duration: 10000,
								title: '点击下方按钮，可能触发惊喜'
							});
						}
					}).catch(() => {
					uni.hideLoading();
					// 失败重试
					this.videoAd
						.load()
						.then(() => this.videoAd.show())
						.catch(err => {
							uni.showToast({
								icon: 'none',
								title: '广告显示失败'
							});
							console.log('激励视频 广告显示失败');
						});
				});
			}
		},
		adVideoRes() {
			// if (this.redbagCurData.type == 1) {
			// 	//抢红包结果
					// this.getItemRedbagResult();
			// } else {
			// 	this.getNewPersonRedbagResult();
			// }
				this.getItemRedbagResult();
		},
		showResultModel(){
			this.rbagmodelshow = false;
			this.openrbagmodelshow = true;
			this.openbrnanimation = {};
		},
		getItemRedbagResult() {
			//获取列表红包结果
			this.$http
				.post('/api/bonus/v1/lead_bonus', { token: this.token, bonus_id: this.redbagCurData.id })
				.then(res => {
					this.redbagResultData.status = res.data.status;
					if (res.data.status == 200) {
						let data = res.data.data;
						this.redbagResultData.money = data.money;
						this.showResultModel();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},

		getNewPersonRedbagResult() {
			//获取新手红包结果
			this.$http
				.post('/api/bonus/v1/lead_new', { token: this.token })
				.then(res => {
					this.redbagResultData.status = res.data.status;
					if (res.data.status == 200) {
						let data = res.data.data;
						this.redbagResultData.money = data.money;
						this.showResultModel();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},

		// 打开红包  => 关闭按钮
		hideOpenBtn() {
			this.openrbagmodelshow = false;
			this.redbagResultData.money = '';
			this.getHomeData();
		},
		showOpenBtn() {
			this.openrbagmodelshow = true;
		},
		// 打开红包  => 查看钱包
		lookBagbtn() {},
		jump() {
			uni.switchTab({
				url: '/pages/task/task'
			});
		},
		toResultPage(item = '') {
			let redbagId;
			if (item) {
				redbagId = item.id;
			} else {
				redbagId = this.redbagCurData.id;
			}
			uni.navigateTo({
				url: `../redbag-result/redbag-result?id=${redbagId}&type=${this.redbagCurData.type}`
			});
		},
		getHomeData() {
			this.$http
				.get('/api/bonus/v1/index', {
					params: {
						token: this.token
					}
				})
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.swiperList = data.banner;
						this.dataList = data.series;
						this.redbagData.myPack = data.my_pack;
						this.redbagData.isNewPerson = data.show;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		},
		openItemRedbag(item) {
			this.checkLogin(() => {
				if (item.status === 1) {
					if (this.redbagData.myPack === 0) {
						//可领红包数为0
						this.dialogType = 2;
						this.setDialogStatus();
					} else {
						this.redbagCurData.id = item.id;
						this.redbagCurData.money = item.money;
						this.openModel(1);
					}
				}
			});
		},
		openNewPersonRedbag() {
			this.checkLogin(() => {
				this.openModel(2);
			});
		},
		addNum() {
			this.checkLogin(() => {
				this.dialogType = 1;
				this.setDialogStatus();
			});
		},
		hourlyRefresh(callback) {
			var date, hour, minute, second, readyHour;
			this.timer = setInterval(function() {
				date = new Date();
				hour = date.getHours();
				minute = date.getMinutes();
				second = date.getSeconds();
				// console.log('当前时间：' + hour + ':' + minute + ':' + second)
				if (minute === 0 || minute === 30) {
					if (second < 10) {
						//防止服务器延时更新  10秒内一直发请求
						if (!readyHour) {
							readyHour = true;
							callback(hour, minute);
						} else {
							readyHour = false;
						}
					}
				}
			}, 1000);
		},
		countTimer() {
			var timestamp = new Date().getTime();
			var date48 = new Date('2021/2/20 17:00:00').getTime();
			return timestamp - date48;
		},
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
			uni.request({
				url: 'https://mini-gl.binglue.com/article/list',
				method: 'GET',
				data: {
					page: pageNum,
					pageSize: pageSize,
					id: 100
				},
				success: data => {
					// console.log(data.data);
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
					if (mescroll.num == 1) this.newsList = []; //如果是第一页需手动置空列表
					if(curPageData){
						this.newsList = this.newsList.concat(curPageData); //追加新数据
					}

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
					if(!curPageData || curPageData === undefined){
						curPageData = [];
					}
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
		toDetail(id) {
			uni.navigateTo({
				url: '../detail/detail?id=' + id
			});
		}
	},
	onHide() {
		this.setDialogStatus(false);
		this.rbagmodelshow = false;
		this.openrbagmodelshow = false;
		clearInterval(this.timer);
	}
};
</script>

<style lang="stylus">
page
	background linear-gradient(0deg, #FF594F, #FE3525)
	.content
		position relative
		.home-bg
			width 749rpx
			height 214rpx
			top 286rpx
			left 20rpx
.home-swiper
	margin 20rpx
	border-radius 20rpx
	overflow hidden
	.swiper-item
		width 100%
		image
			width 100%
	.wx-swiper-dots
		left auto
		right 55rpx
.home-title
	margin-top 80rpx
	display flex
	align-items center
	justify-content center
	text
		font-size 40rpx
		font-weight bold
		color #FFF5E9
		text-align center
		margin 0 30rpx
	.home-title-line
		width 120rpx
		height 16rpx
.home-scroll-body
	// min-height 80vh
	background #FFF5E9
	border-radius 20rpx
	overflow hidden
	margin 20rpx 20rpx 40rpx
	.home-scroll-line
		background #FFF5E9
		border 2rpx dashed #FF9A44
		border-radius 20px
		margin 27rpx 23rpx
		padding 40rpx 35rpx
.redbag-num-box
	display flex
	flex-direction column
	align-items center
	justify-content center
	width 588rpx
	height 160rpx
	margin 0 auto 40rpx
	position relative
	background-size 100% 100%
	background-image url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkwAAACgCAYAAAD+fTMTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNUMxRUVFRjRFRjcxMUVCQUM5MUUzNjkwMkNFMzFCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNUMxRUVGMDRFRjcxMUVCQUM5MUUzNjkwMkNFMzFCRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI1QzFFRUVENEVGNzExRUJBQzkxRTM2OTAyQ0UzMUJFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI1QzFFRUVFNEVGNzExRUJBQzkxRTM2OTAyQ0UzMUJFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+FtryvQAAFxxJREFUeNrs3VmsJNddx/H/qV5u9507M/aMl3gbZ5zI2LGDnDg2iUBCkARClAfyABK8ICFDSEAkfvADvCEhIpEoLGJVnIc85YFYYLClPBhI4hiHYCWOx7uM7djGiXffuXsvdTj/Wrqr667VXUsv349U0/d2d9Xp27er5nf/59QpY62VPNg/+kQ+GwIAACiJ+fw95ijP83irAAAADlbPfYu/8TmRWsMtbtOeLrXhYrzh4mlWi0KdMUfevDl/nt8aAACzrNsVu7V58P/37WWRRuPo2wx6zGx4a/1w8ePbvlt64W3f3fZd+/fcWXFgSgakYEmGJg1LcXAyUVAyg9x0tO3X+aABADCrXKCxnc1D/z+3na6YRss9L0NICIJSIjCJ3vZ3B6vgsWzyTx+DClJt7yV+LBmYsqgRmAAAmNm8tLUVZYUjPLfXDStNRwxiYrX3yg4rS9IPvh15jvHDHFJ5YBoEo70qTV6qa06iwJQhNFFhAgBgNmmQ6fWOHlh6Wh2Kh/EcmJZGu+Q0V9goW/hx1LDhdmxtiipMXrQMvq4lwlJt+Fjw/IyByTBOHQCAmdTvZK7uBFWmpfYR8kEiNGk3nk0FKonCklaYxsgSxXXJDZZkN1wiLMXjmDKPYarxgQMAYAZZrRhlDSv9o3ShJcJSEJxktLI0yB1+In9UHpjM7tA0GLuUDlMm+4umwgQAwOzxowHZXsb/x20UgA5czw4rTPH8khovvLibLp09pqLCFFeNTBSQzD4hyhs+L/P2AQDAzAWmcYseum7toCqTCYNRXFqyyRPLTCKLmPGKNYUEJtnvRSYCj0k9xhgmAADmmvV9yXxmfGJdYw6pMFkZnkwWZwubKNokc8kYCuqSS76gVHhKJ72sL54KEwAAs5iYxv8/3D9k3Tgs2URgsqk8MijeTE2FKR2eZDQ4jbzGQ1702qrYt990t+dFdrZFet3wvdCyXGMpmJvBrJwQaR/jgwgAwDTr++Ov6/uH5w2bTE7Jok0+pnNSo9deEfvjF0W2t/Z+XOdwcIvd2hD75msizaaYU5eIOXmKDyQAANPI+tWsO5eBaWdb7DNPimysZVuv0xH7k5eCapR3+RmRRpMPJgAAUxWYbDXrTm1geuP1oLtMmtGi14Fptt3iHTyPwvlVF5aeCLrdxra9Kf6PnhHviqtFWsvhRfZcKrV+8toyibka0r+E5LirkbP7jLvxRi/rAgAAFkb+gUkDj2aQvgsrO+7r2rYLGWth0IiDlM7YGSytcJ3Vt8Q+/Vg+CbLfE//FZ8WcvtiFpna2dQft29QMoalvo+BkdCxVrc5kmgAAEJhy5MKMbPsuSO240HE+HLztAod94dl8y216JeQ3XhNz6WXuJ2zk/3Noparvi+1H1TCtONUaYur14BYAAKQEA7Pt+OtWrNpJjXwXOl5+4fDR7+OGpjdfL+fn0A9AryN2e1Ps5nmxne2pGKAGAMD0BCavmnXnIjBtrAcDtguj29Y2yqThqbvjgtOaC05bUzFQDQCAytUmiBzeggcmu7Y6F23sq9sRu7U22UB2AADmwSTjfWvVjxWuLjBpt5XOp1Q0bUMnvawsFVqxO5thNx0AAAvKTBB6jLfAgcnuNynljLe1L+2mIzQBABZVbYLzzOrVTxtZYYVpZz7bOiQ0BWcKAgCwaHQc0jhVJl1noccw9Xrz2dYhbHeHnQYAsJjGmeqnPh3T9VQXmHx/Pts6jE7oCQDAAjLjhJ/Ojtitzcr/L6/z6yv708JbAABYNFbs9vZ4J2Hp9DwamnR4zVJLTKtVyX+m1VWYyuyPnIK+z+Fr4TIqAIAFopNUr6/lc8a620awrQqqTdUliTJHvNenp5Bm9Hp6AAAsgn4/DDh5DkcpYptTHZiaS/PZ1kE0LNXoBQUALACtLG2sFXOpMBttu8RKU2WBybTac9nWQWHJNFvsQACA+aeTNm+uF3t5sDLamIbAJBoeyugq0zaWKgwqxohZWiYsAQAWJy/peKUyusy0e66kq3lUOhraHD85F23sq9EU0z4+NXNIAABQOO0mK/OSZNpWCV1z1Z4+dmxFpNksbvu6bW2j1BRowu635eNimu3wewAAFoSt4PqtZbRZbWDyPDGXXVXMaf/aFXbqovJCUr0hprXsgtKJsPvNeOw1AIAFS0tWpNspv11ts+CxTOWesqVniOkZa0vtaGmFwabVFvv0Y/n9sLrN0xcX1xWmYcirhVde1p+JuZUAABDpdUsbhL0rqGnbBY6Nzn/LGlL09HkNRsGtC0XaNRUM8m6E1STjjVZgTl4o5tobxD7zxOSDxLRqdfnVYpZXRPx+eOqh9m3qm2njW/1l2uGbnAha0Rfh18HihQEsft0ajuhmAwBgd26p8Nqt2raZqcB0+iK31aZIrREtWoGpH97tpqHphpvE/u9TIhvr47Xdaot32ZnhvEvRnEfEGwAASlDl9VILbnu6ZlHUMUA3vE/ktVfEvvzC0UfZ69lopy8Rc/IUH1YAAKri9+e27emcdvriS8W4RdZWxb79prs9H4Yn7Z9UOnYoOGX/mJiVEyLuFgAAVKyK8UsltT3d1+k4fnLXPEpmdZUPJAAAKBXnvgMAgHxUeVJUwW0TmAAAQE6poja3bROYAABAPmq1uW2bwAQAAHJR5DxIVbdNYAIAAPnQCaqrGMcUXaKMwAQAAKZfcAH6ZvntapsM+gYAADOTmfQ6sXPYJoEJAADkmCxctCgzNGlbXvFxhsAEAAByFVR8yjhjzrVRVkWLwAQAAHJOTEbM8kqx44rKaIPABAAAik0Ynphjx12gKSBqmGjbXnkxhsAEAACKoV1mK8fz7Z4rYpsEJgAAUCmtNGnAyWOskdtGsC2v/PhS5zcJAACKZcS02iLNJbEbayK+n2HVcG4nU9LZcAQmAABQvSxhSfNSUFGqVf6y6ZIDAADl6HYyr2I7nal46VSYFinU3/GH4SC5el28P/0CbwgAcIwulR0jMEmv6/5pV/7aqTAtkmhHlBo5GQA4RpedCH2Rfj/7erpOxm48AhMm3BnrYT9wncAEAByjS9bvVbMugQnj//VS470AAI7RpbLjVJdyWJfAhFBnR+xX7xR57dXDn6s7olvMUf56sVbkqSdEtrd4jwGAY/Tk/AlCD4EJEyf2r/yD2AfuF/+Lfyby45cP/evFRDvkwR9qX+z3HxL77DNiH/qeSK/HGw0AHKMn059gHBJjmDAp88lfFzl9kcj6uvh//UWRF57f/7mNxuEDCl2Kt//zXZFXfxL+pXP2XYx5AoA8jtF/9YXFPkZbv5p1CUwIvOMy8e744+BWtrfF/8e/EXF/dewp3hH327l6XbHffUDkjTfccxpi3nuTyBVX8h4DQB7H6J2dxT5GazdiFesSmDBw6rR4n7tDzBVXuR2qL/5XvxL2bacFAwr3OQND+9n/6zsiq6siS00x77s53MEBAByjQWCaG8dPiPnMZ8WcvSYoXfr/9DWxj51L/fXSCP960bJv0vaW2Ae+LbK+JtJqiXn/LSIXXcx7CgAco0FgmkPLy2J++3fFvPva8GKF9/6r2B/+ILEzRjtisn98Y13s/d8S2doWabfF3HyryIWneC8BoPBj9N2LdYzWn7mKdXPCaN5501wS85u/JXL3XSLPPSvyzfuC+SvM+z8g5hO/6iKy+9CZKCefXxX74APhhGDLx8Tc8jMix1Z4DwGAY3QBgcnTCZXGX7diVJjmkZ458clfE7nxp8O/VHT+Dx0wd/kV4dkal74jfJ72hevcFivHxdz6IcISAHCMLk5tgsjhVR9XqDDNK/fhMr/8cRHtL7/2umD+D/u9B4OzNOTEibCse9UZMUtLIicvENFbAADH6MJ+Zp3BvDtm2Kp+9nMC06x58YWwLzfozjW7v04mcf3+p64X6XTE3v/NwV82wfc/eEjMh39J5JJLw4GEwdWgo21p6XO/7evX9Qa/BwDgGJ2JcaFn3MkBjEdgQkb+X/55mLTjuTqiaw+Fs8M2olNSG8Mp9m/7tMjq28MdMTmL7MZG8JeLfeThxGON0dlm43lBktc4OnWaXwQAcIzOpjZB5JiCyTkJTLNm5fhwB9xjpwxu07PFXnBhcCrqyA7Zag/7w/WxWuIaRvG2vMQ2kwsAgGN0VlpZ09eX9bpwug5jmJD58/Ynn8++kts5zYd+Tuyjj4h0O+EAwvfcOEjswZweAACO0YWnjkb2wDQlXYwEpjmnE6OZFfdXytVnxfziR8N+8PjD13E75ksvipw5w7gkAOAYXTjjfg67s51tJZ3l3FoxS61KK00EprndC63Yh78fXOjR1upiTlwQXrwwHiyo/eLPPO3+mumKef65YGfdNbssAIBjdD4/sNhtF5SyhqXovQpCk1vEhSYTdF+WP5El8zDN64740H+L/Oi5oN/bXHe9yIUXij33Q7GPnxP71JPB2RTmnWfDU1a1PPp/LwU7JgCAY3SufF+snuk3TlhKc9sItuW2SWDCZNyOZR/8Trhz6QDBG98rotPwq/QZGMvHRM6+S6TZDNJ/MHlaj9AEAByjc/x5NeD0+9O9TQLTgnE7UnCBxldfCfq7zU03i7zzmuHj6Z1R6V8vV50JypxBhfOttwhNAMAxenJaWdpYC7sa82ajbZdYaSIwzQud6Oxb/ynyxuvBXyPmA7eKXHnV6HPi01jT81noYEKdHK25FA6o07k/ej3eUwDgGD1moLFiN9fD8Uez3Eby18CneA5sb4WzxK6vB/N1mFs+KHLRxbufF8/jsdc8HXqfXgFbd0Qt/er0/DprLPMuAQDH6KxZRscrldFlpt1zri2j81YRmHAgt/PYb/+H2yHdh7PdDi/QuN8sr4PZZvf5tetfLnp6azwwTz/sep8xvM8AwDH6aLSbLI8B3kelbWn1reD3gcA06/QDouXa5ZqYD/6syMmT+z+1nphx9qDtaV95X8u9BCUA4BidjS0zLCXaLLrKRGCadcvLYn7+F0S6buc5duzg58bT5h92TZ54B9d+YapLAMAx+sjJxYazlZdN21xqEZhwCC1F6nLobzu+SOMRf+2EJQDgGJ2FnsFX0iDsXUEtmCW9uFjDWXKLpHaEci8AgGP0uLmlwrP3im6bwLRQO+MMXM0aADhGz+7PUPJkkmW2TZfcIrniSt4DAOAYXRy/P7dtU2ECAAD5qGL8UkltE5gAAAAITAAAoBRVnrlXcNsEJgAAkFOqqM1t2wQmAACQjyrP8KsRmAAAwAww9frctk1gAgAA+dBLtlQxjim+XAyBCQAATD0NLo1m+e1qmwz6BgAAM5OZCr4IblVtEpgAAECOycJFizJDk7blFR9nCEwAACBXQcWnjDPmXBtlVbQITAAAIOfEZMQsrxQ7rqiMNghMAACg2IThiTl23AWaAqKGibbtlRdjCEwAAKAY2mW2cjzf7rkitklgAgAAldJKkwacPMYauW0E2/LKjy91fpMAAKBYRkyrLbbXFen3s6/eXAoHd3vV1XmoMAEAgOL5/nhhSaTysERgAgAA5ej3qlmXwAQAAGaFHbO6NOm6BCYAADA7/AlCD4EJAAAshL4/QdjyK3/5BCYAAFA861ezLoEJAADMTmCy1axLYAIAACAwAQAAEJgAAMCCMKaadQlMAABgdgKTV826BCYAADAzahNEDo/ABAAAFoFXmyBs1ap/+fwGAQBA0cwEocd4BCYAALAIavXx163XK3/5BCYAAFBC4vDG61rTdRjDBAAAFka9Uc46BCYAADCrzDjhp7Mjdmuz8gvw1vn1AQCAYlmx29siO9tjrGrD0OQWWWqJabU0ehGYAADAHPF9sZvrIv3+5Ntygcv2umKWV0of10SXHAAAKIYLSXZ9LZ+wVOQ2CUwAAKASWlnacMHGFjD2yEbbLnFcE4EJAADkHGhs2A2n449muQ0CEwAAKCzL6ODuMrrMtHtunIHkBCYAAFAp7SYrKcQEtK0SuuYITAAAIDe2zLBUYpsEJgAAkFNysSLdTvntapsFj2UiMAEAgHz0uqUNwt4V1LRtAhMAAJh2tteb27YJTAAAIB8lTyZZZtvFBiYtkQ0qczZcRip1tprSHQAAyJ9fVWByWcLvjeaNwdf5yP9actYOl5EXHt1n4seix03Gn4eABQDAlAYmv6KGU5nDJm7j3DAo4oxXrKkX8qJtKiTFL9LI8DGTrj4ddfM+H0gAAKZSRUWNdECy6dDkp8JUdvVCX7QmTZN4sdYkUqgGKBOlqKzbBwAAUxmYKjlLLooTQdZIV5f2CFJTUWEahKPEon2aGo58kxo1ZcIQlSUzUWECAGBKmerGMZla1CWYyCF+tIzkEjtWliggMKVfWD8MRfoGaljS1+glE6EZrTwdxu/zeQQAYBp57v/zXhWFDRcovNpoIAryxz5haToqTFGaM9ESpL2+DMpIQWiKxjAF5bOM3XJUmAAAmErGBSZbUWHDeF4UkuywqqSvJVjiSlMiRJURmPwn79n9QgcPavebe9H6wv10GKqFP4imwCBQjTGGye/xiQQAYBpphWnMCs5kacmEbQdzMaUCk+0Pg5If3zcMTP4T/ybDaY8St8HNcBxUfewXNhqThpLjliQdiGzYxxhML2CGgSlLZuoTmAAAmFo1T6RT8vXkms09ut0SVaW40jQITv3RTDMYNJ6ILTY5/ZHZHZj8x+9+j1v5NveMX3HfnnVfLw1D0h5ByaTSTlxhGnl+PErdiypLUQUqftxkGcNEYAIAYFqZek3sdq/kNtsi/a6MTCNg/VTXXC/RRTfSbWjD0GR33O2z7otvuHvudFt9fBiiEhUm/7F/abonfsnd++kw0UiqAnTEcBOfEZd4HYMfQEOSiZZ47JLJ2CXX7/JpBABgmpVZZQqqS/3wpLKRwGSj+xNVpn5vV5dcosK05Na53n3hFvmsC0lfdvff7h7f0m3VB2FJzL1u+ciwiBQHpIPCkjk8MMWDrzw/qjBFSxyWMgcmKkwAAEyzoMrU8Yu/tlytFrQVZoP0XEvJcUzJAeC9VIXJDCfTDitNepcn1nzK3fNud8fH3R2duML0F+7Bj+wOQWafsGT2zUuDLrPkCw4qSvpivWF3nRm3wtThkwgAwLSHpmZD7MZOcQPAXX4w7ZbLFt1h7hjkD393aBoJTuniS3IIUfx9EJw+7G6+5L75g7r/6D/f4Br9VPYXul+g6UW9cKnAFMzD5I2ObxrnLLkegQkAgJkJTVub+YemICwth2EpOUNA+nIoQS9Xf7R7bs/AdKDfc8vfa4XpNgnO989JEJgSk0b5tWFQ0mkGBt1xImNVmAhMAADMUGiqu9C0ld+FeV2mMO22yxgub6Rzz16XRdkrMNlMXYWakW7TwPSxsV5w8tS7JE17I2GpH3XFmf2rS1kyE4EJAIDZCk1LLjTtdCYfCN5sBtsKxyHtFUwkdQ25RNecn7gCSfbw9jENTNeMBqCRSQhkkGjiuZNGXtQeSeferxX6pnPpXQAAFpctbKt2j/A1uOMab/hdnMZkmNAGT7aj9+1qgBgDAABmNILtm30GD3RM/9xdT4iY60bmXDJ7nB233wDtrGOQAAAASs9Fdp+wlC4KxWOgko/bx+ru62+IsdcNe+LM8Ekm0RUX9weOXMrElH+9GAAAgPFSU+LG7g5T1u4RpoLwdJ/pP/L1G13wediFotrINeJM6naQkagoAQCAWc9O6XCUuo2fY4ML0N1krPvGP3fX37og9JlhWEpPVrnHrN8AAACzm5gSRaZUhcna5H1/5/79/Xim79vdHdeGl0axe4/hji9At+98AgAAADMSlka+3GscU3D771FGkqDCpPxHvh5dfFfCi+8eesFdQhMAAJjhsDS4a1dQ0omavuzuv93dbo0Epph/7q4b3M3vSDChpbnG5aLGgSGJMU0AAGDqc5I9ODxZ2XD/PO++us8td7rnP5pc7/8FGABcSD6ombpP+wAAAABJRU5ErkJggg==')
	.redbag-num
		display flex
		align-items center
		text
			font-size 80rpx
			font-family Microsoft YaHei UI
			font-weight bold
			color #FC3025
			line-height 80rpx
			padding-left 56rpx
		.add-num
			width 40rpx
			height 40rpx
			margin-left 18rpx
	.redbag-num-text
		text
			text-align center
			font-size 24rpx
			font-weight 400
			color #FC3025
			margin 0 10rpx
		&::after, &::before
			display inline-block
			vertical-align middle
			content ''
			width 100rpx
			height 2rpx
			background #FEC5C3
.redbag-bg
	position absolute
	top 0
	left 0
	right 0
	bottom 0
	width 100%
	height 100%
	z-index 1
.redbag-body
	position relative
	z-index 2
	height 100%
	display flex
	align-items center
	flex-direction column
.redbag-list
	display flex
	justify-content space-between
	flex-wrap wrap
	.redbag-item
		width 294rpx
		height 286rpx
		background-size 100% 100%
		margin-bottom 40rpx
		position relative
		&:nth-child(2n+1):nth-last-child(-n+2), &:nth-child(2n+1):nth-last-child(-n+2)+.redbag-item
			margin-bottom 0
		&.redbag-end
			.redbag-info
				color #9e9b97
			.redbag-item-mask
				background transparent
				text
					font-size 36rpx
		.redbag-btn
			width 98rpx
			height 103rpx
			margin 110rpx auto 0
		.redbag-info
			font-size 24rpx
			font-weight 400
			color #FEF3D8
			line-height 24rpx
			position absolute
			bottom 20rpx
			width 100%
			text-align center
.redbag-body-num
	display flex
	flex-direction column
	align-items center
	margin-top 20rpx
	text
		font-size 90rpx
		font-weight bold
		color #ED2724
		line-height 80rpx
		&+text
			font-size 24rpx
			line-height 30rpx
			font-weight normal
.redbag-more
	font-size 28rpx
	font-weight 800
	color #FEF3D8
	line-height 80rpx
	display flex
	justify-content center
	align-items center
	margin-top 40rpx
	image
		width 15rpx
		height 26rpx
		margin-left 10rpx
		/* 使用选择器重置最后一行的格子下边距为0 */
.redbag-item-mask
	position absolute
	left 50%
	transform translateX(-50%)
	width 283rpx
	height 100%
	display flex
	justify-content center
	align-items center
	flex-direction column
	font-size 50rpx
	font-weight bold
	color #FFF5E9
	z-index 666
	border-radius 30rpx
	background-color rgba(0, 0, 0, 0.5)
	text+text
		font-size 30rpx
		margin-top 10rpx
.redbag-dialog-container
	.redbag-dialog-wrapper
		width 501rpx
		height 504rpx
		position absolute
		left 50%
		top 50%
		transform translate(-50%, -50%)
		.redbag-dialog-btn
			width 173rpx
			height 173rpx
			margin 196rpx auto 40rpx
		.redbag-info
			font-size 42rpx
			color #FEF3D8
		.redbag-body-num
			margin-top 56rpx
			text
				font-size 120rpx
				font-weight bold
				color #ED2724
				line-height 120rpx
				&+text
					font-size 30rpx
					line-height 30rpx
		.redbag-null
			font-size 50rpx
			font-weight bold
			color #ED2724
			margin-top 100rpx
		.redbag-more
			font-size 40rpx
			position absolute
			top 280rpx
			image
				width 20rpx
				height 35rpx
				margin-left 20rpx
		.redbag-close-btn
			width 44rpx
			height 44rpx
			position absolute
			bottom -100rpx
			left 50%
			transform translateX(-50%)
			pointer-events none
.news-list
	overflow hidden
.news-item
	padding 38rpx 30rpx
	background-color #fff
	border 1rpx solid #e7e7e6
	border-width 1px 0
	flex-direction column-reverse
	display flex
.new-oneimg-item
	display flex
	flex-direction row
	justify-content space-between
.new-oneimg-item .news-img
	/* width: 220rpx; */
	flex 0 0 220rpx
	margin-right 20rpx
.new-oneimg-item .news-title
	/* width: 445rpx; */
	flex 1
.news-list .news-title
	font-size 32rpx
	color #313036
	/* font-weight: bold; */
	margin-bottom 15rpx
.news-list .news-title .time
	font-size 22rpx
	color #b3b3b3
	display block
	font-weight normal
	margin-top 15rpx
.news-list .news-summary
	font-size 24rpx
	line-height 40rpx
	color #787878
	padding 20rpx 0
.news-list .news-img
	display flex
	justify-content space-between
.news-list .news-img image
	width 220rpx
	height 136rpx
	object-fit cover
</style>
