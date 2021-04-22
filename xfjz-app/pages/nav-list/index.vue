<template>
	<view>
		<!-- <view class="status-bar"></view> -->
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="right">
				<view class="action">
					<navigator url="../HM-search/HM-search"><text class="cuIcon-search"></text></navigator>
				</view>
			</block>
		</cu-custom>
		<view class="main">
			<view class="this-title this-title-big"><text class="title-info" v-text="title"></text></view>
			<jobs-item :list="jobsList" :isStyle="listIsStyle"></jobs-item>
		</view>
		<no-data :title="noDataText" v-if="isNoData"></no-data>
	</view>
</template>

<script>
import jobsItem from '../../components/jobs-item.vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			title: '',
			isNoData: false,
			noDataText: '',
			status: -1,
			listIsStyle: 'horizontal',
			jobsList: [],
			apiUrl: '/v1/user/apply-list',
			cateId: ''
		};
	},
	components:{
		jobsItem
	},
	onLoad(option) {
		if(option.page){
			let page = option.page;
			if(page == 'baoming'){
				this.title = '已报名';
				this.status = 10;
			}else if(page == 'luyong'){
				this.title = '已录用';
				this.status = 20;
			}else if(page == 'shoucang'){
				this.title = '已收藏';
				this.status = 0;
				this.apiUrl = '/v1/user/collect-list';
			}
			let data = {
				token: this.token,
				status: this.status
			}
			this.getData(data);
		}
		if(option.where){
			if(option.where == 'cateList'){
				this.listIsStyle = 'vertical';
				this.title = option.cateTitle;
				this.apiUrl = '/v1/cate/jobs';
			}
			let data = {
				city: this.getCity,
				cate_id: option.id
			}
			this.getData(data);
		}
	},
	mounted() {
		this.$nextTick(function(){
			this.switch_tips_dialog(false);
		})
	},
	computed:{
		...mapState(['city']),
		...mapGetters(['token','getCity'])
	},
	methods:{
		...mapMutations(['switch_tips_dialog']),
		getData(arg){
			console.log(arg);
			this.$http
				.get(this.apiUrl, {
					params: {
						...arg
					}
				})
				.then(res => {
					console.log(res);
					if(res.data.code == 1){
						let data = res.data.data;
						if(data.length > 0){
							this.jobsList = data;
						}else{
							this.isNoData = true;
							
							switch (this.status){
								case 0:
									this.noDataText = '收藏空空，立即查看兼职进行收藏';
									break;
								case 10:
									this.noDataText = '还未报名，立即投递兼职';
									break;
								case 20:
									this.noDataText = '还未出现录用兼职，快去查看兼职';
									break;
								default:
									this.noDataText = '目前该分类未有兼职，快去查看更多兼职';
									break;
							}
							
						}
					}
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="less">
</style>
