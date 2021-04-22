<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left"  @click="$router.back()"></a>
			<h1 class="header_title">选择收货地址</h1>
		</header>
		<div class="addr_content" v-if="!isPdlist">
			<swipeout class="vux-1px-tb">
				<swipeout-item transition-mode="follow" v-for="(item,index) in pdlist" @click.native="selectAddr(item,index)">
					<div slot="right-menu">
						<swipeout-button type="warn" :width="100" text="删除" @click.native.stop="del(item,index,item.addr_id)"></swipeout-button>
					</div>
					<div slot="content" class="addr_list vux-1px-t">
						<dl>
							<dt>
			        			<div class="addr_name" v-text="item.username"></div>
			        			<div class="addr_phone" v-text="item.mobile"></div>
			        			<div class="addr_is_default" v-if="item.is_default==1">默认</div>
			        		</dt>
							<dd v-cloak>
								{{item.addr + item.addr_info}}
							</dd>
						</dl>
						<a @click.stop="to_edit_addr(item)" class="addr_edit_btn"></a>
					</div>
				</swipeout-item>
			</swipeout>
			<a @click="to_add_addr()" class="this_btn">添加收货地址</a>
		</div>

		<div class="no_address" v-if="isPdlist">
			<dl>
				<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
				<dd>暂无地址</dd>
			</dl>
			<div class="user_btn_box">
				<a @click="to_add_addr()" class="this_btn">添加收货地址</a>
			</div>
		</div>
	</div>
</template>
<script>
	import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	var num; // 判断是否是娃娃申请发货页面跳转过来的 1代表是
	export default {
		name: 'app',
		data() {
			return {
				pdlist: '',
				isPdlist: false,
				textValue: ""
			}
		},
		methods: {
			del: function(name, idx, addrid) {
				var self = this;
				var url = apiUrl + "api/addr/api?token=" + token + "&api_name=addr_del&addr_id=" + addrid;
				this.$vux.confirm.show({
					title: "是否确定删除该条地址信息？",
					theme: "android",
					onConfirm() {
						$.ajax({
							type: 'POST',
							url: url,
							data: {
								"api_name": "addr_del",
								"addr_id": addrid
							},
							dataType: 'json',
							success: function(res) {
								self.pdlist.splice(idx, 1);
								self.$vux.toast.show({
									text: '删除成功!',
									type: "text"
								});
								if(self.pdlist.length == 0) {
									self.isPdlist = true;
								}
							},
							error: function(jqXHR) {
								self.$vux.toast.show({
									text: '删除失败!',
									type: "text"
								});
							}
						});
					}
				})
			},
			to_edit_addr(item) {
				if(num == 1) {
					this.$router.push({
						path: "userpage_receive_addr_edit",
						query: {
							username: item.username,
							mobile: item.mobile,
							addr_id: item.addr_id,
							addr: item.addr.split(" "),
							addr_info: item.addr_info,
							is_default: item.is_default,
							back: this.$route.query.back,
							num: num,
							textValue: this.$route.query.textValue
						}
					})
				} else {
					this.$router.push({
						path: "userpage_receive_addr_edit",
						query: {
							username: item.username,
							mobile: item.mobile,
							addr_id: item.addr_id,
							addr: item.addr.split(" "),
							addr_info: item.addr_info,
							is_default: item.is_default,
							back: this.$route.query.back
						}
					})
				}

			},
			to_add_addr() {
				var self = this;
				if(this.pdlist.length != 0) {
					this.pdlist.forEach(function(value, index) {
						var isdef = value.is_default;
						isdef.indexOf(1) == 0 ? 1 : 0;
						if(num == 1) {
							self.$router.push({
								path: "userpage_receive_addr_add",
								query: {
									is_default: isdef,
									num: num,
									back: self.$route.query.back,
									textValue: self.$route.query.textValue
								}
							})
						} else {
							self.$router.push({
								name: "userpage_receive_addr_add",
								params: {
									is_default: isdef,
									back: self.$route.query.back
								}
							})
						}
					})
				} else {
					if(num == 1) {
						self.$router.push({
							path: "userpage_receive_addr_add",
							query: {
								num: num,
								back: self.$route.query.back,
								textValue: self.$route.query.textValue
							}
						})
					} else {
						self.$router.push({
							name: "userpage_receive_addr_add",
							params: {
								back: self.$route.query.back
							}
						})
					}
				}
			},
			selectAddr(item, idx) {
				var self = this;
				if(num == 1) {
					self.$router.push({
						path: "userpage_mywawa_deliver_goods",
						query: {
							username: item.username,
							mobile: item.mobile,
							addr_id: item.addr_id,
							addr: item.addr,
							addr_info: item.addr_info,
							is_default: item.is_default,
							isGoodslet: true,
							back: this.$route.query.back,
							textValue: this.$route.query.textValue
						}
					})
				} else {
					return;
				}
			},
			goBack() {
				if(num == 1) {
					if(this.pdlist.length != 0) {
						this.pdlist.forEach(function(value, index) {
							var isdef = value.is_default;
							isdef.indexOf(1) == 0 ? 1 : 0;
							self.$router.push({
								path: "userpage_receive_addr_add",
								query: {
									is_default: isdef,
									num: num,
									back: self.$route.query.back,
									textValue: self.$route.query.textValue
								}
							})
						})
					}
					this.$router.push({
						path: "userpage_mywawa_deliver_goods",
						query: {
							isGoodslet: true,
							back: this.$route.query.back,
							textValue: this.$route.query.textValue
						}
					})
				} else {
					this.$router.push({
						name: "userpage_setting"
					})
				}
			}
		},
		components: {
			Swipeout,
			SwipeoutItem,
			SwipeoutButton,
		},
		created: function() {},
		mounted: function() {
			console.log(this.$route.query.back)
			this.$nextTick(function() {
				num = this.$route.query.num;
				var token = getCookie("token");
				var url = apiUrl + "api/addr/api?token=" + token + "&api_name=addr_list";
				var self = this;
				self.$ajax.get(url).then(res => {
					self.pdlist = res.data.data;
					if(res.data.data.length == 0) {
						self.isPdlist = true
					}

				}).catch(error => console.log(error));
			})
		},
		updated: function() {}
	}
</script>
<style lang="less">
	@import '~vux/src/styles/1px.less';
	[v-cloak] {
		display: none;
	}
	
	.user_btn_box {
		padding: 0 2.25rem;
	}
	
	.addr_content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: calc(100% - 0.84rem);
		.this_btn {
			width: 90%;
			margin-bottom: 0.4rem;
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
	
	.vux-swipeout-button {
		font-size: 0.32rem !important;
	}
</style>