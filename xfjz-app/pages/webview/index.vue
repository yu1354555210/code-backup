<template>
	<view>
		<view class="status-bar"></view>
		<view class="main"><web-view :src="url" @message="handleMessage"></web-view></view>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			url: '',
			webviewStyles: {
				progress: {
					color: '#FF3333'
				}
			}
		};
	},
	onLoad(options) {
		if (options && options.url) {
			let data = {
				token: this.token,
				packageName: this.$package_name,
				version: this.$version,
				uuid: uni.getStorageSync('uuid')
			};
			data = JSON.stringify(data);
			this.url = options.url + '?v=' + Math.random() + '&data=' + encodeURI(data);
			console.log("this.url: " + this.url);
		}
	},
	components: {},
	mounted() {
		this.$nextTick(function() {});
	},
	computed: {
		...mapGetters(['token'])
	},
	methods: {
		handleMessage(evt) {  
			console.log('接收到的消息：' + JSON.stringify(evt.detail)); 
		},
	}
};
</script>

<style lang="less"></style>
