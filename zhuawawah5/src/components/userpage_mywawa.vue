<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" href="#/userpage"></a>
				<h1 class="header_title">我的娃娃</h1>
				<a href="#/userpage_game_record" class="header_right header_right_text">抓取记录</a>
			</header>
			<ul class="tab_hd">
				<li class="cur">
					<a href="#">寄存中</a>
				</li>
				<li>
					<a href="#">待发货</a>
				</li>
				<li>
					<a href="#">已发货</a>
				</li>
			</ul>
			<div id="mescroll" class="mescroll">
				<div class="tab_box">
					<div class="swiper-container tab_container">
						<div class="swiper-wrapper" id="dataList">
							<!--代发货-->
							<div class="swiper-slide">

								<ul class="wawa_check_list" v-if="isGoodsList1">
									<li class="vux-1px-b" v-for="item in goodsList" v-if="item.status == 0" @click="toWaWaDetail(item.w_id)">
										<div class="wawa_check_img"><img :src="item.gifticon" /></div>
										<dl>
											<dt v-text="item.giftname"></dt>
											<dd v-text="item.caution"></dd>
										</dl>
										<div class="wawa_check_info">可换<span v-text="item.needcoin"></span>娃娃币</div>
									</li>
								</ul>

								<div class="no_address" v-else>
									<dl>
										<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
										<dd>还没有数据哦</dd>
									</dl>
									<div class="user_btn_box">
										<a href="#/" class="this_btn">赶快去抓娃娃</a>
									</div>
								</div>
							</div>
							<!--未发货-->
							<div class="swiper-slide">
								<div class="no_address" v-if="isGoodsList2">
									<dl>
										<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
										<dd>还没有数据哦</dd>
									</dl>
									<div class="user_btn_box">
										<a href="#/" class="this_btn">赶快去抓娃娃</a>
									</div>
								</div>

								<ul class="goods_info_list" v-if="!isGoodsList2">
									<li v-for="item in notDeliveredList" @click="toWaWaDeliverGoodsDetail(item.waybillno,0)">
										<div class="goods_info_top">
											<div class="goods_info_code">订单号：{{item.waybillno}}</div>
											<div class="goods_info_time">申请时间：{{dateDiff(item.ctime)}}</div>
										</div>
										<div class="goods_info_body">
											<span v-for="img in item.goods"><img :src="img.gifticon"/></span>
										</div>
									</li>
								</ul>
							</div>
							<!--已发货-->
							<div class="swiper-slide">

								<ul class="goods_info_list" v-if="isGoodsList3">
									<li v-for="item in concatDeliveredList" @click="toWaWaDeliverGoodsDetail(item.waybillno,1)">
										<div class="goods_info_top">
											<div class="goods_info_code">订单号：{{item.waybillno}}</div>
											<div class="goods_info_time">发货时间：{{dateDiff(item.fhtime)}}</div>
										</div>
										<div class="goods_info_body">
											<span v-for="img in item.goods"><img :src="img.gifticon"/></span>
										</div>
									</li>
								</ul>

								<div class="no_address" v-else>
									<dl>
										<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
										<dd>还没有数据哦</dd>
									</dl>
									<div class="user_btn_box">
										<a href="#/" class="this_btn">赶快去抓娃娃</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="wawa_check_btn" v-if="isbtn == 1">
					<a href="javascript:;" class="this_btn" @click="showGoodsAlert(1)">换娃娃币</a>
					<a href="javascript:;" class="this_btn" @click="showGoodsAlert(2)">申请发货</a>
				</div>
			</div>

			<!--兑换娃娃币弹窗-->
			<div class="goods_mask fadeIn animated" v-show="isShowGoodsAlert" @click.self="hideGoodsAlert">
				<div class="goods_winpop">
					<div class="goods_winpop_title vux-1px-b">兑换娃娃币
						<div class="winpop_close" @click="hideGoodsAlert"></div>
					</div>
					<div class="goods_winpop_main">
						<ul>
							<li v-for="(item,index) in goodsWinpopList">
								<dl>
									<dt><img :src="item.gifticon"/></dt>
									<dd>
										<div v-text="item.giftname"></div>
										<span>x{{item.total}}</span>
									</dd>
								</dl>
								<div class="total_box">
									<x-number title="" v-model="values[index]" button-style="round" :min="0" :max="item.total | parseNum" @on-change="value => change(item.needcoin, value,index, item.wawa_id)"></x-number>
								</div>
							</li>
						</ul>
					</div>
					<div class="goods_winpop_footer vux-1px-t">
						<div class="goods_winpop_total_info">总共可以兑换<span v-text="needcoin"></span>娃娃币</div>
						<a href="javascript:;" class="this_btn" @click="exchange">兑换</a>
					</div>
				</div>
			</div>
			<!--申请发货弹窗-->
			<div class="goods_mask fadeIn animated" v-show="isShowGoodsAlert2" @click.self="hideGoodsAlert">
				<div class="goods_winpop">
					<div class="goods_winpop_title vux-1px-b">申请发货
						<div class="winpop_close" @click="hideGoodsAlert"></div>
					</div>
					<div class="goods_winpop_main">
						<ul>
							<li v-for="(item,index) in goodsWinpopList">
								<dl>
									<dt><img :src="item.gifticon"/></dt>
									<dd>
										<div v-text="item.giftname"></div>
										<span>x{{item.total}}</span>
									</dd>
								</dl>
								<div class="total_box">
									<x-number title="" v-model="values[index]" button-style="round" :min="0" :max="item.total | parseNum" @on-change="value => change(item.needcoin, value,index, item.wawa_id)"></x-number>
								</div>
							</li>
						</ul>
					</div>
					<div class="goods_winpop_footer vux-1px-t">
						<div class="goods_winpop_total_info">已选择<span v-text="totalNums"></span>个</div>
						<a href="javascript:;" class="this_btn" @click="toDeliverGoods">申请发货</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { XNumber } from 'vux'
	var tabsSwiper;
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;

	function getListDataFromNet(ctx, pageNum, pageSize, successCallback, errorCallback) {

		try {
			var token = getCookie("token");
			var url = apiUrl + "api/mywawa/api?token=" + token + "&size=" + pageSize + "&page=" + pageNum + "&api_name=my";
			$.get(url, function(datax) {
				var data = JSON.parse(datax);
				var data = data.data;

				successCallback && successCallback(data); //成功回调
			});

		} catch(e) {
			errorCallback && errorCallback();
		}

	}
	export default {
		name: 'app',
		data() {
			return {
				uid: '',
				goodsList: [],
				isbtn: 1,
				mescroll: null,
				isShowGoodsAlert: false,
				isShowGoodsAlert2: false,
				goodsWinpopList: [],
				back: [],
				needcoin: 0,
				values: [],
				wawaid: [],
				totalNums: 0,
				notDeliveredList: [], //未发货信息
				yesDeliveredList: {}, //已发货信息
				cfmDeliveredList: [], //已确认信息
				concatDeliveredList: [], //已确认信息和已发货信息集合
				isGoodsList1: false,
				isGoodsList2: false,
				isGoodsList3: false,
				tol: "" //大于2才能发货
			}
		},
		watch: {},
		methods: {
			upCallback: function(page) {
				var self = this;
				getListDataFromNet(self, page.num, page.size, function(curPageData) {
					if(page.num == 1) self.goodsList = [];
					for(let i = 0; i < curPageData.length; i++) {
						if(curPageData[i].status == "0") {
							self.isGoodsList1 = true;
							break;
						} else {
							self.isGoodsList1 = false;
						}
					}
					for(let i = 0; i < curPageData.length; i++) {
						if(curPageData[i].status == "5") {
							self.isGoodsList3 = true;
							break;
						} else {
							self.isGoodsList3 = false;
						}
					}

					// 如果寄存中的娃娃数量小于2,提示
					var j = 0;
					for(let i = 0; i < curPageData.length; i++) {
						if(curPageData[i].status.indexOf("0") == 0) {
							j++;
						}
					}

					if(j < 2) {
						self.tol = false
					}

					if(curPageData.length < 2) {
						self.tol = false
					}

					self.goodsList = self.goodsList.concat(curPageData);
					self.mescroll.endSuccess(curPageData.length);
				}, function() {
					self.mescroll.endErr();
				});
			},
			showGoodsAlert(num) {
				var self = this;
				var type = 1;
				var token = getCookie("token");
				num == 1 ? type = 1 : type = 2;
				$.ajax({
					type: "get",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						'api_name': "get_wawa_list",
						'type': type
					},
					success: function(res) {
						var data = JSON.parse(res);
						var data = data.data;
						self.goodsWinpopList = data;

						if(data.length == "" || data.length == 0) {
							if(num == 1) {
								self.$vux.toast.show({
									text: '暂无可兑换娃娃',
									type: "text",
									position: "bottom",
								});
							} else {
								self.$vux.toast.show({
									text: '暂无可邮寄娃娃',
									type: "text",
									position: "bottom",
								});
							}
						} else {
							if(self.tol === false && num == 2) {
								self.$vux.toast.show({
									text: '2件以上才能申请发货哦~',
									type: "text",
									position: "bottom",
								});
							} else {
								if(num == 1) {
									self.isShowGoodsAlert = true;
								} else {
									self.isShowGoodsAlert2 = true;
								}
							}
							for(let i = 0; i < data.length; i++) {
								self.back.push({
									'sum': 0,
									'price': data[i]['needcoin'],
									'wawaid': data[i]['wawa_id'],
									'gifticon': data[i]['gifticon'],
									'giftname': data[i]['giftname'],
								});
								self.values.push(0);
							}
						}

					}

				});
			},
			hideGoodsAlert() {
				this.isShowGoodsAlert = false;
				this.isShowGoodsAlert2 = false;
			},
			change(val, $event, index, wawaid) { //加减计数器
				this.needcoin = 0;
				this.totalNums = 0;
				for(var i = 0; i < this.back.length; i++) {
					if(i == index) {
						this.back[i]['sum'] = $event;
					}
					this.needcoin += this.back[i]['sum'] * this.back[i]['price'];
					this.totalNums += this.back[i]['sum'];
				}
			},
			exchange() { //兑换
				var self = this;
				var token = getCookie("token");
				var w_string = '';
				for(let i = 0; i < this.back.length; i++) {
					if(this.back[i]['sum'] == 0) {
						continue;
					} else {
						w_string += this.back[i]['wawaid'] + ':' + this.back[i]['sum'] + ',';
					}
				}

				w_string = w_string.substr(0, w_string.length - 1);

				if(this.needcoin == 0) {
					self.$vux.toast.show({
						text: '请选择需换币的娃娃',
						type: "text",
						position: "bottom",
					})
				} else {
					self.hideGoodsAlert();
					this.$vux.confirm.show({
						title: `本次兑换您将获得${this.needcoin}个娃娃币,是否确定兑换?`,
						theme: "android",
						onConfirm() {
							$.ajax({
								type: "post",
								url: apiUrl + "api/mywawa/api?token=" + token,
								data: {
									'api_name': 'set_coin',
									'w_list': w_string
								},
								success: function(res) {
									self.mescroll = new MeScroll("mescroll", {
										up: {
											callback: self.upCallback,
											isBounce: false,
											empty: {
												warpId: "dataList"
											},
										},
										down: {
											use: true
										}
									});
								}
							});
						},
						onCancel() {
							self.isShowGoodsAlert = true;
						}
					});
				}
			},
			toWaWaDetail(wid) { //去往娃娃详情
				var self = this;
				self.$router.push({
					path: "userpage_mywawa_detail",
					query: {
						w_id: wid
					}
				})
			},
			toWaWaDeliverGoodsDetail(waybillno, type) { //去往娃娃发货详情
				var self = this;
				self.$router.push({
					path: "userpage_mywawa_deliver_goods_detail",
					query: {
						waybillno: waybillno,
						type: type
					}
				})
			},
			toDeliverGoods() {
				var self = this;
				if(this.totalNums == 0) {
					self.$vux.toast.show({
						text: '请选择需要邮寄的娃娃',
						type: "text",
						position: "bottom",
					});
				} else if(this.totalNums < 2) {
					self.$vux.toast.show({
						text: '2件以上才能申请发货哦~',
						type: "text",
						position: "bottom",
					});
				} else {
					self.$router.push({
						path: "userpage_mywawa_deliver_goods",
						query: {
							back: JSON.stringify(self.back)
						}
					})
				}
			},
			getNotDeliverGoods() { //获取待发货信息
				var self = this;
				var token = getCookie("token");
				$.ajax({
					type: "post",
					url: apiUrl + "api/waybill/api?token=" + token,
					data: {
						'api_name': 'waybill_list',
						'status': 1
					},
					success: function(res) {
						var data = JSON.parse(res);
						data = data.data;
						self.notDeliveredList = data;
						if(data.length == 0) {
							self.isGoodsList2 = true
						}
					}
				});
			},
			getYesDeliverGoods() { //获取已发货信息
				var self = this;
				var token = getCookie("token");
				$.ajax({
					type: "post",
					url: apiUrl + "api/waybill/api?token=" + token,
					data: {
						'api_name': 'waybill_list',
						'status': 2
					},
					success: function(res) {
						var data = JSON.parse(res);
						data = data.data;
						// console.log(data)
						self.yesDeliveredList = data;
						$.ajax({
							type: "post",
							url: apiUrl + "api/waybill/api?token=" + token,
							data: {
								'api_name': 'waybill_list',
								'status': 3
							},
							success: function(res) {
								var dataObj = JSON.parse(res);
								dataObj = dataObj.data;
								self.cfmDeliveredList = dataObj;
								self.concatDeliveredList = self.yesDeliveredList.concat(self.cfmDeliveredList);
								setTimeout(function(){
									self.$vux.loading.hide()
								},800)
							}
						});
					}
				});

			},
		},
		created: function() {},
		mounted: function() {
			this.$vux.loading.show({
				text: '加载中'
			})
			var token = getCookie("token");
			var self = this;
			this.$nextTick(function() {

				var initialSlide = this.$route.query.initialSlide;
				if(initialSlide == undefined || initialSlide == null) {
					initialSlide = 0;
				}

				//tab切换
				tabsSwiper = new Swiper('.swiper-container', {
					initialSlide: initialSlide, //设置默认显示第几个tab
					onSlideChangeStart: function(swiper) {
						$(".tab_hd .cur").removeClass('cur')
						$(".tab_hd li").eq(swiper.activeIndex).addClass('cur');
						swiper.activeIndex != 0 ? self.isbtn = 0 : self.isbtn = 1;
					}
				})
				$(".tab_hd li").on('click', function(e) {
					e.preventDefault()
					$(".tab_hd .cur").removeClass('cur')
					$(this).addClass('cur')
					tabsSwiper.slideTo($(this).index())
				});

				self.mescroll = new MeScroll("mescroll", {
					up: {
						callback: self.upCallback,
						isBounce: false,
						empty: {
							warpId: "dataList"
						},
					},
					down: {
						use: false
					}
				});

				this.getNotDeliverGoods();
				this.getYesDeliverGoods();

			});

		},
		components: {
			XNumber
		},
		filters: {
			parseNum(value) {
				return value = parseInt(value);
			}
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/1px.less';
	[v-cloak] {
		display: none;
	}
	
	.animated {
		animation-duration: 0.3s;
	}
	
	@red: #FE5F52;
	.weui-dialog {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		padding: 0.8rem 0;
		&.weui-skin_android {
			max-width: 5.6rem;
			height: 3.2rem;
			border-radius: 0.2rem;
			.weui-dialog__hd {
				text-align: center;
				padding: 0 0.7rem;
			}
			.weui-dialog__title {
				font-size: 0.28rem;
			}
			.weui-dialog__ft {
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0;
			}
			.weui-dialog__btn {
				width: 2rem;
				height: 0.8rem;
				border-radius: 0.4rem;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 0.28rem;
			}
			.weui-dialog__btn_default {
				background-color: #EBEBEB;
			}
			.weui-dialog__btn_primary {
				background-color: #FFEA7D;
				color: #000;
				margin-left: 0.3rem;
			}
		}
	}
	
	.goods_mask {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, .6);
		z-index: 66;
		.goods_winpop {
			width: 5.6rem;
			height: 6rem;
			background-color: #fff;
			border-radius: 0.15rem;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.winpop_close {
			width: 0.5rem;
			height: 0.5rem;
			background-image: url(http://wawah5-1252571264.file.myqcloud.com//newimg/winpop_close.png);
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
			position: absolute;
			right: 0;
			top: -0.7rem;
		}
		.goods_winpop_title {
			text-align: center;
			font-size: 0.26rem;
			color: #000;
			height: 0.9rem;
			line-height: 0.9rem;
			position: relative;
		}
		.goods_winpop_main {
			padding: 0 0.3rem;
			flex: 1;
			overflow-y: auto;
			ul {
				li {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0.2rem 0;
					dl {
						display: flex;
						dt {
							width: 0.7rem;
							height: 0.7rem;
							border-radius: 50%;
							overflow: hidden;
							margin-right: 0.1rem;
						}
						dd {
							font-size: 0.24rem;
							color: #000;
							span {
								color: #777;
							}
						}
					}
					.total_box {
						.vux-number-selector {
							box-sizing: content-box;
							width: 0.4rem;
							height: 0.4rem;
							border-radius: 50%;
							padding: 0;
							display: flex;
							justify-content: center;
							align-items: center;
							top: 0;
							font-weight: bold;
							background-color: #FFEA7D;
							border-color: #FFEA7D;
							svg {
								width: 0.24rem;
								height: 0.24rem;
								fill: #000000;
							}
							&.vux-number-disabled {
								border-color: #EBEBEB;
								background-color: #EBEBEB;
							}
						}
						.vux-number-input {
							height: 0.4rem;
							line-height: 0.4rem;
							font-size: 0.26rem;
							width: 0.35rem !important;
						}
						.weui-cell {
							padding: 0;
						}
					}
				}
			}
		}
		.goods_winpop_footer {
			height: 0.9rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 0.3rem;
			font-size: 0.24rem;
			color: #999;
			span {
				color: @red;
				margin: 0 0.05rem;
			}
			.this_btn {
				font-size: 0.28rem;
				height: 0.6rem;
			}
		}
	}
	
	.tab_hd {
		padding-top: 0.1rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		li {
			height: 0.7rem;
			flex: 1;
			text-align: center;
			display: flex;
			justify-content: center;
			a {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 1.2rem;
				height: 100%;
				color: #000;
				border-bottom: 0.04rem solid transparent;
				font-size: 0.28rem;
			}
			&.cur {
				a {
					border-bottom: 0.04rem solid @red;
					color: @red;
				}
			}
		}
	}
	
	.tab_box {
		height: 100%;
	}
	
	.tab_container {
		margin-top: 0.2rem;
		height: 100%;
	}
	
	.wawa_check_list {
		background-color: #fff;
		li {
			padding: 0.35rem 0.3rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.wawa_check_img {
				width: 1.1rem;
				height: 1.1rem;
				border-radius: 50%;
				margin-right: 0.46rem;
				overflow: hidden;
			}
			dl {
				flex: 1;
				dt {
					font-size: 0.28rem;
					margin-bottom: 0.05rem;
				}
				dd {
					color: #777;
					font-size: 0.24rem;
				}
			}
			.wawa_check_info {
				font-size: 0.24rem;
				color: #777;
				span {
					color: @red;
					margin: 0 0.02rem;
				}
			}
			&:last-child {
				&:after {
					display: none;
				}
			}
		}
	}
	
	.wawa_check_btn {
		position: fixed;
		bottom: 0.5rem;
		right: 0.3rem;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		z-index: 33;
		.this_btn {
			font-size: 0.28rem;
			margin: 0 0.2rem;
			padding: 0;
			width: 2rem;
		}
		.this_btn_red {
			background-color: @red;
			color: #fff;
		}
	}
	
	.goods_info_list {
		padding: 0.1rem 0;
		background-color: #fff;
		li {
			padding: 0.2rem 0.3rem;
			.goods_info_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 0.24rem;
				.goods_info_code {
					color: #000;
				}
				.goods_info_time {
					color: #777;
				}
			}
			.goods_info_body {
				display: flex;
				padding-top: 0.2rem;
				span {
					margin-right: 0.28rem;
					width: 0.8rem;
					height: 0.8rem;
					border-radius: 50%;
					overflow: hidden;
					img {
						object-fit: cover;
					}
				}
			}
		}
	}
</style>