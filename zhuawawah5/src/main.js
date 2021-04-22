import Vue from 'vue'
import router from './router'
// import PageTransition from './PageTransition.vue'

import axios from 'axios'
Vue.config.productionTip = false

import vueg from 'vueg'
import 'vueg/css/transition-min.css'
import { ToastPlugin, ConfirmPlugin, AlertPlugin, LoadingPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)

const options = {
	duration: '0.3', //转场动画时长，默认为0.3，单位秒
	firstEntryDisable: false, //值为true时禁用首次进入应用时的渐现动画，默认为false
	firstEntryDuration: '0', //首次进入应用时的渐现动画时长，默认为.6
	forwardAnim: 'fadeInRight', //前进动画，默认为fadeInRight
	backAnim: 'fadeInLeft', //后退动画，默认为fedeInLeft
	sameDepthDisable: false, //url深度相同时禁用动画，默认为false
	tabs: [{
		name: 'home'
	}, {
		name: 'my'
	}], //默认为[]，'name'对应路由的name,以实现类似app中点击tab页面水平转场效果，如tabs[1]到tabs[0]    ，会使用backAnim动画，tabs[1]到tabs[2]，会使用forwardAnim动画
	tabsDisable: false, //值为true时，tabs间的转场没有动画，默认为false
	shadow: true, //值为false，转场时没有阴影的层次效果
	disable: false, //禁用转场动画，默认为false，嵌套路由默认为true
	nuxt: false //若使用后端渲染框架Nuxt，需要将此设为true，默认为false
}

Vue.use(vueg, router, options)

Vue.prototype.$ajax = axios

var app = new Vue({
	router: router,
	//vuet:vuet,
}).$mount('#app')

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.prototype.dateDiff = function(timestamp) {
	var arrTimestamp = (timestamp + '').split('');
	for(var start = 0; start < 13; start++) {
		if(!arrTimestamp[start]) {
			arrTimestamp[start] = '0';
		}
	}
	timestamp = arrTimestamp.join('') * 1;

	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - timestamp;

	// 如果本地时间反而小于变量时间
	if(diffValue < 0) {
		return '不久前';
	}

	// 计算差异时间的量级
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;

	// 数值补0方法
	var zero = function(value) {
		if(value < 10) {
			return '0' + value;
		}
		return value;
	};

	// 使用
	if(monthC > 12) {
		// 超过1年，直接显示年月日
		return(function() {
			var date = new Date(timestamp);
			return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
		})();
	} else if(monthC >= 1) {
		return parseInt(monthC) + "月前";
	} else if(weekC >= 1) {
		return parseInt(weekC) + "周前";
	} else if(dayC >= 1) {
		return parseInt(dayC) + "天前";
	} else if(hourC >= 1) {
		return parseInt(hourC) + "小时前";
	} else if(minC >= 1) {
		return parseInt(minC) + "分钟前";
	}
	return '刚刚';
}

