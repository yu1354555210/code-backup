<template>
	<view class="serach">
		<view class="content" :style="{'border-radius':radius+'px'}">
			<!-- HM修改 增加进入输入状态的点击范围 -->
			<view class="content-box" :class="{'center':mode === 2}">
				<image src="../../static/icon-search.png" class="icon-search" mode="aspectFill"></image>
				<!-- HM修改 增加placeholder input confirm-type confirm-->
				<input  :placeholder="placeholder" @input="inputChange" confirm-type="search" @confirm="triggerConfirm" class="input" :class="{'center':!active && mode === 2}" :focus="isFocus" v-model="inputVal" @focus="focus" @blur="blur"/>
				<!-- HM修改 @click换成@click.stop阻止冒泡 -->
				<image v-if="isDelShow" @click.stop="clear" src="../../static/icon-close.png"  class="icon-del" mode="aspectFill"></image>
			</view>
			<view class="cancel-btn" @click="goBack">
				取消
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		mode: {
			value: Number,
			default: 1
		},
		//HM修改 定义默认搜索关键词(水印文字)
		placeholder:{
			value: String,
			default: '请输入搜索内容'
		},
		value: {
			type: String,
			default:''
		},
		button: {
			value: String,
			default: 'outside'
		},
		show: {
			value: Boolean,
			default: true
		},
		radius: {
			value: String,
			default: 60
		}
	},
	data() {
		return {
			active: false,
			inputVal: '',
			searchName: '取消',
			isDelShow: false,
			isFocus: false
		};
	},
	methods: {
		//HM修改 触发组件confirm事件
		triggerConfirm(){
			this.$emit('confirm', false);
		},
		//HM修改 触发组件input事件
		inputChange(event){
			var keyword = event.detail.value;
			this.$emit('input', keyword);
			if (keyword) {
				this.isDelShow = true;
			}
		},
		focus() {
			this.active = true;
			//HM修改 增加获取焦点判断
			if (this.inputVal) {
				this.isDelShow = true;
			}
		},
		blur() {
			this.isFocus = false;
			if (!this.inputVal) {
				this.active = false;
			}
		},
		clear() {
			//HM修改 收起键盘
			uni.hideKeyboard();
			this.isFocus = false;
			this.inputVal = '';
			this.active = false;
			//HM修改 清空内容时候触发组件input
			this.$emit('input', '');
			this.$emit('removeEmpty');
			//this.$emit('search', '');//HM修改 清空内容时候不进行搜索
		},
		getFocus() {
			this.isFocus = true;
		},
		search() {
			//HM修改 增加点击取消时候退出输入状态，内容为空时，输入默认关键字
			if (!this.inputVal) {
				if(!this.show&&this.searchName == '取消'){
					uni.hideKeyboard();
					this.isFocus = false;
					this.active = false;
					return;
				}
			}
			console.log(this.inputVal); 
			this.$emit('search', this.inputVal?this.inputVal:this.placeholder);
		},
		goBack() {
			uni.navigateBack();
		},
	},
	watch: {
		//HM修改 双向绑定
		value(val) {
			this.inputVal = val;
		},
	}
};
</script>

