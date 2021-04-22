<template>
	<div class="bg_whife">
		<div class="wrapper">
			<header class="header">
				<a class="back header_left" @click="toWaWaList"></a>
				<h1 class="header_title">娃娃详情</h1>
			</header>

			<div class="wawa_detail_header">
				<dl>
					<dt>
						<div class="wawa_detail_img"><img :src="gifticon"/></div>
						<div class="wawa_detail_name" v-text="giftname"></div>
					</dt>
					<dd>
						<div class="wawa_detail_video"  v-if="video != ''" @click="toVideoRoom"></div>
					</dd>
				</dl>
			</div>
			<div class="wawa_detail_main">
				<ul>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>编号</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="id"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>数量</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="nums"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>状态</label>
							<span><i v-text="caution"></i>天后自动换币</span>
						</div>
						<div class="wawa_detail_fr">
							<div class="has_status" v-if="wawa_status == 0">寄存中</div>
							<div class="has_status" v-if="wawa_status == 1">待邮寄</div>
							<div class="has_status" v-if="wawa_status == 2">已发货</div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>来源</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="is_charged==0?'房间抓取':'充值赠送'"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>抓取时间</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="ctime"></div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { dateFormat } from 'vux'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;

	export default {
		name: 'app',
		data() {
			return {
				gifticon: "", //娃娃图标
				giftname: "", //娃娃名称
				id: "", //娃娃编号
				nums: 0, //数量
				caution: "", //xx天自动换币
				wawa_status: "", //当前状态
				ctime: "", //获得时间
				is_charged: 0, //是否充值赠送,
				video: "" //视频地址
			}
		},
		watch: {},
		methods: {
			toWaWaList(){
				var self = this;
				self.$router.push({
					path: "userpage_mywawa",
					query: {
						initialSlide: 0
					}
				})
			},
			toVideoRoom(){
				this.$router.push({
					path: "/room_play_video",
					query: {
						url: this.video
					}
				})
			}
		},
		created: function() {},
		mounted: function() {

			var token = getCookie("token");
			var self = this;
			var wid = this.$route.query.w_id;
			this.$nextTick(function() {
				$.ajax({
					type: "post",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						'api_name': 'wawa_detail',
						'wawa_id': wid
					},
					success: function(res) {
						var data = JSON.parse(res);
						data = data.data;
						// console.log(data)
						self.gifticon = data.gifticon;
						self.giftname = data.giftname;
						self.id = data.id;
						self.nums = data.nums;
						self.wawa_status = data.status;
						var timeDate = dateFormat(parseInt(data.ctime * 1000), 'YYYY-MM-DD HH:mm');
						self.ctime = timeDate;
						self.is_charged = data.is_charged;
						var num = data.caution.replace(/[^0-9]/ig, "");
						self.caution = num;
						self.video = data.video;
					}
				});
			});

		},
		components: {
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/1px.less';
	[v-cloak] {
		display: none;
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
	
</style>