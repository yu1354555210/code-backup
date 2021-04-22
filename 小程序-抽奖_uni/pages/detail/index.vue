<template>
<view>
<!-- <block v-if="appid != ''">
  <navigator target="miniProgram" open-type="navigate" :app-id="appid" :path="path" :extra-data="extra" version="release" hover-class="none">
    <view class="fixed-top" v-if="isFloatShow">
      <view class="fixed-fl">
        <view class="fixed-image">
          <image :src="icon"></image>
        </view>
        <view class="fixed-name">{{game_title}}</view>
      </view>
      <view class="fixed-fr">
        <button class="begin-btn">开始玩</button>
      </view>
    </view>
  </navigator>
</block>
<block v-else>
  <view class="fixed-top" v-if="isFloatShow" @tap="previewImage">
    <view class="fixed-fl">
      <view class="fixed-image">
        <image :src="icon"></image>
      </view>
      <view class="fixed-name">{{game_title}}</view>
    </view>
    <view class="fixed-fr">
      <button class="begin-btn">开始玩</button>
    </view>
  </view>
</block>
 -->


<view class="content">
  <view class="title">{{title}}</view>
  <view class="other">{{ctime}}</view>
  <rich-text :nodes="html"></rich-text>
</view>
</view>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      text: "",
      author: "",
      ctime: "",
      isFooter: false,
      wx_qrcode: [],
      game_title: "",
      icon: "",
      isFloatShow: true,
      appid: "",
      path: "",
      extra: "",
      source_type: "",
	  html: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    uni.showLoading({
      title: '加载中',
      mask: true
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
	uni.request({
		url: getApp().globalData.apiUrl + 'api/pstrategy/api',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
		},
		data: {
			token: uni.getStorageSync('token'),
			api_name: 'strategy_detail',
			strategy_id: options.id
		},
		success: res => {
			let data = res.data.data;
			this.html = data.content;
			this.title = data.title;
			this.ctime = data.create_time;
		},
		fail: res => {
			uni.showToast({
				title: res.data.msg
			});
		},
		complete: () => {}
	});
  //   wx.request({
  //     url: detailAPI + options.url,
  //     header: {
  //       'content-type': 'application/json' // 默认值

  //     },
  //     success: function (res) {
  //       let data = res.data;
  //       console.log(data);
  //       that.setData({
  //         title: decodeURIComponent(data.title),
  //         //decodeURIComponent用来防止转发乱码
  //         source_type: decodeURIComponent(data.source_type),
  //         ctime: decodeURIComponent(data.create_time),
  //         wx_qrcode: data.wx_qrcode || "",
  //         game_title: decodeURIComponent(data.game_title) || "",
  //         icon: decodeURIComponent(data.icon) || "",
  //         appid: data.wx_appid,
  //         path: data.wx_path,
  //         extra: data.wx_extra,
		//   html: data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:20rpx auto" ').replace(/<p/ig, '<p class="p_class"')
  //       });
		// console.log(that.html)
		

  //       if (that.game_title == "" || that.game_title == "undefined") {
  //         that.setData({
  //           isFloatShow: false
  //         });
  //       }
  //     }
  //   });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("来自页面内转发按钮");
    }

    return {
      title: this.title,
      // path: '/pages/detail/detail',
      success: function (res) {// console.log("转发成功")
        // 转发成功
      },
      fail: function (res) {
        console.log("转发失败"); // 转发失败
      }
    };
  },
  methods: {
    previewImage: function (e) {
      wx.previewImage({
        urls: this.wx_qrcode
      });
    },
    setData: function (obj) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val);
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {});
            }
          }

          data = data[key2];
        });
      });
    }
  }
};
</script>
<style>
@import "./detail.css";
</style>