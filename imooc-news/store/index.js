import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		historyLists: uni.getStorageSync("__history") || []
	},
	mutations: {
		SET_HISTORY_LIST(state, history) {
			state.historyLists = history
		},
		CLEAR_HISTORY(state) {
			state.historyLists = []
		}
	},
	actions: {
		set_history({
			commit,
			state
		}, history) {
			let list = state.historyLists
			let findIndex;
			let result = list.find((item,index) => {
				findIndex = index;
				return item.name == history.name
			})
			if (!result) {
				list.unshift(history)
			} else {
				list.splice(findIndex, 1);
				list.unshift(history)
			}
			uni.setStorageSync('__history', list)
			commit('SET_HISTORY_LIST', list)
		},
		clearHistory({
			commit
		}) {
			uni.removeStorageSync('__history')
			commit('CLEAR_HISTORY')
		}
	}
})

export default store
