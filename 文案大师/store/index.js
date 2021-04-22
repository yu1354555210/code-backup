import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try{
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
}catch(e){
	
}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token', 'vuex_is_login'];

// 保存变量到本地存储中
const saveLifeData = function(key, value){
	// 判断变量名是否在需要存储的数组中
	if(saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	// 下面这些值仅为示例，使用过程中请删除
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_is_login: lifeData.vuex_is_login ? lifeData.vuex_is_login : false,
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {name: ''},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '', //测试token   DD4AC9F4FDAE0131A75E80EA932AE000
		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_version: 'v 1.0.0',
		isLoginUrl: '',
		vuex_tabbar: [{  //tabbar配置
			iconPath: "/static/ic_tab_main.png",
			selectedIconPath: "/static/ic_tab_main_selected.png",
			text: '文案',
			pagePath: "/pages/index/index",
		},
		{
			iconPath: "/static/ic_tab_category.png",
			selectedIconPath: "/static/ic_tab_category_selected.png",
			text: '大师榜',
			pagePath: "/pages/category/category"
		},
		{
			iconPath: "/static/ic_tab_add.png",
			selectedIconPath: "/static/ic_tab_add.png",
			midButton: true,
			pagePath: "/pages/add/add"
		},
		{
			iconPath: "/static/ic_tab_search.png",
			selectedIconPath: "/static/ic_tab_search_selected.png",
			text: '搜索',
			pagePath: "/pages/search/search"
		},
		{
			iconPath: "/static/ic_tab_mine.png",
			selectedIconPath: "/static/ic_tab_mine_selected.png",
			text: '我的',
			pagePath: "/pages/mine/mine"
		},
	]
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if(nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for(let i = 1; i < len - 1; i ++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
		setTabbarRefresh(state, value){
			state.vuex_tabbar[0].selectedIconPath = value; 
		}
	}
})

export default store