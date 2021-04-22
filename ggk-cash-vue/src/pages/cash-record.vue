<template>
    <div class="wrapper">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <x-header :left-options="{backText: ''}">提现记录</x-header>
        <ul class="cash-record-list" id="dataList">
          <li v-for="(item,i) in dataList" :key="i">
            <div class="cash-record-info">提现<span class="color-red">
              {{item.card_num / 100}}</span>元</div>
            <div class="cash-record-status" v-if="item.status == 0" v-text="item.status_title"></div>
            <div class="cash-record-status color-green" v-else-if="item.status == 1" v-text="item.status_title"></div>
            <div class="cash-record-status color-red" v-else="item.status == 1" v-text="item.status_title"></div>
            <div class="cash-record-time" v-text="item.ctime"></div>
          </li>
        </ul>
      </mescroll-vue>
    </div>
</template>

<script>

import { XButton, XHeader } from "vux";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XButton,
    XHeader,
    MescrollVue
  },
  mounted() {
    this.$nextTick(function(){
      this.token = localStorage.getItem('token');
      // this.token = '56c49032b38d8a0a3f3f90d5ed3c0dc3';
    })
  },
  data() {
    return {
      token: '',
      dataList: '',
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部数据 --</p>',
        noMoreSize: 10, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        isBounce: false,
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "dataList", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/images/no-data.png", //图标,默认null,支持网络图
          tip: "你还没有提现过，快去赚钱吧", //提示
          btntext : "去赚钱" ,
          btnClick: function() {
            //点击按钮的回调,默认null
            window.location.href = "../ggk/ggk-list.html";
          }.bind(this)
        },
      }
    };
  },
  computed:{
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
        let params = {
          token:  this.token,
          api_name: 'get_user_cash_out_record',
          page: page.num,
          package_name: localStorage.getItem('package_name')
        }
        this.$ajax({
            method: "post",
            url: "/api/hcashout/api",
            data: this.$qs.stringify(params)
          })
          .then(response => {
            let data = response.data.data;
            // 如果是第一页需手动制空列表
            if (page.num === 1) this.dataList = [];
            // 把请求到的数据添加到列表
            // this.dataList = []
            this.dataList = this.dataList.concat(data);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          })
          .catch(function(error) {
            // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
          });
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper
  >>>.mescroll-empty
    padding 50% 0
.cash-record-list
  padding  .25rem
  li
    display flex
    justify-content space-between
    align-items center
    background-color #f6f6f6
    height .84rem
    font-size .28rem
    color #333333
    padding 0 .25rem
    border-radius .08rem
    margin-bottom .25rem
    .color-red
      color #ff3927
    .color-grey
      color #b0b0b0
    .color-green
      color green
    .cash-record-info
      flex 1
    .cash-record-time
      flex 1
      text-align right 
</style>
