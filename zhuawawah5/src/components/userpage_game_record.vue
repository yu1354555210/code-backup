<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">抓取记录</h1>
			</header>

			<div id="mescroll" class="mescroll">
				<div class="no_address" v-if="isRecordList">
					<dl>
						<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
						<dd>还没有抓取记录哦</dd>
					</dl>
					<div class="user_btn_box">
						<a href="#/" class="this_btn">赶快去抓娃娃</a>
					</div>
				</div>
				<div class="grab_record_box" v-else>
					<div class="grab_record_top">
						<dl class="grab_flex">
							<dt>
								<div class="user_img"><img :src="avatar"/></div>
								<div class="user_name" v-text="user_nicename"></div>
							</dt>
							<dd>
								共抓中<span v-text="total"></span>次
							</dd>
						</dl>
					</div>
					<div class="grab_record_list">
						<ul id="dataList">
							<li class="vux-1px-b" @click="toGameDetail(item.hid)" v-for="item in recordList">
								<dl class="grab_flex">
									<dt>
									<div class="grab_gift_img"><img :src="item.img"/></div>
									<div class="grab_gift_name">
										<p v-text="item.name"></p>
										<span v-cloak>{{dateDiff(item.ctime)}}</span>
									</div>
								</dt>
									<dd>
										<div class="success" v-if="item.success>0">抓取成功</div>
										<div v-else>抓取失败</div>
									</dd>
								</dl>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;

	function getListDataFromNet(ctx, pageNum, pageSize, successCallback, errorCallback) {

		try {
			var token = getCookie("token");
			var url = apiUrl + "api/mywawa/api?token=" + token + "&size=" + pageSize + "&page=" + pageNum + "&api_name=game_history";
			$.get(url, function(datax) {
				var data = JSON.parse(datax);
				var data = data.data;
				successCallback && successCallback(data); //成功回调
			});

		} catch(e) {
			errorCallback && errorCallback();
		}

	}

	export default {
		name: 'app',
		data() {
			return {
				content: '',
				mescroll: null,
				recordList: [],
				isRecordList: false,
				avatar: "",
				user_nicename: "",
				total: 0
			}
		},
		methods: {
			upCallback: function(page) {
				var self = this;
				getListDataFromNet(self, page.num, page.size, function(curPageData) {
					if(page.num == 1) self.recordList = [];
					self.recordList = self.recordList.concat(curPageData);
					self.mescroll.endSuccess(curPageData.length);
					if(curPageData.length == 0) {
						self.isRecordList = true;
					}
				}, function() {
					self.mescroll.endErr();
				});
			},
			toGameDetail(hid){
				this.$router.push({
					path: "user_game_record_detail",
					query: {
						hid: hid
					}
				})
			}
		},
		created: function() {},
		mounted: function() {
			var self = this;
			this.$nextTick(function() {
				var token = getCookie("token");
				
				//获取个人信息
				$.ajax({
					type: "post",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						'api_name': 'get_info',
					},
					success: function(res) {
						var data = JSON.parse(res);
						data = data.data;
						if(self.avatar == "" || self.avatar == apiUrl){
							self.avatar = 'http://wawah5-1252571264.file.myqcloud.com/newimg/default_img.png';
						}
						self.avatar = data.avatar;
						self.user_nicename = data.user_nicename;
						self.total = data.total;
					}
				});
				
				self.mescroll = new MeScroll("mescroll", {
					up: {
						callback: self.upCallback,
						isBounce: false,
						empty: {
							warpId: "dataList",
						}
					},
					down: {
						use: false
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
	
	.grab_record_box {
		.grab_record_top {
			margin-bottom: 0.2rem;
			background-color: #fff;
		}
		.grab_flex {
			padding: 0.33rem 0.3rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
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