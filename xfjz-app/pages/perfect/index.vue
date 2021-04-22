<template>
	<view>
		<!-- <view class="status-bar"></view> -->
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="right"><view class="action" @click="postData">提交简历</view></block>
		</cu-custom>
		<view class="main">
			<view class="this-title this-title-big"><text class="title-info">填写完善简历</text></view>
			<view class="text-grey text-sm">先介绍一下自己吧~</view>
			<view class="perfect-main solid-top margin-top margin-bottom">
				<view class="perfect-info">
					<image :src="avatarUrl || '../../static/update-avatar.png'" mode="aspectFill" @click="ChooseImage()"></image>
					<text class="text-df text-bold">上传头像</text>
					<text class="text-xs text-grey">真实照片可增加面试几率</text>
				</view>
			</view>
			<view class="mine-list">
				<view class="solid-bottom mine-item">
					<view class="mine-item-left">
						<image src="../../static/icon-name.png" mode="aspectFill"></image>
						<text>姓名</text>
					</view>
					<input type="text" v-model="name" placeholder-class="placeholder-color" placeholder="请填写真实姓名" />
				</view>
				<view class="solid-bottom mine-item arrow">
					<view class="mine-item-left">
						<image src="../../static/icon-shengri.png" mode="aspectFill"></image>
						<text>生日</text>
					</view>
					<view class="text-gray text-sm">
						<picker mode="date" :value="date" start="1970-01-01" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{ date }}</view>
						</picker>
					</view>
				</view>
				<view class="solid-bottom mine-item arrow">
					<view class="mine-item-left">
						<image src="../../static/icon-sex.png" mode="aspectFill"></image>
						<text>性别</text>
					</view>
					<view class="text-gray text-sm">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
					</view>
				</view>
				<view class="solid-bottom mine-item">
					<view class="mine-item-left">
						<image src="../../static/icon-mobile.png" mode="aspectFill"></image>
						<text>电话</text>
					</view>
					<input type="number" maxlength="11" v-model="tel" placeholder="填写接受面试邀请电话" placeholder-class="placeholder-color" />
				</view>
				<view class="solid-bottom mine-item">
					<view class="mine-item-left">
						<image src="../../static/icon-tags.png" mode="aspectFill"></image>
						<text>个人标签</text>
					</view>
					<input type="text" v-model="tag" placeholder="请填写一句简介" placeholder-class="placeholder-color" />
				</view>
			</view>
			<view class="mine-textarea">
				<view class="this-title this-title-mine"><text class="title-info">个人简历</text></view>
				<view class="mine-add" @click="isShowTextArea = true" v-if="!isShowTextArea"><image src="../../static/icon-add.png" mode="aspectFill"></image></view>
				<textarea v-model="areaVal" placeholder="请输入个人简历" v-if="isShowTextArea" />
			</view>
		</view>
		<view v-if="tipsPopup">
			<popup title="提交成功"><text>简历已被查收，稍后获取联系</text></popup>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import popup from '../../components/popup.vue';
import { pathToBase64, base64ToPath } from '../../js_sdk/gsq-image-tools/image-tools/index.js';
export default {
	data() {
		return {
			isShowPopup: true,
			isShowTextArea: false,
			date: '19900101',
			index: 0,
			name: '',
			areaVal: '',
			tel: '',
			tag: '',
			array: ['男', '女']
		};
	},
	computed: {
		...mapState(['tipsPopup']),
		...mapGetters(['token', 'avatarUrl','mobile','tags']),
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.switch_tips_dialog(false);
			this.getData();
		});
	},
	components: {
		popup
	},
	methods: {
		...mapMutations(['switch_tips_dialog', 'updataAvatar','setMobile','setTag','setNickname']),
		ChooseImage() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					const tempFilePaths = res.tempFilePaths;
					const uploadTask = uni.uploadFile({
						url: 'http://ubase.qianr.com/api/public/?service=user.updateAvatar',
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							token: this.token
							// 'file': tempFilePaths
						},
						header: {
							'content-type': 'multipart/form-data'
						},
						success: uploadFileRes => {
							let data = uploadFileRes.data;
							data = JSON.parse(data);
							// this.updateAvatar(data.data.avatar_thumb);
							this.$store.commit('updateAvatar', data.data.avatar_thumb);
						},
						fail: err => {
							console.log(err);
						},
						complete: () => {}
					});
				}
			});
		},
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
		},
		bindDateChange: function(e) {
			this.date = e.target.value.replace(/-/gi, '');
			console.log('picker发送选择改变，携带值为', this.date);
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		getData() {
			uni.showLoading();
			this.$http
				.get('/v1/user/resume-view', {
					params: {
						token: this.token
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 1) {
						let data = res.data.data;
						let arr = Object.keys(data);
						if (arr.length > 0) {
							this.date = data.birth;
							this.name = data.real_name;
							this.index = +data.sex - 1;
							this.areaVal = data.summary;
							if (this.areaVal != '') {
								this.isShowTextArea = true;
							}
							this.tel = data.mobile;
							this.tag = data.tag;
							this.setNickname(data.real_name);
							this.setMobile(data.mobile);
							this.setTag(data.tag);
						}
					}
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				})
				.catch(err => {
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				});
		},
		postData() {
			if (this.name == '' || this.tel == '' || this.tag == '' || this.areaVal == '') {
				uni.showToast({
					icon: 'none',
					title: '请填写完整信息'
				});
				return false;
			}
			let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			if (!myreg.test(this.tel)) {
				uni.showToast({
					icon: 'none',
					title: '手机号格式不正确'
				});
				return false;
			}
			uni.showLoading({
				title: '提交中'
			});
			this.$http
				.post('/v1/user/resume', {
					token: this.token,
					real_name: this.name,
					birth: this.date,
					sex: +this.index + 1,
					mobile: this.tel,
					tag: this.tag,
					summary: this.areaVal
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 0) {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
						return false;
					}
					if (res.data.code == 1) {
						this.switch_tips_dialog(true);
						this.setNickname(this.name);
						this.setMobile(this.tel);
						this.setTag(this.tag);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
							this.switch_tips_dialog(false);
						}, 1000);
					}
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				})
				.catch(err => {
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				});
		}
	}
};
</script>

<style lang="less">
.perfect-info {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 30rpx 0;
	image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}
	text {
		margin-top: 10rpx;
	}
}
.mine-textarea {
	margin: 30rpx 0;
	box-shadow: 0px 0px 13rpx 0px rgba(104, 154, 255, 0.35);
	border-radius: 20rpx;
	padding: 0 30rpx;
	overflow: hidden;
	.this-title-mine {
		justify-content: flex-start;
	}
	.mine-add {
		display: flex;
		justify-content: center;
		padding: 30rpx 0;
		image {
			width: 88rpx;
			height: 88rpx;
		}
	}
}
</style>
