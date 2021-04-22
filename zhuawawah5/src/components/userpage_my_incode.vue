<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">邀请奖励</h1>
				<a href="#/userpage_input_incode" class="header_right header_right_text">输入邀请码</a>
			</header>
			<div class="incode_title">我的邀请码</div>
			<div class="this_input">
				<input type="text" name="" :value="myincode" readonly />
			</div>
			<div class="user_btn_box">
				<a href="javascript:;" class="this_btn" @click="isShowShare = true">立即邀请</a>
			</div>
			<div class="incode_friend">已邀请 <span v-text="myincodeNum"></span> 位好友</div>
			<div class="incode_hint" v-html="notice"></div>
			<div class="share_mask" v-if="isShowShare" @click="isShowShare = false"><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/share.png"/></div>
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
				myincode: "",
				myincodeNum: 0,
				notice: "",
				isShowShare: false
			}
		},
		mounted: function() {
			var self = this;
			var token = getCookie("token");
			this.$nextTick(function() {
				//我的邀请码
				$.ajax({
					type: "get",
					url: apiUrl + "api/usercode/api?token=" + token,
					data: {
						api_name: "get_code",
					},
					dataType: "json",
					success: function(res) {
						self.myincode = res.data;
					}
				});

				//规则信息
				$.ajax({
					type: "get",
					url: apiUrl + "api/usercode/api",
					data: {
						api_name: "get_code_config",
					},
					dataType: "json",
					success: function(res) {
						var str = res.data.notice;
						str = str.replace(/\n/g,'<br>');
						self.notice = str;
					}
				});

				//邀请的人数
				$.ajax({
					type: "get",
					url: apiUrl + "api/usercode/api?token=" + token,
					data: {
						api_name: "invite_count",
					},
					dataType: "json",
					success: function(res) {
						self.myincodeNum = res.data.invite_count;
					}
				});
			});
		},
		methods: {
		}
	}
</script>

<style lang="less">
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
			color: #FE5F52;
			font-size: 0.44rem;
			letter-spacing: 0.1rem;
			outline: none;
		}
	}
	
	.incode_hint {
		font-size: 0.24rem;
		color: #777;
		line-height: 0.5rem;
		padding: 0 0.8rem;
	}
	
	.incode_friend {
		text-align: center;
		font-size: 0.28rem;
		color: #000;
		padding: 0.2rem 0 0.6rem;
		span {
			color: #FE5F52;
		}
	}
	
	.incode_title {
		text-align: center;
		margin-top: 1.5rem;
		font-size: 0.4rem;
		color: #000;
		margin-bottom: 0.5rem;
	}
	
	.user_btn_box {
		padding: 0 2.25rem;
		.this_btn{
			font-size: 0.28rem;
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