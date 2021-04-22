<template id="index_shop">
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a @click="$router.back()" class="back header_left"></a>
				<h1 class="header_title">充值</h1>
				<a href="#/userpage_shop_record" class="header_right header_right_text">娃娃币明细</a>
			</header>
			<div id="mescroll" class="mescroll">
				<div class="charge_top">
					<dl>
						<dt>我的娃娃币</dt>
						<dd v-text="coin"></dd>
					</dl>
				</div>
				<div class="charge_card_box">
					<ul>
						<li class="charge_card_week" v-for="(item,index) in dailyList" :class="item.days == '30' ? 'charge_card_month':''" v-cloak>
							<div class="charge_card_title" v-text="item.name"></div>
							<div class="charge_card_main">
								<dl>
									<dt>立即获得<span v-text="item.bodycoin"></span></dt>
									<dt>{{item.days}}天内每天可领取<span v-text="item.give_coin"></span> </dt>
									<dt class="charge_card_total">总计<span v-text="item.total_coin"></span></dt>
									<dd>
										<a href="javascript:;" @click="showAlert(index)" class="this_btn">￥{{item.money | parseNum}}</a>
									</dd>
								</dl>
							</div>
						</li>
					</ul>
				</div>
				<div class="charge_cells">
					<ul>
						<li v-for="charge in chargeList" v-cloak>
							<div class="charge_hd"><span v-text="charge.bodycoin"></span>送<span v-text="charge.give_coin"></span></div>
							<div class="charge_middle"><label v-if="charge.label != ''" v-text="charge.label"></label></div>
							<div class="charge_bd">
								<a href="javascript:;" class="this_btn" @click="chargePay(charge.charge_id)">￥{{charge.money | parseNum}}</a>
								<s v-if="charge.money_before != 0.00">￥{{charge.money_before | parseNum}}</s>
							</div>
						</li>
						<li v-for="item in presenterList" v-cloak>
							<div class="charge_gift">送{{item.name}}{{item.number}}个</div>
							<div class="charge_hd"><span v-text="item.bodyCoin"></span>送<span v-text="item.give_coin"></span></div>
							<div class="charge_middle"><label v-if="item.label != ''" v-text="item.label"></label></div>
							<div class="charge_bd">
								<a href="javascript:;" class="this_btn" @click="chargePay(item.charge_id)">￥{{item.money | parseNum}}</a>
								<s v-if="item.money_before != 0.00">￥{{item.money_before | parseNum}}</s>
							</div>
						</li>
					</ul>
				</div>
				<!--月/周卡弹窗-->
				<div class="charge_mask animated fadeIn" v-for="(item,index) in dailyList" v-show="index === isShowAlert" @click.self="hideAlert">
					<div class="charge_card_winpop winpop">
						<div class="winpop_main">
							<div class="winpop_title">购买{{item.name}}</div>
							<div class="winpop_info">
								<p>立即获取<span v-text="item.bodycoin"></span>娃娃币</p>
								<p>有效期内每天赠送<span v-text="item.give_coin">30</span>娃娃币，{{item.days}}天共赠送<span v-text="item.total_coin"></span>娃娃币（需每天登陆领取）</p>
								<p>月卡重复购买不会奖励叠加，而是时间顺延{{item.days}}天</p>
							</div>
							<a href="javascript:;" class="this_btn" @click="chargePay(item.charge_id)">立即获取</a>
						</div>
					</div>
				</div>
				<!--充值提示弹窗-->
				<div class="charge_mask animated fadeIn charge_hint_mask" :data-key="dataKey" v-show="isShowAlert2" @click.self="hideAlert">
					<div class="charge_hint_winpop winpop">
						<div class="winpop_main">
							<div class="winpop_title" v-text="winpopText"></div>
							<div class="winpop_time" v-text="winpopTime"></div>
							<a href="javascript:;" @click="toUrl" class="this_btn" v-text="btnText"></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import global_ from '../components/Global.vue';
	var apiUrl = global_.apiUrl;

	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	export default {
		name: 'app',
		data() {
			return {
				content: '',
				chargeList: [], //充值列表
				coin: '', //娃娃币
				presenterList: [], //充的多赠送娃娃
				dailyList: [], //月卡周卡
				isShowAlert: "",
				isShowAlert2: false,
				winpopText: "",
				winpopTime: "",
				btnText: "",
				dataKey: 1,
				mescroll: null
			}
		},
		methods: {
			showAlert(idx) {
				this.isShowAlert = idx;
			},
			hideAlert() {
				this.isShowAlert = false;
				this.isShowAlert2 = false;
			},
			gold() {
				var token = getCookie("token");
				var self = this;
				$.ajax({
					type: "post",
					url: apiUrl + "index.php?g=Api&m=Record&a=api",
					data: {
						'token': token,
						'api_name': "gold"
					},
					dataType: "json",
					success: function(res) {
						self.chargeList = res.data.charge;
						self.presenterList = res.data.presenter;
						self.dailyList = res.data.daily;
						self.coin = res.data.coin;
					}
				});
			},
			toUrl() {
				var $dataKey = $(".charge_hint_mask").data("key");
				var self = this;
				if($dataKey == 1) {
					self.$router.push("/")
				}
				if($dataKey == 2) {
					self.isShowAlert2 = false;
				}
			},
			chargePay(chargeId) {
				var token = getCookie("token");
				var openid = getCookie("openid");
				var ver = localStorage.getItem("ver");
				var cid = chargeId;
				var self = this;
				var bundle_name = getCookie("bundle_name");

				$.ajax({
					type: "post",
					url: apiUrl + "index.php?g=Api&m=Record&a=api",
					data: {
						'api_name': 'recharge',
						'token': token,
						'coin_id': cid,
						'type': 1,
						'bundle_name': bundle_name,
						'channel': 'h5',
						'version': ver,
						'openid': openid
					},
					dataType: "json",
					success: function(res) {
						var data = res.data;
						var appid = data.appId;
						var nonceStr = data.nonceStr;
						var xpackage = data.package;
						var signType = data.signType;
						var timeStamp = data.timeStamp;
						var paySign = data.paySign;
						var oid = data.oid;
						// document.write("appid:" + appid + "<br />" + "nonceStr:" + nonceStr + "<br />" + "xpackage:" + xpackage + "<br />" + "signType:" + signType + "<br />" + "timeStamp:" + timeStamp + "<br />" + "paySign:" + paySign + "<br />" + "token:" + token + "<br />" + "openid:" + openid);

						function onBridgeReady() {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": appid,
									"timeStamp": timeStamp,
									"nonceStr": nonceStr,
									"package": xpackage,
									"signType": signType,
									"paySign": paySign,
								},
								function(res) {
									if(res.err_msg == "get_brand_wcpay_request:ok") {
										self.isShowAlert = false;
										self.gold();
										$.ajax({
											type: "post",
											url: apiUrl + "index.php?g=Api&m=Record&a=api",
											data: {
												'api_name': 'recordDetails',
												'token': token,
												'o_id': oid
											},
											dataType: "json",
											success: function(res) {
												self.isShowAlert2 = true;
												let daliy_end = res.data.daily_end || "";
												switch(cid) {
													case "-101":
														self.dataKey = 1;
														self.winpopText = "周卡购买成功";
														self.winpopTime = "生效日期到：" + daliy_end;
														self.btnText = "去抓娃娃";
														break;
													case "-102":
														self.dataKey = 1;
														self.winpopText = "月卡购买成功";
														self.winpopTime = "生效日期到：" + daliy_end;
														self.btnText = "去抓娃娃";
														break;
													default:
														self.dataKey = 1;
														self.winpopText = "充值成功";
														self.winpopTime = "";
														self.btnText = "去抓娃娃";
												}
											}
										});
									}
									if(res.err_msg == "get_brand_wcpay_request:cancel") {
										// self.isShowAlert2 = true;
										// self.dataKey = 2;
										// self.winpopText = "充值取消";
										// self.winpopTime = "";
										// self.btnText = "继续充值";
									}
									if(res.err_msg == "get_brand_wcpay_request:fail") {
										self.isShowAlert2 = true;
										self.dataKey = 2;
										self.winpopText = "充值失败";
										self.winpopTime = "";
										self.btnText = "继续充值";
									}
								}
							);
						}
						if(typeof WeixinJSBridge == "undefined") {
							if(document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							} else if(document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							}
						} else {
							onBridgeReady();
						}
					}
				});
			},
		},
		created: function() {},
		mounted: function() {
			var self = this;
			$('.mescroll').height($(window).height()-$(".header").height());
			this.mescroll = new MeScroll("mescroll", {
				down: {
					use: false,
					isBounce: false,
				},
				up: {
					use: false,
					isBounce: false,
				}
			});
			this.$nextTick(function() {
				this.gold();
			})
		},
		filters: {
			parseNum(value) {
				return value = parseFloat(value);
			}
		}
	}
</script>

<style lang="less">
	.winpop,
	.mask {
		display: block
	}
	
	.charge_mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 66;
		background-color: rgba(0, 0, 0, .6);
	}
	
	.animated {
		animation-duration: 0.3s;
	}
	
	.charge_top dl {
		padding-left: 0.1rem;
	}
</style>