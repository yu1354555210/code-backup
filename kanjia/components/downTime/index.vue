<template>
	<!-- 倒计时组件 -->
	<view class="downTime-wrapper">
		<!-- 这里是显示还未结束时的内容，这里只是我这得布局，你可以随意。 -->
		<view class="time" v-show="!isShow">
			<!-- <text class="hour">{{myDay}}</text> : -->
			<text class="hour">{{myHours}}</text> :
			<text class="minute">{{myMinutes}}</text> :
			<text class="second">{{mySeconds}}</text>
		</view>
		<!-- 这里是显示结束后的内容 -->
		<text class="second" v-show="isShow">{{clocker}}</text>
	</view>
</template>

<script>
	export default {
		name: 'downTime',

		props: { // 接收父组件传递过来的参数,这里传了  结束时间 - 开始时间 - 结束后显示的内容
			endTime: {
				type: Number
			},
			startTime: {
				type: Number
			},
			endMsg: {
				type: String
			}
		},

		data() {
			return {
				timer: null,
				isShow: false, // 控制显示结束或还未结束显示的内容
				clocker: '', // 结束后显示的内容
				timeObj: null, // 时间对象,下方会用到
				myDay: 0, // 我定义来接收计算出来的 天 的
				myHours: 0, // 我定义来接收计算出来的 小时 的
				myMinutes: 0, // 我定义来接收计算出来的 分钟 的
				mySeconds: 0 // 我定义来接收计算出来的 秒钟 的
			}
		},
		
		beforeDestroy() {
			if(this.timer) {
		　　　　clearInterval(this.timer); //关闭
		　　 }
		},

		mounted() {
			// 计算时间差
			this.timeLag = (this.endTime - this.startTime) / 1000
			// 判断当前是否时分秒的值是否大于10
			let add = num => {
				return num < 10 ? '0' + num : num
			}
			// 时间倒计时运算的方法
			let timeFunction = () => {
				let time = this.timeLag--
				this.timeObj = { // 时间对象
					seconds: Math.floor(time % 60),
					minutes: Math.floor(time / 60) % 60,
					hours: Math.floor(time / 60 / 60) % 24,
					days: Math.floor(time / 60 / 60 / 24)
				}
				// 计算出时分秒
				this.myDay = `${add(this.timeObj.days)}`
				this.myHours = `${add(this.timeObj.hours)}`
				this.myMinutes = `${add(this.timeObj.minutes)}`
				this.mySeconds = `${add(this.timeObj.seconds)}`
				// 当时间差小于等于0时,停止倒计时
				if (time <= 0) {
					this.isShow = true
					this.clocker = this.endMsg || '砍价结束'
					clearInterval(this.timer)
					this.$parent.outTimeEnd();
				}
			}
			// 开始执行倒计时
			timeFunction()
			// 每一秒执行一次
			this.timer = setInterval(() => {
				timeFunction()
			}, 1000)
		}
	}
</script>

<style lang="less" scoped>
	.downTime-wrapper {
		font-size: 30rpx;
	}
</style>
