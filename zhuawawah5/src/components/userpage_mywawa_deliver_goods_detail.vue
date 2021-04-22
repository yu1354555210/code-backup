<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="toWaWaList"></a>
				<h1 class="header_title">娃娃详情</h1>
			</header>

			<div class="addr_list">
				<dl>
					<dt>
	        			<div class="addr_name" v-text="userName"></div>
	        			<div class="addr_phone" v-text="userPhone"></div>
	        		</dt>
					<dd v-cloak>
						{{addressVal + addrInfo}}
					</dd>
				</dl>
			</div>

			<div class="goods_wawalist">
				<ul>
					<li class="vux-1px-b" v-for="item in goodsList">
						<dl>
							<dt><img :src="item.gifticon"/></dt>
							<dd>
								<div class="goods_name" v-text="item.name"></div>
								<div class="goods_num" v-cloak>x{{item.nums}}</div>
							</dd>
						</dl>
					</li>
				</ul>
			</div>
			<div class="wawa_detail_main" v-if="type==0">
				<ul>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>订单编号</label>
						</div>
						<div class="wawa_detail_fr">
							<div>
								{{waybillno}}
								<a href="javascript:;" class="this_btn copy_btn" @click="copy" :data-clipboard-text="waybillno">复制</a>
							</div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>申请发货时间</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="ctime"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>状态</label>
						</div>
						<div class="wawa_detail_fr">
							<div class="has_status" v-if="wawa_status == 1">待邮寄</div>
							<div class="has_status" v-if="wawa_status == 2">已发货</div>
							<div class="has_status" v-if="wawa_status == 3">已确认</div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>备注</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="remark"></div>
						</div>
					</li>
				</ul>
			</div>
			<div class="wawa_detail_main" v-if="type==1">
				<ul>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>订单编号</label>
						</div>
						<div class="wawa_detail_fr">
							<div>
								{{waybillno}}
								<a href="javascript:;" class="this_btn copy_btn" @click="copy" :data-clipboard-text="waybillno">复制</a>
							</div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>发货时间</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="ctime"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>快递公司</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="kdname"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>快递单号</label>
						</div>
						<div class="wawa_detail_fr">
							<div>
								{{kdno}}
								<a href="javascript:;" class="this_btn copy_btn" @click="copy" :data-clipboard-text="kdno">复制</a>
							</div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>备注</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="remark"></div>
						</div>
					</li>
				</ul>
				<div class="btn_box">
					<a href="javascript:;" v-if="wawa_status==3" class="this_btn active">已确认收货</a>
					<a href="javascript:;" v-else class="this_btn" @click="confirmGoods">确认收货</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { dateFormat } from 'vux'
	import Clipboard from 'clipboard'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;

	export default {
		name: 'app',
		data() {
			return {
				wawa_status: "", //当前状态
				ctime: "", //获得时间
				goodsList: [],
				waybillno: this.$route.query.waybillno, //运单号
				userName: "",
				userPhone: "",
				addressVal: "",
				addrInfo: "",
				remark: "",
				type: "",
				kdname: "", //快递公司
				kdno: "" //快递单号,
			}
		},
		watch: {},
		methods: {
			copy() {
				var self = this;
				var clipboard = new Clipboard('.copy_btn')
				clipboard.on('success', e => {
					self.$vux.toast.show({
						text: '复制成功',
						type: "text",
						position: 'bottom'
					})
					// 释放内存  
					clipboard.destroy()
				})
				clipboard.on('error', e => {
					// 不支持复制  
					self.$vux.toast.show({
						text: '复制失败,请手动复制',
						type: "text",
						position: 'bottom'
					})
					// 释放内存  
					clipboard.destroy()
				})
			},
			confirmGoods() {
				var token = getCookie("token");
				var self = this;
				this.$vux.confirm.show({
					title: "是否确人收货?",
					theme: "android",
					onConfirm() {
						$.ajax({
							type: "post",
							url: apiUrl + "api/waybill/api?token=" + token,
							data: {
								'api_name': 'confirm',
								'waybillno': self.waybillno
							},
							dataType: 'json',
							success: function(res) {
								self.wawa_status = '3';
								self.$vux.toast.show({
									text: '确认收货成功',
									type: "text",
									position: "bottom"
								});
							},
							error: function(jqXHR) {
								self.$vux.toast.show({
									text: '确认收货失败',
									type: "text",
									position: "bottom"
								});
							}
						});
					}
				})
			},
			toWaWaList() {
				var self = this;
				var initialSlide;
				this.type == 0 ? initialSlide = 1 : initialSlide = 2;
				self.$router.push({
					path: "userpage_mywawa",
					query: {
						initialSlide: initialSlide
					}
				})
			}
		},
		created: function() {},
		mounted: function() {
			this.$vux.loading.show({
				text: '加载中'
			})
			var token = getCookie("token");
			var self = this;
			this.type = this.$route.query.type;
			this.$nextTick(function() {
				$.ajax({
					type: "post",
					url: apiUrl + "api/waybill/api?token=" + token,
					data: {
						'api_name': 'waybill_detail',
						'waybillno': self.waybillno
					},
					success: function(res) {
						var data = JSON.parse(res);
						data = data.data;
						self.userName = data.uname;
						self.userPhone = data.phone;
						self.addressVal = data.addr;
						self.addrInfo = data.addr_info;
						self.wawa_status = data.status;
						var timeDate = dateFormat(parseInt(data.ctime * 1000), 'YYYY-MM-DD HH:mm');
						self.ctime = timeDate;
						self.goodsList = data.goods;
						self.remark = data.remark;
						self.kdname = data.kdname;
						self.kdno = data.kdno;
						setTimeout(function(){
							self.$vux.loading.hide()
						},500);
					}
				});
			});
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/1px.less';
	[v-cloak] {
		display: none;
	}
	
	.goods_wawalist {
		background-color: #fff;
		margin: 0.2rem 0;
	}
	
	.wawa_detail_header {
		padding: 0.3rem;
		margin-bottom: 0.2rem;
		dl {
			display: flex;
			align-items: center;
			justify-content: space-between;
			dt {
				display: flex;
				align-items: center;
				.wawa_detail_img {
					width: 1rem;
					height: 1rem;
					border-radius: 50%;
					margin-right: 0.2rem;
					overflow: hidden;
				}
				.wawa_detail_name {
					font-size: 0.32rem;
					color: #000;
				}
			}
			dd {
				.wawa_detail_video {
					width: 0.6rem;
					height: 0.6rem;
					background: url(http://wawah5-1252571264.file.myqcloud.com//newimg/detail_video.png);
					background-size: 100%;
				}
			}
		}
	}
	
	.btn_box {
		padding: 0.5rem 0.3rem;
		.active {
			background-color: #D2D2D2;
			color: #777;
		}
	}
	
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
				padding: 0;
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
</style>