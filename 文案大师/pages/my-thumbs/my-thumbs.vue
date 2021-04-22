<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="20" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<good-list :list="goods" class="work-list"></good-list>
		</mescroll-body>
	</view>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';

export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			upOption: {
				// page: {
				// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
				// 	size: 10 // 每页数据的数量
				// },
				noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				empty: {
					icon: false,
					tip: '~ 无数据 ~' // 提示
				}
			},
			goods: [], //列表数据
		};
	},
	methods: {
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			//联网加载数据
			let sign = this.md5Libs.md5(`${page.num}${page.size}${this.signKey}`);
			this.$u
				.get('/api/master/v1/my_prise', {
					token: this.vuex_token,
					page: page.num,
					limit: page.size,
					sign: sign
				})
				.then(curPageData => {
					curPageData = curPageData.data;
					this.mescroll.endSuccess(curPageData.length);
					//如果是第一页需手动制空列表
					if (page.num == 1) this.goods = [];
					//追加新数据
					this.goods = this.goods.concat(curPageData);
				})
				.catch(err => {
					console.log(err);
					this.mescroll.endErr();
				});
			
		},
		//点击空布局按钮的回调
		emptyClick() {
			uni.showToast({
				title: '点击了按钮,具体逻辑自行实现'
			});
		},
	}
};
</script>


<style lang="stylus">

</style>
