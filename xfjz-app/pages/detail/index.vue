<template>
	<view>
		<view class="status-bar"></view>
		<view class="detail-main">
			<image class="detail-main-bg" src="../../static/detail-bg.png" mode="aspectFill"></image>
			<cu-custom class="detail-topbar" :isBack="true">
				<block slot="right">
					<view class="action">
						<text class="icon-star" @click="collect(1)" v-if="!isCollect"></text>
						<text class="icon-star icon-star-fill" @click="collect(2)" v-else></text>
					</view>
				</block>
			</cu-custom>
			<view class="main">
				<view class="jobs-body"><jobs-item :list="jobsList" :isShowIcon="true"></jobs-item></view>
				<view class="detail-desc">
					<view class="this-title"><text class="title-info">兼职描述</text></view>
					<view class="detail-require">{{content.age}} | {{content.sex}}</view>
					<view class="detail-text" v-text="content.summary"></view>
					<view class="detail-warn">
						<image src="../../static/icon-warn.png" mode="aspectFill"></image>
						<text>温馨提示：刷单类兼职请勿相信，若有发现请及时向该APP举报。为保证企业及时查看您的简历，以及您的兼职安全，请认真完善个人简历。</text>
					</view>
				</view>
				<view class="detail-contact">
					<view class="this-title"><text class="title-info">联系方式</text></view>
					<view class="detail-person">
						<image src="../../static/icon-user.png" mode="aspectFill"></image>
						<text>{{content.contact}}：{{content.mobile}}</text>
					</view>
				</view>
			</view>
			<view class="detail-btn" @click="postData" v-if="isSign">立即报名</view>
			<view class="detail-btn detail-btn-cur" v-else>报名成功</view>
			<view class="cu-tabbar-height" v-for="(it,idx) in 2" :key="idx"></view>
		</view>
		<view v-if="tipsPopup">
			<popup :title="popupTitle">
				<text>{{popupInfo}}</text>
				<navigator v-if="popupIsShowUrl" :url="popupToUrl" v-text="popupToUrlInfo"></navigator>
				<text>{{popupInfo2}}</text>
			</popup>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import jobsItem from '../../components/jobs-item.vue';
import popup from '../../components/popup.vue';
export default {
	data() {
		return {
			jobsList: [],
			content: '',
			jobId: '',
			isCollect: false,
			isSign: true,
			popupTitle: '',
			popupInfo: '',
			popupInfo2: '',
			popupToUrl: '',
			popupToUrlInfo: '',
			popupIsShowUrl: false
		};
	},
	onLoad(option) {
		this.getData(option.id);
		this.jobId = option.id;
		console.log(this.isSign);
	},
	computed: {
		...mapState(['tipsPopup']),
		...mapGetters(['token'])
	},
	components: {
		jobsItem,
		popup
	},
	methods: {
		...mapMutations(['switch_tips_dialog']),
		getData(id) {
			this.$http
				.get('/v1/job/view', {
					params: {
						token: this.token,
						id: id
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 1) {
						let data = res.data.data;
						let arr = [];
						this.content = data;
						arr.push({
							cate_logo: data.cate_logo,
							city: data.city,
							title: data.title,
							settlement: data.settlement,
							labels: data.labels,
							money: data.money
						});
						this.jobsList = arr;
						if(data.is_apply != 0 ){
							this.isSign = false;
						}else{
							this.isSign = true;
						}
						if(data.is_collect == 0 ){
							this.isCollect = false;
						}else{
							this.isCollect = true;
						}
					}
				})
				.catch(err => {});
		},
		postData(){
			this.$http
				.get('/v1/user/apply', {
					params: {
						token: this.token,
						job_id: this.jobId
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 1) {
						this.isPopup = false;
						this.isSign = false;
						this.switch_tips_dialog(true);
						this.popupTitle = '报名成功';
						this.popupInfo = '简历已被查收，稍后获取联系';
					}else{
						this.isPopup = true;
						this.switch_tips_dialog(true);
						this.popupTitle = res.data.msg;
						this.popupInfo = '为了快速通过面试，请立即';
						this.popupIsShowUrl = true;
						this.popupToUrlInfo = '完善简历';
						this.popupToUrl = '../perfect/index';
					}
				})
				.catch(err => {});
		},
		collect(status){
			let url = '/v1/user/collect';
			if(status == 2){
				url = '/v1/user/cancle-collect'
			}
			
			this.$http
				.get(url, {
					params: {
						token: this.token,
						job_id: this.jobId
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 1) {
						if(status == 1){
							this.isCollect = true;
							this.popupTitle = '收藏成功';
						}else{
							this.isCollect = false;
							this.popupTitle = '取消收藏成功';
						}
						this.isPopup = true;
						this.switch_tips_dialog(true);
						this.popupInfo = '立即查看';
						this.popupInfo2 = '职位';
						this.popupIsShowUrl = true;
						this.popupToUrlInfo = '已收藏';
						this.popupToUrl = '../nav-list/index?page=shoucang';
					}
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="less">
.detail-main {
	width: 100%;
	height: 393rpx;
	position: relative;
	.detail-main-bg{
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		left: 0;
		top: 0;
	}
}
.icon-star {
	width: 37rpx;
	height: 36rpx;
	background-image: url('~@/static/icon-collect.png');
	background-size: 100% 100%;
	&.icon-star-fill {
		background-image: url('~@/static/icon-collect-cur.png');
	}
}
.jobs-body {
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 13rpx 0px rgba(104, 154, 255, 0.35);
	border-radius: 20rpx;
	margin-top: 240rpx;
	padding: 0 20rpx;
}
.detail-require {
	color: rgba(51, 51, 51, 1);
	font-size: 20rpx;
	margin-bottom: 20rpx;
}
.detail-text {
	font-size: 24rpx;
	color: rgba(153, 153, 153, 1);
	line-height: 40rpx;
}
.detail-warn {
	display: flex;
	align-items: center;
	padding: 10rpx 20rpx;
	margin: 20rpx 0;
	border: 1rpx dashed #cccccc;
	image {
		flex: 0 0 32rpx;
		width: 32rpx;
		height: 32rpx;
		margin-right: 27rpx;
	}
	text {
		font-size: 22rpx;
		color: rgba(204, 204, 204, 1);
		line-height: 32rpx;
	}
}
.detail-person{
	display: flex;
	align-items: center;
	image{
		width: 40rpx;
		height: 40rpx;
		margin-right: 12rpx;
	}
	text{
		font-size: 24rpx;
	}
}
.detail-btn{
	position: fixed;
	bottom: 0;
	left: 0;
	width:100%;
	height:98rpx;
	background:linear-gradient(90deg,rgba(107,145,254,1),rgba(88,221,255,1));
	box-shadow:0px 3rpx 7rpx 0px rgba(104, 154, 257, 0.35);
	color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	&.detail-btn-cur{
		background: #CCCCCC;
	}
}
</style>
