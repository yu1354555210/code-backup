<template>
	<div class="bg_whife">
		<div class="wrapper">
			<header class="header">
				<a class="back header_left" @click="$router.back()"></a>
				<h1 class="header_title" v-text="giftname"></h1>
			</header>
			<div class="room_list">
				<ul>
					<li v-for="item in pdlist">
						<a @click.stop="toRoom(item)" href="javascript:;">
							<dl>
								<dt>
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
</template>

<script>
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				pdlist: [],
				giftname: ""
			}
		},
		mounted: function() {
			var self = this;
			var token = getCookie("token");
			this.$nextTick(function() {
				$.ajax({
					type: "get",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						api_name: "wawa_room",
						wawa_id: self.$route.params.listId
					},
					dataType: "json",
					success: function(res) {
						self.pdlist = res.data
						self.giftname = res.data[0].giftname
					}
				});
			});
		},
		methods: {
			toRoom: function(item) {
				var self = this;
				if(item.status == "1" || item.status == "2" || item.status == "4"){
					self.$vux.toast.show({
						text: '机器正在维护中',
						type: "text",
						position: "bottom",
					});
				}else{
					self.$router.push({
						path: "/index_wawa/" + item.room_id,
						query: {
							rid: item.room_id,
							gifticon: item.gifticon,
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
</style>