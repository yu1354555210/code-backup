<template>

</template>

<script>
	let apiUrl; 
	let dev = false;
	
	if(dev){
		apiUrl = 'http://wawa.paopaoren.cn/'; //测试地址
	}else{
		apiUrl = 'http://wawash.paopaoren.cn/'; //正式地址
	}
	
	export default {
		apiUrl //接口地址
	}
</script>

<style>

</style>