<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">福利码</h1>
			</header>
			<div class="this_input">
				<input type="text" id="welfare_code" placeholder="请输入福利码" />
			</div>
			<div class="user_btn_box">
				<a href="javascript:;" class="this_btn" @click="submitWelfare">立即兑换</a>
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
				giftname: ""
			}
		},
		mounted: function() {
			
		},
		methods: {
			submitWelfare() {
				var self = this;
				var token = getCookie("token");
				var uid = getCookie("uid");
				var code = $("#welfare_code").val();
				$.ajax({
					type: "get",
					url: apiUrl + "/api/public/?service=UserSign.award&token=" + token,
					data: {
						api_name: "wawa_room",
						uid: uid,
						code: code
					},
					dataType: "json",
					success: function(res) {
						if(res.code == 1) {
							var coins = res.data.coins;
							self.$vux.alert.show({
								title: `兑换成功，获得${coins}娃娃币`,
								content: '',
								buttonText: '关闭',
								hideOnBlur: true

							});
						} else if(res.code == 1013) {
							self.$vux.alert.show({
								title: '你已经使用此类福利码',
								content: '',
								buttonText: '关闭',
								hideOnBlur: true
							});
						} else if(res.code == 1011) {
							self.$vux.alert.show({
								title: '该福利码已使用',
								content: '',
								buttonText: '关闭',
								hideOnBlur: true
							});
						} else if(res.code == 1012) {
							self.$vux.alert.show({
								title: '请输入正确的福利码',
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
</script>

<style lang="less" scoped>
	.this_input {
		padding: 0.45rem;
		overflow: hidden;
		input {
			width: 100%;
			background: #fff;
			border: 1px solid #D2D2D2;
			height: 0.9rem;
			line-height: 0.9rem;
			border-radius: 0.45rem;
			text-align: center;
			color: #777777;
			font-size: 0.24rem;
			outline: none;
			-webkit-appearance: none;
		}
	}
	.ios .this_input {
		input {
			overflow: hidden;
		}
	}
	
	.user_btn_box {
		padding: 0 2.25rem;
	}
</style>
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