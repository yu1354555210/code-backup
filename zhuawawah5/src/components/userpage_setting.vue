<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left" @click="$router.back()"></a>
			<h1 class="header_title">设置</h1>
		</header>
		<div class="wrapper bg_grey">
			<div class="mine_cells">
				<a class="mine_cell" href="#/userpage_receive_addr_yj">
					<div class="mine_cell_hd">
						<span>收货地址管理</span>
					</div>
					<div class="mine_cell_bd"></div>
				</a>
				<a class="mine_cell mine_cell_no_active" href="javascript:;">
					<div class="mine_cell_hd">
						<span>背景音乐</span>
					</div>
					<div class="mine_cell_bd">
						<x-switch id="bgmusic" title="" v-model="bgmusic.state" :value-map="[false, true]" prevent-default @on-click="fbgmusic(bgmusic, $event)"></x-switch>
					</div>
				</a>
				<a class="mine_cell mine_cell_no_active" href="javascript:;">
					<div class="mine_cell_hd">
						<span>音效</span>
					</div>
					<div class="mine_cell_bd">
						<x-switch id="yx" title="" v-model="yx.state" :value-map="[false, true]" prevent-default @on-click="fyx(yx, $event)"></x-switch>
					</div>
				</a>
			</div>
			<div class="mine_cells">
				<a class="mine_cell" href="#/userpage_user_protocol">
					<div class="mine_cell_hd">
						<span>用户协议</span>
					</div>
					<div class="mine_cell_bd"></div>
				</a>
				<a class="mine_cell mine_cell_no_active" href="javascript:;">
					<div class="mine_cell_hd">
						<span v-cloak>版本 {{ver}}</span>
					</div>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	import { XSwitch, Group } from 'vux'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				bgmusic: {
					state: true
				},
				yx: {
					state: true
				},
				ver: ""
			}
		},
		methods: {
			fbgmusic: function(item, $event) {
				item.state = !item.state;
				var type = 1;
				if(item.state == false) {
					type = 2;
				}
				localStorage.setItem("bgmusic", type);
				var token = getCookie("token");
				var url = apiUrl + "api/set/api?token=" + token + "&api_name=bgmusic&type=" + type;
				this.$ajax.get(url).then(res => {}).catch(error => console.log(error));
			},
			fyx: function(item, $event) {
				item.state = !item.state;
				var type = 1;
				if(item.state == false) {
					type = 2;
				}
				localStorage.setItem("yx", type);
				var token = getCookie("token");
				var url = apiUrl + "api/set/api?token=" + token + "&api_name=yx&type=" + type;
				this.$ajax.get(url).then(res => {}).catch(error => console.log(error));
			},
			getVer: function() {
				this.ver = localStorage.getItem("ver");
			}
		},
		created: function() {},
		mounted: function() {
			var uid = getCookie("uid");
			var token = getCookie("token");
			var self = this;
			// var url = "apiAction_userinfo.action?token=" + token + "&op=BaseInfo&uid=" + uid;
			var url = apiUrl + "api/public/?service=User.getBaseInfo&token=" + token + "&uid=" + uid;
			this.$nextTick(function() {
				self.getVer();
				self.$ajax.get(url).then(res => {
					self.bgmusic.state = res.data.data.user_setting.bgmusic;

					if(self.bgmusic.state == 1) {
						self.bgmusic.state = true;
					} else {
						self.bgmusic.state = false;
					}

					self.yx.state = res.data.data.user_setting.yx;

					if(self.yx.state == 1) {
						self.yx.state = true;
					} else {
						self.yx.state = false;
					}
				}).catch(error => console.log(error));
			});

		},
		components: {
			XSwitch,
			Group
		}
	}
</script>

<style>
	.weui-switch {
		appearance: none !important;
		-webkit-appearance: none !important;
	}
</style>