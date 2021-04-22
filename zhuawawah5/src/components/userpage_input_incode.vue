<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">输入邀请码</h1>
			</header>
			<div class="this_input">
				<input type="tel" name="" id="myincode" value="" placeholder="请输入邀请码" />
			</div>
			<div class="incode_friend" v-if="isIncode != true">每人只能输入1次好友的邀请码</div>
			<div class="user_btn_box">
				<a href="javascript:;" class="this_btn" :class="isIncode == true?'active':''" @click="submitIncode" v-text="isIncodeText"></a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				pdlist: [],
				giftname: "",
				isIncode: false,
				isIncodeText: "提交",
				num: 0
			}
		},
		mounted: function() {
			var self = this;
			this.$nextTick(function(){
				//规则信息
				$.ajax({
					type: "get",
					url: apiUrl + "api/usercode/api",
					data: {
						api_name: "get_code_config",
					},
					dataType: "json",
					success: function(res) {
						self.num = res.data.num;
					}
				});
			})
		},
		methods: {
			submitIncode() {
				var self = this;
				var token = getCookie("token");
				var code = $("#myincode").val();

				if(self.isIncode != true) {
					$.ajax({
						type: "get",
						url: apiUrl + "api/usercode/api?token=" + token,
						data: {
							api_name: "convert_code",
							code: code
						},
						dataType: "json",
						success: function(res) {
							if(res.code == 1) {
								self.$vux.alert.show({
									title: `邀请成功，获得${self.num}娃娃币`,
									content: '',
									buttonText: '关闭',
									hideOnBlur: true
								});
								self.isIncode = true;
								self.isIncodeText = '已提交';

							}else if(res.code == -1) {
								self.$vux.alert.show({
									title: res.msg,
									content: '',
									buttonText: '关闭',
									hideOnBlur: true
								});
							}
						}
					});
				}

			}
		}
	}
</script>

<style lang="less">
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
			padding: 0 0.5rem;
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

<style lang="less" scoped>
	.incode_friend {
		text-align: center;
		font-size: 0.24rem;
		color: #777;
		padding: 0 0 0.4rem;
	}
	
	.this_input {
		padding: 0.45rem;
		input {
			width: 100%;
			background: #FFFFFF;
			border: 1px solid #D2D2D2;
			height: 0.9rem;
			line-height: 0.9rem;
			border-radius: 0.45rem;
			text-align: center;
			color: #000;
			font-size: 0.44rem;
			outline: none;
			letter-spacing: 0.1rem;
			-webkit-appearance: none;
			overflow: hidden;
			&::-webkit-input-placeholder {
				font-size: 0.24rem;
				color: #777;
				letter-spacing: 0;
			}
		}
	}
	
	.user_btn_box {
		padding: 0 2.25rem;
		.active {
			background-color: #D2D2D2;
			color: #777;
		}
	}
</style>