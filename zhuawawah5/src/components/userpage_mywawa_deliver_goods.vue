<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left" href="#/userpage_mywawa"></a>
			<h1 class="header_title">申请发货</h1>
		</header>
		<div class="goods_no_address" v-if="isPdlist" @click="toAddrList(1)">
			<dl>
				<dt>无收货地址，<span>点击添加收货地址</span></dt>
				<dd class="arrow"></dd>
			</dl>
		</div>
		<div class="addr_list" v-if="!isPdlist" @click="toAddrList(1)">
			<dl>
				<dt>
        			<div class="addr_name" v-text="userName"></div>
        			<div class="addr_phone" v-text="userPhone"></div>
        		</dt>
				<dd v-cloak>
					{{addressVal + addrInfo}}
				</dd>
			</dl>
			<div class="arrow"></div>
		</div>
		<div class="goods_wawalist">
			<ul>
				<li class="vux-1px-b" v-for="item in wawaList" v-if="item.sum>0">
					<dl>
						<dt><img :src="item.gifticon"/></dt>
						<dd>
							<div class="goods_name" v-text="item.giftname"></div>
							<div class="goods_num" v-cloak>x{{item.sum}}</div>
						</dd>
					</dl>
				</li>
			</ul>
		</div>
		<div class="des">
			<label>申请备注</label>
			<div class="text_area">
				<x-textarea title="" v-model="textValue" placeholder='选填' show-counter :max="50"></x-textarea>
			</div>
		</div>
		<div class="goods_btn_box">
			<a href="javascript:;" class="this_btn" @click="postDeliver">申请发货</a>
		</div>
	</div>
</template>

<script>
	import global_ from '../components/Global.vue'
	import { XTextarea } from 'vux'
	var apiUrl = global_.apiUrl;
	var isGoodslet;
	export default {
		name: 'app',
		data() {
			return {
				textValue: "",
				isPdlist: false,
				isDefault: "1",
				addressVal: [],
				userName: "",
				userPhone: "",
				addrInfo: "",
				addrId: "",
				wawaList: []
			}
		},
		components: {
			XTextarea
		},
		methods: {
			getAjaxAddrList() { //第一次进入申请发货页面选中默认收货地址
				var self = this;
				var token = getCookie("token");
				var url = apiUrl + "api/addr/api?token=" + token + "&api_name=addr_list";
				$.ajax({
					type: 'get',
					url: url,
					dataType: 'json',
					success: function(res) {
						var data = res.data;
						for(let i in data) {
							console.log(data[i].is_default)
							if(data[i].is_default == 1) {
								self.isPdlist = false
								self.userName = data[i].username;
								self.userPhone = data[i].mobile;
								self.addressVal = data[i].addr;
								self.addrInfo = data[i].addr_info;
								self.isDefault = data[i].is_default;
								self.addrId = data[i].addr_id;
								break;
							}else{
								self.isPdlist = true
							}
						}
						if(data.length == 0) {
							self.isPdlist = true
						}
					},
				});
			},
			getQueryAddrList() { //获取地址列表点击选中信息
				this.userName = this.$route.query.username;
				this.userPhone = this.$route.query.mobile;
				this.addressVal = this.$route.query.addr;
				this.addrInfo = this.$route.query.addr_info;
				this.isDefault = this.$route.query.is_default;
				this.addrId = this.$route.query.addr_id;
			},
			toAddrList(num) { //num=1代表是申请发货页点击过去的
				var self = this;
				self.$router.push({
					path: "userpage_receive_addr_yj",
					query: {
						num: num,
						back: this.$route.query.back,
						textValue: self.textValue
					}
				})
			},
			postDeliver() { //申请发货提交
				var self = this;
				var token = getCookie("token");
				var back = JSON.parse(this.$route.query.back);
				var w_string = '';
				for(let i = 0; i < back.length; i++) {
					w_string += back[i]['wawaid'] + ':' + back[i]['sum'] + ',';
				}
				w_string = w_string.substr(0, w_string.length - 1);
				if(self.isPdlist == false) {
					this.$vux.confirm.show({
						title: '是否确定申请发货？',
						theme: "android",
						onConfirm() {
							$.ajax({
								type: "post",
								url: apiUrl + "api/mywawa/api?token=" + token,
								data: {
									'api_name': 'set_mail',
									'addr_id': self.addrId,
									'remark': self.textValue,
									'w_list': w_string,
								},
								success: function(res) {
									var data = JSON.parse(res);
									// 显示
									if(data.code == '1'){
										self.$vux.alert.show({
											title: '恭喜你，申请发货成功！',
											content: '',
											buttonText: '查看发货进度',
											onShow() {},
											onHide() {
												self.$router.push({
													path: "userpage_mywawa",
													query: {
														initialSlide: 1
													}
												})
											}
										})
									}else{
										self.$vux.alert.show({
											title: data.msg,
											content: '',
											buttonText: '我知道了',
											onShow() {},
											onHide() {
												self.$router.push({
													path: "userpage_mywawa",
													query: {
														initialSlide: 0
													}
												})
											}
										})
									}
								}
							});
						},
						onCancel() {
							self.isShowGoodsAlert = true;
						}
					});
				} else {
					self.$vux.toast.show({
						text: '请选择收货地址',
						type: "text",
						position: "bottom",
					});
				}
			}
		},
		created: function() {},
		mounted: function() {
			var self = this;
			//是否进入地址列表页选择过地址
			localStorage.setItem("isGoodslet", this.$route.query.isGoodslet);
			var getGoodslet = localStorage.getItem("isGoodslet");
			this.$nextTick(function() {
				if(getGoodslet === "true") {
					self.getQueryAddrList();
				} else {
					self.getAjaxAddrList();
				}
				// 接收娃娃列表数据
				self.wawaList = JSON.parse(this.$route.query.back);
				if(self.textValue != undefined) {
					self.textValue = self.$route.query.textValue;
				}
			})

		}
	}
</script>

<style lang="less">
	[v-cloak] {
		display: none;
	}
	
	.goods_btn_box {
		padding: 0 0.3rem 0.5rem;
	}
	
	.des {
		padding: 0.45rem 0.3rem;
		label {
			color: #000;
			font-size: 0.28rem;
			display: block;
			margin-bottom: 0.2rem;
		}
		.text_area {
			.weui-cell {
				padding: 0;
			}
			.weui-textarea-counter {
				text-align: left;
				color: #999;
				font-size: 0.24rem;
				margin-top: 0.1rem;
			}
			textarea {
				width: 100%;
				height: 1.5rem;
				resize: none;
				border: 1px solid #D2D2D2;
				font-size: 0.24rem;
				color: #999;
				outline: none;
				padding: 0.2rem;
			}
		}
	}
	
	.goods_no_address {
		padding: 0 0.3rem;
		font-size: 0.28rem;
		color: #777;
		dl {
			height: 1.65rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			dt {
				span {
					color: #FE5F52;
				}
			}
		}
	}
	
	.weui-dialog {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		padding: 0.8rem 0;
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
			&:after {
				display: none;
			}
		}
		.weui-dialog__btn {
			width: auto;
			padding: 0 0.2rem;
			height: 0.8rem;
			border-radius: 0.4rem;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 0.28rem;
		}
		.weui-dialog__btn_default {
			background-color: #EBEBEB;
			margin-right: 0.3rem;
		}
		.weui-dialog__btn_primary {
			background-color: #FFEA7D;
			color: #000;
		}
		&.weui-skin_android {
			.weui-dialog__btn {
				width: 2rem;
				padding: 0;
			}
		}
	}
</style>