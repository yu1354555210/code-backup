<template id="index_shop_record">
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title">娃娃币明细</h1>
			</header>
			<div id="mescroll" class="mescroll">
				<div class="no_address" v-if="isRecordList">
					<dl>
						<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
						<dd>还没有数据哦</dd>
					</dl>
					<div class="user_btn_box">
						<a href="#/" class="this_btn">赶快去抓娃娃</a>
					</div>
				</div>
				<div class="record_list" v-else>
					<ul id="dataList">
						<li class="vux-1px-b" v-for="item in recordList">
							<div class="record_fl" v-text="item.actiontitle"></div>
							<div class="record_middle" v-if="item.type == 'expend'">-{{item.totalcoin}}</div>
							<div class="record_middle record_income" v-else>+{{item.totalcoin}}</div>
							<div class="record_fr">{{dateDiff(item.addtime)}}</div>
						</li>
					</ul>
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
			var url = apiUrl + "index.php?g=Api&m=Record&a=api&token=" + token + "&size=" + pageSize + "&page=" + pageNum + "&api_name=bodyBill";
			$.get(url, function(datax) {
				var data = JSON.parse(datax);
				data = data.data.list;
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
				mescroll: null,
				recordList: [],
				isRecordList: false
			}
		},
		methods: {
			upCallback: function(page) {
				var self = this;
				page.size = 20;
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
						htmlNodata: "",
						loadFull: {
							// use: true,
							// delay: 500
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
	.record_list {
		background-color: #fff;
		padding-bottom: 0.3rem;
		li {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 0.9rem;
			padding: 0 0.33rem;
			font-size: 0.28rem;
			.record_fl {
				color: #000;
				width: 3.2rem;
				span {
					color: #fd483a;
				}
			}
			.record_middle {
				color: #fd483a;
				flex: 1;
				text-align: left;
				&.record_income {
					color: #080;
				}
			}
			.record_fr {
				color: #606060;
			}
		}
	}
</style>