<style lang="scss">
.serach {
	width: 100%;
	padding: 15rpx 17rpx;
	display: flex;
	justify-content: space-between;
	.content {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.content-box {
			width: 640rpx;
			position: relative;
			&.center {
				justify-content: center;
			}
			.icon-search{
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				left: 30rpx;
				top: 50%;
				transform: translateY(-50%);
			}
			.icon-del{
				width: 38rpx;
				height: 38rpx;
				position: absolute;
				right: 10rpx;
				top: 50%;
				transform: translateY(-50%);
			}
			.input {
				width: 100%;
				height: 60rpx;
				background-color: #f1f1f1;
				font-size: 30rpx;
				border: 0;
				border-radius: 60rpx;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				padding: 0 3%;
				margin: 0;
				text-indent: 60rpx;
			}
		}
		.serachBtn {
			height: 100%;
			flex-shrink: 0;
			padding: 0 30upx;
			//HM修改 按钮背景色
			background:linear-gradient(to right,#ff9801,#ff570a);
			//background: $uni-color-success;
			line-height: 60upx;
			color: #fff;
			//border-left: 1px #ccc solid; //HM修改 去掉边框
			transition: all 0.3s;
		}
	}
	
	.cancel-btn{
		margin: 0 0 0 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		font-size: 30rpx;
		color: #333;
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		flex-shrink: 0;
		width: 0;
		transition: all 0.2s linear;
		white-space: nowrap;
		overflow: hidden;
		&.active {
			padding-left: 15upx;
			width: 100upx;
		}
	}
}
//HM修改 把字体改成本地加载
@font-face {font-family:"iconfont";src:url('data:application/x-font-woff;charset=utf-8;base64,AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzI8fEg3AAABfAAAAFZjbWFws6gbWQAAAeQAAAGcZ2x5ZqgAaogAAAOMAAABMGhlYWQTyEk0AAAA4AAAADZoaGVhB90DhQAAALwAAAAkaG10eBAA//8AAAHUAAAAEGxvY2EA0gBOAAADgAAAAAptYXhwARIANgAAARgAAAAgbmFtZT5U/n0AAAS8AAACbXBvc3SanfjSAAAHLAAAAEUAAQAAA4D/gABcBAD//wAABAAAAQAAAAAAAAAAAAAAAAAAAAQAAQAAAAEAAL8Cm/NfDzz1AAsEAAAAAADYVQKbAAAAANhVApv///+ABAADgQAAAAgAAgAAAAAAAAABAAAABAAqAAQAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQQAAZAABQAIAokCzAAAAI8CiQLMAAAB6wAyAQgAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5gbmRAOA/4AAXAOBAIAAAAABAAAAAAAABAAAAAQA//8EAAAABAAAAAAAAAUAAAADAAAALAAAAAQAAAFoAAEAAAAAAGIAAwABAAAALAADAAoAAAFoAAQANgAAAAgACAACAADmBuYc5kT//wAA5gbmHOZE//8AAAAAAAAAAQAIAAgACAAAAAIAAQADAAABBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAA0AAAAAAAAAAMAAOYGAADmBgAAAAIAAOYcAADmHAAAAAEAAOZEAADmRAAAAAMAAAAAADoATgCYAAAAAv///4AEAAOAABMAHwAABQYiLwEGJCcmAjc2JBcWEgcXFhQBJiAHBhQXFiA3NjQD7RQyFMaG/sl9hw2BiQFqjXgTZccT/sBo/spoPz9oATZoPm0TE8dhDG6FAW2OhwaGfv6+h8YUMgLThoZV0FWGhlnMAAABAAD/gAMAA4EABQAACQE1CQE1AQACAP6IAXgBgP4AiAF4AXiIAAAABAAA//4DlAMnABAAIQAlACkAAAUuAzQ+AjIWFxYQBw4BAyIOAhQeAjI2NzYQJy4BFwEnAQU3AQcCAFKScz09c5Kkkjp2djqSUkiBZjU1ZoGQgTNoaDOBfP6YIAFo/qQgAVwgAgE9cpOjknM9PTl8/r18OT0C9zVmgZCBZTU1Mm4BHW0zNb/+mCABZysf/qQgAAAAAAAAEgDeAAEAAAAAAAAAFQAAAAEAAAAAAAEACAAVAAEAAAAAAAIABwAdAAEAAAAAAAMACAAkAAEAAAAAAAQACAAsAAEAAAAAAAUACwA0AAEAAAAAAAYACAA/AAEAAAAAAAoAKwBHAAEAAAAAAAsAEwByAAMAAQQJAAAAKgCFAAMAAQQJAAEAEACvAAMAAQQJAAIADgC/AAMAAQQJAAMAEADNAAMAAQQJAAQAEADdAAMAAQQJAAUAFgDtAAMAAQQJAAYAEAEDAAMAAQQJAAoAVgETAAMAAQQJAAsAJgFpCkNyZWF0ZWQgYnkgaWNvbmZvbnQKaWNvbmZvbnRSZWd1bGFyaWNvbmZvbnRpY29uZm9udFZlcnNpb24gMS4waWNvbmZvbnRHZW5lcmF0ZWQgYnkgc3ZnMnR0ZiBmcm9tIEZvbnRlbGxvIHByb2plY3QuaHR0cDovL2ZvbnRlbGxvLmNvbQAKAEMAcgBlAGEAdABlAGQAIABiAHkAIABpAGMAbwBuAGYAbwBuAHQACgBpAGMAbwBuAGYAbwBuAHQAUgBlAGcAdQBsAGEAcgBpAGMAbwBuAGYAbwBuAHQAaQBjAG8AbgBmAG8AbgB0AFYAZQByAHMAaQBvAG4AIAAxAC4AMABpAGMAbwBuAGYAbwBuAHQARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgBoAHQAdABwADoALwAvAGYAbwBuAHQAZQBsAGwAbwAuAGMAbwBtAAAAAAIAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAECAQMBBAEFAAZzb3VzdW8IamlhbnRvdTQHc2hhbmNodQAAAAAA');}


.icon {
	font-family: iconfont;
	font-size: 32upx;
	font-style: normal;
	color: #999;
	
}
</style>
