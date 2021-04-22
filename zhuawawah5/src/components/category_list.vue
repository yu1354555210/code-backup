<template>
	<div class="bg_whife">
		<div class="wrapper">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title" v-text="giftname"></h1>
			</header>
			<div id="mescroll" class="mescroll">
				<div class="no_address" v-if="isRecordList">
					<dl>
						<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
						<dd>没有数据哦</dd>
					</dl>
				</div>
				<div class="room_list" v-else>
					<ul id="dataList">
						<li v-for="item in recordList">
							<a @click.stop="toRoom(item)" href="javascript:;">
								<dl>
									<dt>
										<span class="room_num" v-if="item.rooms>1" v-cloak>{{item.free_rooms}}/{{item.rooms}}</span>
										<span v-if="item.status == 0" class="room_status">空闲中</span>
										<span v-else-if="item.status == 1" class="room_status room_status_maintain">补货中</span>
										<span v-else-if="item.status == 2" class="room_status room_status_maintain">维护中</span>
										<span v-else-if="item.status == 3" class="room_status room_status_ing">游戏中</span>
										<span v-else="item.status == 4" class="room_status room_status_maintain">维护中</span>
										<img :src="item.gifticon"/>
									</dt>
									<dd>
										<div class="room_price"><span v-cloak>{{item.spendcoin}}币/次</span></div>
										<div class="room_award" v-text="item.giftname"></div>
									</dd>
								</dl>
							</a>
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
	var type;
	var label_id;
	var title;
	var wawa_id;

	function getListDataFromNet(ctx, pageNum, pageSize, successCallback, errorCallback) {

		try {
			var token = getCookie("token");
			var url = apiUrl + "api/mywawa/api?token=" + token + "&size=" + pageSize + "&page=" + pageNum + "&api_name=wawa_index&label_id=" + label_id;
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
				pdlist: [],
				giftname: "",
				mescroll: null,
				recordList: [],
				isRecordList: false
			}
		},
		mounted: function() {
			var self = this;
			var token = getCookie("token");
			label_id = this.$route.query.labelId;
			title = this.$route.query.title;
			wawa_id = this.$route.params.listId;
			this.$nextTick(function() {
				self.mescroll = new MeScroll("mescroll", {
					up: {
						callback: self.upCallback,
						isBounce: false,
						empty: {
							warpId: "dataList",
						}
					},
					down: {
						// use: false
					}
				});
			});
		},
		methods: {
			toRoom: function(item) {
				var self = this;
				if(item.rooms > 1) {
					self.$router.push("/room_list/" + item.wawa_id)
				} else {
					if(item.status == "1" || item.status == "2" || item.status == "4") {
						self.$vux.toast.show({
							text: '机器正在维护中',
							type: "text",
							position: "bottom",
						});
					} else {
						self.$router.push({
							path: "/index_wawa/" + item.room_id,
							query: {
								rid: item.room_id
							}
						})
					}
				}
			},
			upCallback: function(page) {
				var self = this;
				getListDataFromNet(self, page.num, page.size, function(curPageData) {
					if(page.num == 1) self.recordList = [];
					self.recordList = self.recordList.concat(curPageData);
					self.mescroll.endSuccess(curPageData.length);
					self.giftname = title;
					if(curPageData.length == 0) {
						self.isRecordList = true;
					}
				}, function() {
					self.mescroll.endErr();
				});
			},
		}
	}
</script>

<style lang="less">
	.mescroll-downwarp {
		background-color: #FFEA7D;
	}
</style>