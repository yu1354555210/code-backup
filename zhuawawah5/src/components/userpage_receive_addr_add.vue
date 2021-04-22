<template>
	<div class="bg_whife">
		<div id="win_wrap" class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">收货地址添加</h1>
			</header>
			<group :gutter="0" class="add_group">
				<x-input title="收货人:" required id="receivename" v-model="userName"></x-input>
				<x-input title="联系电话:" required id="receivephone" type="tel" is-type="china-mobile" :max="11" v-model="userPhone" ref="valid_mobile" @on-change="isWin"></x-input>
				<x-address title="所在地区:" required :list="addressData" placeholder="请选择所在地区" id="receiveaddr" v-model="addressVal"></x-address>
				<x-textarea title="详细地址:" required id="receiveaddrarea" :autosize="true" v-model="userAdd"></x-textarea>
				<x-switch title="设为默认:" v-show="isShowDefault" :value-map="['0', '1']" v-model="isDefault"></x-switch>
			</group>
			<input type="hidden" name="getAddress" id="getAddress" :value="getName(addressVal)" />
			<div class="add_other">
				<a class="this_btn" href="javascript:;" id="saveaddress">保存</a>
				<p><span>注意：</span>香港、澳门、台湾、新疆、西藏暂不邮寄</p>
			</div>
		</div>
	</div>
</template>

<script>
	import { Group, XInput, XSwitch, XAddress, ChinaAddressV4Data, XTextarea, Value2nameFilter as value2name } from 'vux'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	var num; // 判断是否是娃娃申请发货页面跳转过来的 1代表是
	export default {
		components: {
			Group,
			XSwitch,
			XInput,
			XAddress,
			ChinaAddressV4Data,
			XTextarea,
		},
		name: 'app',
		data() {
			return {
				addressData: ChinaAddressV4Data,
				isDefault: "1",
				addressVal: [],
				userName: "",
				userPhone: "",
				userAdd: "",
				valid_mobile: false,
				isShowDefault: 0
			}
		},
		methods: {
			getName(value) {
				return value2name(value, ChinaAddressV4Data)
			},
			// 手机验证是否通过
			isWin() {
				this.valid_mobile = this.$refs.valid_mobile.valid;
			}
		},
		created: function() {},
		mounted: function() {
			num = this.$route.query.num;
			this.isShowDefault = this.$route.query.is_default;
			$("#win_wrap").height($(window).height());
			var token = getCookie("token");
			var self = this;
			$("#saveaddress").click(function() {
				var receivename = self.userName;
				var receivephone = self.userPhone;
				var receiveaddrInfo = self.userAdd;
				var receiveaddr = $("#getAddress").val();
				if(receivename != "" && receivephone != "" && receiveaddr != "" && receiveaddrInfo != "") {
					$.ajax({
						type: 'POST',
						url: apiUrl + "api/addr/api?token=" + token,
						data: {
							"api_name": "addr_add",
							"username": receivename,
							"mobile": receivephone,
							"addr": receiveaddr,
							"addr_info": receiveaddrInfo,
							"is_default": self.isDefault
						},
						dataType: 'json',
						success: function(data) {
							//检查手机号码是否输入正确
							if(self.valid_mobile) {
								self.$vux.toast.show({
									text: '保存成功!',
									type: "text",
									time: 1000
								});

								if(num == 1) {
									self.$router.push({
										path: "userpage_receive_addr_yj",
										query: {
											num: num,
											back: self.$route.query.back,
											textValue: self.$route.query.textValue
										}
									})
								} else {
									self.$router.push({
										path: "userpage_receive_addr_yj",
										query: {
											back: self.$route.query.back
										}
									})
								}

							} else {
								self.$vux.toast.show({
									text: '请检查输入!',
									type: "text"
								})
							}
						},
						error: function(jqXHR) {
							self.$vux.toast.show({
								text: '保存失败!',
								type: "text"
							})
						}
					});
				} else {
					self.$vux.toast.show({
						text: '内容不能为空!',
						type: "text",
					})
				}

			});

		}
	}
</script>

<style scoped>
	.wrapper {
		overflow: hidden;
	}
</style>
<style lang="less">
	.add_group {
		overflow: hidden;
		margin: 0.2rem 0;
		.weui-cells {
			&:before {
				border: 0 !important;
			}
			.weui-cell {
				padding: 0.2rem 0.3rem 0.2rem;
				overflow: hidden;
				&:before {
					left: 0;
				}
			}
			.weui-label {
				font-size: 0.28rem;
			}
			.vux-cell-box:not(:first-child):before {
				left: 0;
			}
			.weui-cell__bd {
				overflow: hidden;
			}
		}
		.weui-input {
			background-color: #fff;
			overflow: hidden;
			width: 100%;
			border: 0;
			outline: none;
			-webkit-appearance: none;
			height: .4rem;
			line-height: .4rem;
			color: #777;
		}
	}
	
	.add_other {
		padding: 0.4rem 0.3rem;
		p {
			margin-top: 0.3rem;
			font-size: 0.24rem;
			text-align: center;
			span {
				color: #FE5F52;
			}
		}
	}
	
	.weui-switch {
		appearance: none !important;
		-webkit-appearance: none !important;
	}
	
	.weui-textarea {
		overflow: hidden;
		-webkit-user-select: auto;
	}
	
	.weui-input,
	.vux-cell-placeholder,
	.weui-textarea,
	.vux-cell-value {
		font-size: 0.24rem !important;
	}
</style>