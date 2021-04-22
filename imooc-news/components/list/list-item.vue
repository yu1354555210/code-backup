<template>
	<list-scroll class="list-srcoll" @loadmore="loadmore">
		<list-card mode="base" :item="item" v-for="item in list" :key="item.id"></list-card>
		<uni-load-more v-if="list.length > 9 || list.length === 0" iconType="snow" :status="load.loading"></uni-load-more>
	</list-scroll>
</template>

<script>
	
	export default {
		props:{
			list: {
				type: Array,
				default(){
					return []
				}
			},
			load: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		methods:{
			loadmore(){
				this.$emit('loadmore')
			}
		}
	}
</script>

<style>
.list-scroll {
	height: 100%;
}
</style>
