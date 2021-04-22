import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index.vue'
const Userpage = () =>
	import('../components/userpage.vue')
const Userpage_news = () =>
	import('../components/userpage_news.vue')
const Userpage_user_protocol = () =>
	import('../components/userpage_user_protocol.vue')
const Userpage_user_faq = () =>
	import('../components/userpage_user_faq.vue')
const Userpage_setting = () =>
	import('../components/userpage_setting.vue')
const Userpage_receive_addr = () =>
	import('../components/userpage_receive_addr.vue')
const Userpage_receive_addr_yj = () =>
	import('../components/userpage_receive_addr_yj.vue')
const Userpage_receive_addr_add = () =>
	import('../components/userpage_receive_addr_add.vue')
const Userpage_mywawa = () =>
	import('../components/userpage_mywawa.vue')
const Userpage_mywawa_detail = () =>
	import('../components/userpage_mywawa_detail.vue')
const Userpage_my_incode = () =>
	import('../components/userpage_my_incode.vue')
const Userpage_input_incode = () =>
	import('../components/userpage_input_incode.vue')
const Userpage_game_record = () =>
	import('../components/userpage_game_record.vue')
const Userpage_feedback = () =>
	import('../components/userpage_feedback.vue')
const Userpage_bill_record = () =>
	import('../components/userpage_bill_record.vue')
const Userpage_shop = () =>
	import('../components/userpage_shop.vue')
const Userpage_shop_record = () =>
	import('../components/userpage_shop_record.vue')
const Index_wawa = () =>
	import('../components/index_wawa.vue')
const RoomList = () =>
	import('../components/room_list.vue') //房间列表
const WelfareCode = () =>
	import('../components/welfare_code.vue') //福利码
const Userpage_receive_addr_edit = () =>
	import('../components/userpage_receive_addr_edit.vue') //地址修改
const Userpage_mywawa_deliver_goods = () =>
	import('../components/userpage_mywawa_deliver_goods.vue') //申请发货
const Userpage_mywawa_deliver_goods_detail = () =>
	import('../components/userpage_mywawa_deliver_goods_detail.vue') //申请发货
const User_game_record_detail = () =>
	import('../components/user_game_record_detail.vue') //抓取详情
const Room_signed = () =>
	import('../components/room_signed.vue') //签到
const Index_wawa_detail = () =>
	import('../components/index_wawa_detail.vue') //抓娃娃房间详情
const Category_list = () =>
	import('../components/category_list.vue') //分类房间列表
const Room_play_video = () =>
	import('../components/room_play_video.vue') //视频播放页
const Slide_detail = () =>
	import('../components/slide_detail.vue') //视频播放页
Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			component: Index,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/index_wawa/:rid',
			component: Index_wawa
		},
		{
			path: '/userpage',
			component: Userpage
		},
		{
			path: '/userpage_news',
			component: Userpage_news
		},
		{
			path: '/userpage_user_protocol',
			component: Userpage_user_protocol,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/userpage_user_faq',
			component: Userpage_user_faq,
			meta: {
				keepAlive: true
			}
		},
		{
			path: '/userpage_setting',
			component: Userpage_setting
		},
		{
			path: '/userpage_receive_addr',
			component: Userpage_receive_addr
		},
		{
			path: '/userpage_receive_addr_yj',
			name: 'userpage_receive_addr_yj',
			component: Userpage_receive_addr_yj
		},
		{
			path: '/userpage_receive_addr_add',
			name: 'userpage_receive_addr_add',
			component: Userpage_receive_addr_add
		},
		{
			path: '/userpage_mywawa',
			component: Userpage_mywawa
		},
		{
			path: '/userpage_mywawa_detail',
			name: 'userpage_mywawa_detail',
			component: Userpage_mywawa_detail
		},
		{
			path: '/userpage_my_incode',
			component: Userpage_my_incode
		},
		{
			path: '/userpage_input_incode',
			component: Userpage_input_incode
		},
		{
			path: '/userpage_game_record',
			component: Userpage_game_record
		},
		{
			path: '/userpage_feedback',
			component: Userpage_feedback
		},
		{
			path: '/userpage_bill_record',
			component: Userpage_bill_record
		},
		{
			path: '/userpage_shop',
			component: Userpage_shop
		},
		{
			path: '/userpage_shop_record',
			component: Userpage_shop_record
		},
		{
			path: '/room_list/:listId',
			name: 'room_list',
			component: RoomList
		},
		{
			path: '/welfare_code',
			component: WelfareCode
		},
		{
			path: '/userpage_receive_addr_edit',
			name: 'userpage_receive_addr_edit',
			component: Userpage_receive_addr_edit
		},
		{
			path: '/userpage_mywawa_deliver_goods',
			name: 'userpage_mywawa_deliver_goods',
			component: Userpage_mywawa_deliver_goods,
		},
		{
			path: '/userpage_mywawa_deliver_goods_detail',
			name: 'userpage_mywawa_deliver_goods_detail',
			component: Userpage_mywawa_deliver_goods_detail
		},
		{
			path: '/user_game_record_detail',
			name: 'user_game_record_detail',
			component: User_game_record_detail
		},
		{
			path: '/room_signed',
			name: 'room_signed',
			component: Room_signed
		},
		{
			path: '/index_wawa_detail',
			name: 'index_wawa_detail',
			component: Index_wawa_detail
		},
		{
			path: '/category_list/:listId',
			name: 'category_list',
			component: Category_list
		},
		{
			path: '/room_play_video/',
			name: 'room_play_video',
			component: Room_play_video
		},
		{
			path: '/slide_detail/',
			name: 'slide_detail',
			component: Slide_detail
		},
	]
})