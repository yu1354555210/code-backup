<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">消息中心</h1>
			</header>
			<div id="mescroll" class="mescroll">
				<div class="message_list" id="dataList">
					<div class="message_item" v-for="item in newList">
						<div class="message_title vux-1px-b">
							<h2 v-text="item.title"></h2>
							<span v-text="dateDiff(item.ctime)"></span>
						</div>
						<div class="message_main">
							<div class="message_info" v-text="item.desc"></div>
							<a class="this_btn" :href="item.url" v-if="item.url != ''">查看详情</a>
						</div>
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
			var url = apiUrl + "api/notice/api?token=" + token + "&size=" + pageSize + "&page=" + pageNum + "&api_name=get_notice_list";
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
				newList: []
			}
		},
		methods: {
			upCallback: function(page) {
				var self = this;
				getListDataFromNet(self, page.num, page.size, function(curPageData) {
					if(page.num == 1) self.newList = [];
					self.newList = self.newList.concat(curPageData);
					self.mescroll.endSuccess(curPageData.length);
				}, function() {
					self.mescroll.endErr();
				});
			},
		},
		created: function() {},
		mounted: function() {
			var self = this;
			this.$nextTick(function() {
				var token = getCookie("token");
				self.mescroll = new MeScroll("mescroll", {
					up: {
						callback: self.upCallback,
						isBounce: false,
						empty: {
							warpId: "dataList",
						},
						loadFull: {
							use: true,
							delay: 500
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
	.message_list {
		.message_item {
			padding: 0.1rem 0.24rem 0.2rem;
			background-color: #fff;
			overflow: hidden;
			margin-bottom: 0.2rem;
			.message_title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 0.9rem;
				h2 {
					font-size: 0.32rem;
					font-weight: normal;
				}
				span {
					color: #4a4a4a;
					font-size: 0.24rem;
				}
			}
			.message_main {
				padding: 0.3rem 0;
				line-height: 0.32rem;
				color: #4A4A4A;
			}
			.this_btn {
				float: right;
				font-size: 0.24rem;
				width: 1.5rem;
				height: 0.6rem;
				padding: 0;
				margin-top: 0.1rem;
			}
		}
	}
</style>