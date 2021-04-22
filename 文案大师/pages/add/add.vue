<template>
	<view class="content">
		<view class="textarea">
			<u-input
				@input="descInput"
				v-model="value"
				:clearable="false"
				:type="type"
				placeholder="和我们分享最戳你的那段文案"
				:height="height"
				:auto-height="autoHeight"
				maxlength="180"
				:fixed="true"
			/>
		</view>
		<view class="bottom">
			<view class="select-box">
				<text>发表到:</text>
				<view class="select" @click="show = true" v-if="!isResult">选择标签</view>
				<view class="select-tags" v-else @click="show = true"><view class="tags" v-for="(item, index) in result" :key="index" v-text="item"></view></view>
			</view>
			<view class="total-num">
				<text v-text="remnant"></text>
				/180
			</view>
		</view>
		<view class="tips">发送后,审核完成自动发表</view>
		<view class="send-btn"><u-button type="default" class="btn" size="medium" shape="circle" :ripple="true" :custom-style="customStyle" @click="send">发送</u-button></view>

		<u-popup v-model="show" mode="bottom" border-radius="14">
			<view class="top-line"></view>
			<view class="popup-title">选择分类</view>
			<view class="check-group-box">
				<u-checkbox-group @change="checkboxGroupChange" class="check-group" active-color="#00a6ac" max="3">
					<u-checkbox
						@change="checkboxChange"
						v-model="item.checked"
						class="checkbox"
						v-for="(item, index) in catList"
						:key="index"
						:checkId="item.id"
						:name="item.name"
						active-color="#00a6ac"
					>
						{{ item.name }}
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<u-button type="default" size="medium" shape="circle" :ripple="true" class="btn" :custom-style="customStyle" @click="ok">确定</u-button>
		</u-popup>

		<u-tabbar :list="vuex_tabbar" :mid-button="true" :border-top="false" active-color="#00A6AC" inactive-color="#c4c4c4"></u-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isResult: false,
			value: '',
			type: 'textarea',
			height: 550,
			autoHeight: true,
			remnant: 0,
			customStyle: {
				color: 'white',
				backgroundColor: '#00a6ac',
				width: '300rpx',
				marginBottom: '50rpx'
			},
			show: false,
			result: [],
			list: [],
			catList: [],
			catIdList: []
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.getCatData();
		});
	},
	onLoad() {},
	methods: {
		// 选中某个复选框时，由checkbox时触发
		checkboxChange(e) {},
		// 选中任一checkbox时，由checkbox-group触发
		checkboxGroupChange(e, id) {
			this.result = e;
			this.catIdList = id;
		},
		descInput(e) {
			this.remnant = e.length;
		},
		ok() {
			if (this.result.length > 0) {
				this.isResult = true;
			} else {
				this.isResult = false;
			}
			this.show = false;
		},
		getCatData() {
			let sign = this.md5Libs.md5(`${this.signKey}`);
			this.$u
				.get('/api/master/v1/cat_fact', {
					token: this.vuex_token,
					sign: sign
				})
				.then(res => {
					this.catList = res;
					this.catList.map(val => {
						this.$set(val, 'checked', false);
					});
				})
				.catch(err => {
					console.log(err);
				});
		},
		send() {
			if (this.value == '') {
				uni.showToast({
					title: '请输入文案内容',
					icon: 'none'
				});
				return false;
			} else if (this.value.length < 6) {
				uni.showToast({
					title: '文案长度过短哦',
					icon: 'none'
				});
				return false;
			} else if (this.catIdList.length === 0) {
				uni.showToast({
					title: '请选择分类',
					icon: 'none'
				});
				return false;
			} else {
				this.$u
					.post('/api/master/v1/upload_copy', {
						token: this.vuex_token,
						text: this.$u.trim(this.value), //去掉首尾的空格
						cat_id: this.catIdList.join(',')
					})
					.then(res => {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						});

						setTimeout(() => {
							uni.switchTab({
								url: '../index/index'
							});
						}, 800);
					})
					.catch(err => {
						console.log('err: ', err);
						uni.showToast({
							title: err.msg,
							icon: 'none'
						});
					});
			}
		}
	}
};
</script>

<style lang="stylus">
page
	background-color #FFFFFF
.content
	padding 30rpx
	.textarea
		.u-input__textarea
			font-size 32rpx
			color #99A3A4
	.bottom
		display flex
		justify-content space-between
		align-items center
		margin-top 20rpx
		.select-box
			display flex
			align-items center
			.select
				width 132rpx
				height 32rpx
				background-size contain
				background-repeat no-repeat
				color #FFFFFF
				font-size 24rpx
				display flex
				align-items center
				justify-content center
				padding-left 10rpx
				margin-left 24rpx
		.total-num
			font-size 24rpx
			color #99A3A4
	.send-btn
		display flex
		justify-content center
		padding 50rpx 0
	.top-line
		width 88rpx
		height 10rpx
		background #D6D6D6
		border-radius 5rpx
		margin 40rpx auto 60rpx
	.popup-title
		text-align center
		font-size 34rpx
		font-weight bold
		color #313331
	.check-group-box
		padding 60rpx 0 0 100rpx
		.check-group
			.u-checkbox-group
				display flex
				justify-content space-between
				text-align center
				flex-wrap wrap
			.checkbox
				flex 0 0 33%
				margin-bottom 50rpx
.tips
	margin-top 20rpx
	font-size 20rpx
	color #99A3A4
	text-align right
.select-tags
	display flex
	align-items center
.tags
	width 84rpx
	height 32rpx
	background-size 100% 100%
	display flex
	justify-content center
	align-items center
	color #FFFFFF
	font-size 24rpx
	padding-left 20rpx
	margin-left 24rpx
.btn
	display flex
	justify-content center
</style>
<style lang="scss">
.select {
	background-image: $tags-add-base64-code;
}
.tags {
	background-image: $tags-base64-code;
}
</style>
