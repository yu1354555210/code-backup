<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">游戏详情</h1>
			</header>

			<div class="grab_record_box">
				<div class="grab_record_list">
					<ul>
						<li>
							<dl class="grab_flex">
								<dt>
										<div class="grab_gift_img"><img :src="img"/></div>
										<div class="grab_gift_name">
											<p v-text="name"></p>
										</div>
									</dt>
								<dd>
									<div class="success" v-if="success>0">抓取成功</div>
									<div v-else>抓取失败</div>
								</dd>
							</dl>
						</li>
					</ul>
				</div>
			</div>
			<div class="wawa_detail_main">
				<ul>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>编号</label>
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
							<label>抓取时间</label>
						</div>
						<div class="wawa_detail_fr">
							<div v-text="dateDiff(ctime)"></div>
						</div>
					</li>
					<li class="vux-1px-b">
						<div class="wawa_detail_fl">
							<label>抓取视频</label>
						</div>
						<div class="wawa_detail_fr">
							<div class="wawa_detail_video" v-if="video != ''" @click="toVideoRoom"></div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				ctime: "",
				img: "",
				name: "",
				success:　0,
				waybillno: 0,
				video: ""
			}
		},
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
			toVideoRoom(){
				this.$router.push({
					path: "room_play_video",
					query: {
						url: this.video
					}
				})
			}
		},
		created: function() {},
		mounted: function() {
			var token = getCookie("token");
			var hid = this.$route.query.hid;
			var self = this;
			this.$nextTick(function() {
				$.ajax({
					type: "get",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						'api_name': 'game_detail',
						'hid': hid,
					},
					success: function(res) {
						var data = JSON.parse(res);
						data = data.data;
						self.ctime = data.ctime;
						self.img = data.img;
						self.name = data.name;
						self.success = data.success;
						self.waybillno = data.hid;
						self.video = data.video;
					}
				});
			})
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/1px.less';
	[v-cloak] {
		display: none;
	}
	
	.wawa_detail_video {
		width: .6rem;
		height: .6rem;
		background: url(http://wawah5-1252571264.file.myqcloud.com//newimg/detail_video.png);
		background-size: 100%;
	}
	
	.grab_record_box {
		.grab_flex {
			padding: 0.33rem 0.3rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 0.2rem;
			dt {
				display: flex;
				align-items: center;
				.user_img {
					width: 1rem;
					height: 1rem;
					overflow: hidden;
					border-radius: 50%;
					margin-right: 0.25rem;
				}
				.user_name {
					font-size: 0.32rem;
					color: #000;
				}
				.grab_gift_img {
					width: 1.1rem;
					height: 1.1rem;
					overflow: hidden;
					border-radius: 50%;
					margin-right: 0.5rem;
				}
				.grab_gift_name {
					p {
						font-size: 0.28rem;
						color: #000;
					}
					span {
						margin-top: 0.05rem;
						display: block;
						width: 100%;
						font-size: 0.22rem;
						color: #777;
					}
				}
			}
			dd {
				font-size: 0.24rem;
				color: #777;
				span {
					color: #FE5F52;
					font-size: 0.32rem;
					margin: 0 0.05rem;
				}
				.success {
					color: #FE5F52;
				}
			}
		}
		.grab_record_list {
			background-color: #fff;
			li {
				&:last-child {
					&:after {
						display: none;
					}
				}
			}
		}
	}
</style>