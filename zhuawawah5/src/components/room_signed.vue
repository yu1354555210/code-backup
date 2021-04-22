<template>
	<div class="bg_whife">
		<div class="wrapper">
			<header class="header">
				<a href="#/" class="back header_left"></a>
				<h1 class="header_title">签到</h1>
			</header>
			<!--抓到娃娃后系统通知-->
			<public-notice></public-notice>
			<div class="signed_room" :class="issupersign == 1 ? 'signed_top_grade' : ''">
				<div class="signed_head">
					<div class="signed_tag" v-if="issupersign == 1"></div>
				</div>
				<div class="signed_list">
					<ul>
						<li class="signed_today" @click="ShowSigns(item.score,item.signstate,item.recently)" v-for="item in signslist">
							<div class="signed_day">第{{item.recently}}天</div>
							<div class="signed_body" v-if="item.signstate == 0" :class="item.recently == 7 ? 'signed_seven_day':''">
								<span v-if="item.recently != 7">{{item.score}}</span>{{item.extraparam}}
							</div>
							<div class="signed_body signed_today" v-if="item.signstate == 1" :class="item.recently == 7 ? 'signed_seven_day':''">
								<span v-if="item.recently != 7">{{item.score}}</span>{{item.extraparam}}
							</div>
							<div class="signed_body signed_active" v-if="item.signstate == 2" :class="item.recently == 7 ? 'signed_seven_day':''">
								{{item.score}}{{item.extraparam}}
							</div>
						</li>
					</ul>
				</div>
				<div class="signed_btn" v-if="!issupersign == 1">
					<a href="#/userpage_shop" class="this_btn">充点小钱签到翻倍</a>
				</div>
				<div class="signed_other" v-if="!issupersign == 1">
					<p>充值任意金额获得高级签到，签到永久翻倍，</p>
					<p>宝箱惊喜也翻倍（仅限1次）</p>
				</div>
			</div>

			<div class="signed_mask fadeIn animated" @click.self="hideSigns" v-show="isShowSigns == true">
				<div class="winpop winpop_red">
					<div class="winpop_close" @click="hideSigns"></div>
					<div class="winpop_main">
						<div class="winpop_title">
							<p>签到成功</p>
						</div>
						<div class="winpop_icon">
							<i class="winpop_gold_icon" :class="recently == 7 ? 'winpop_gift_icon':''"></i>
							<span>+{{total_score}}</span>
						</div>
						<a @click="hideSigns" class="winpop_btn">关闭</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import global_ from '../components/Global.vue'
	import publicNotice from '../components/public_notice.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				signslist: [],
				issupersign: "", //是否是高级签到
				isShowSigns: false,
				total_score: "",
				recently: ""
			}
		},
		components:{
			publicNotice
		},
		mounted: function() {
			this.$nextTick(function() {
				this.$vux.loading.show({
					text: '加载中'
				})
				this.getSigns();
			});
			setTimeout(()=>{
				this.$vux.loading.hide()
			},1000);
		},
		methods: {
			getSigns() {
				var self = this;
				var token = getCookie("token");
				var uid = getCookie("uid");
				var ver = localStorage.getItem("ver");
				$.ajax({
					type: "get",
					url: apiUrl + "/api/public/?service=UserSign.getLatestSign",
					data: {
						token: token,
						uid: uid,
						appversion: ver,
						sign_ver: 1,
					},
					dataType: "json",
					success: function(res) {
						self.signslist = res.data.sign_score;
						self.issupersign = res.data.issupersign;
					}
				});
			},
			ShowSigns(score, signstate, recently) {
				var self = this;
				var token = getCookie("token");
				var uid = getCookie("uid");
				var ver = localStorage.getItem("ver");
				if(signstate == 1) {
					this.isShowSigns = true;
					$.ajax({
						type: "get",
						url: apiUrl + "/api/public/?service=UserSign.add",
						data: {
							token: token,
							uid: uid,
							appversion: ver,
							sign_ver: 1,
						},
						dataType: "json",
						success: function(res) {
							console.log(res)
							self.total_score = res.data.score;
							self.getSigns();
							self.recently = recently;
						}
					});
				}

			},
			hideSigns() {
				this.isShowSigns = false;
			}
		},
	}
</script>

<style lang="less">
	.weui-toast.vux-toast-bottom {
		bottom: 1rem;
	}
	
	.winpop {
		display: block;
	}
	
	.signed_mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 66;
		background-color: rgba(0, 0, 0, .6);
	}
	
	.signed_room {
		.signed_head {
			height: 2rem;
			position: relative;
			background: url(http://wawah5-1252571264.file.myqcloud.com/newimg/signed_bg.jpg) no-repeat top left;
			background-size: 100% 100%;
		}
		.signed_list {
			padding: 0.3rem;
			ul {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				li {
					width: 1.5rem;
					text-align: center;
					margin-bottom: 0.3rem;
					.signed_day {
						font-size: 0.28rem;
						color: #000;
						margin-bottom: 0.15rem;
					}
					.signed_body {
						width: 1.5rem;
						height: 2.5rem;
						margin: 0 auto;
						background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/signed_wkq.png);
						background-size: 100% 100%;
						padding-top: 1.4rem;
						font-size: 0.36rem;
						color: #F8E71C;
						&.signed_today {
							background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/signed_lq.png);
						}
						&.signed_active {
							color: #9b9b9b;
							background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/signed_kq.png);
						}
						&.signed_seven_day {
							flex: 2;
							width: 3.3rem;
							background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gift_wkq.png);
							text-indent: 9999em;
							&.signed_active {
								background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gift_kq.png);
							}
							&.signed_today {
								background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gift_lq.png);
							}
						}
					}
					&:last-child{
						width: 3.3rem;
					}
				}
			}
		}
		&.signed_top_grade {
			.signed_tag {
				background: url(http://wawah5-1252571264.file.myqcloud.com/newimg/signed_tag.png) no-repeat top left;
				width: 1.5rem;
				height: 0.6rem;
				background-size: 100% 100%;
				position: absolute;
				right: 0;
				top: 0;
			}
			.signed_list {
				ul {
					li {
						.signed_body {
							&.signed_seven_day {
								text-indent: 0;
								padding: 0 0 0 1.5rem;
								line-height: 2.5rem;
								background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gift_gj_wlq.png);
								&.signed_today {
									background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gift_gj_lq.png);
								}
								&.signed_active {
									text-indent: 0;
									padding: 1.4rem 0 0 0;
									line-height: initial;
									background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gift_kq.png);
								}
							}
						}
					}
				}
			}
		}
		.signed_btn {
			padding: 0 0.3rem;
			.this_btn {
				background-color: #FE5F52;
				color: #fff;
				font-size: 0.32rem;
			}
		}
		.signed_other {
			text-align: center;
			font-size: 0.24rem;
			color: #777;
			line-height: 0.38rem;
			padding: 0.3rem 0 0.5rem;
		}
	}
</style>