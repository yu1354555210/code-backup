<template>
  <div class="wrapper">
     <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <x-header :left-options="{backText: ''}">邀请记录</x-header>
      <div class="content">
        <div class="invite-record-list card-item" id="dataList">
          <ul>
            <li v-for="(item,index) in dataList" :key="index">
              <div class="invite-record-fl">
                <div class="invite-record-avatar">
                  <img :src="item.head_pic" alt="">
                </div>
                <div>
                  <div class="invite-record-title" v-text="item.player_id"></div>
                  <div class="invite-record-other">{{item.register_date}} 加入</div>
                </div>
              </div>
              <div class="invite-record-fr">
                已贡献<span class="minus" v-text="item.amount"></span>元
              </div>
            </li>
          </ul>
        </div>
      </div>
     </mescroll-vue>
  </div>
</template>

<script>
import { XButton, XHeader, XInput } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  mounted() {
    this.$nextTick(function(){
    })
  },
  components: {
    XButton,
    XHeader,
    XInput,
    MescrollVue
  },
  data() {
    return {
      dataList: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 20 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部数据 --</p>',
        noMoreSize: 10, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        isBounce: false,
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "dataList", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "https://h5.qianr.com/xd_static/img/not-gift.png", //图标,默认null,支持网络图
          tip: "暂无数据" //提示
        },
      }
    };
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
        this.$ajax
          .get("/xdcoop/invit/index", {
            params: {
              page: page.num, // 页码
              "per-page": page.size // 每页长度
            }
          })
          .then(response => {
            let data = response.data.data.player.data;
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
  background url(../assets/images/record-bg.png) no-repeat center 0.88rem;
  background-size 7.5rem 3.41rem
  background-color #fff
.content
  margin .25rem
  >>>.mescroll-empty
    padding 50% 0
.invite-record-list
  box-shadow:2px 2px 13px rgba(194,194,194,.6);
  li
    padding .38rem 0
    margin 0 .25rem
    justify-content space-between
    align-items center
    display flex
    border-bottom 0.04rem solid #fbfbfd
    &:last-child
      border-bottom none
    .invite-record-fl
      display flex
      align-items center
      .invite-record-avatar
        width .68rem
        height .68rem
        border-radius 50%
        margin-right .1rem
      .invite-record-title
        font-size .28rem
        color #5a5a66
      .invite-record-other
        color #b2b2b2
        font-size .21rem
    .invite-record-fr
      color #505050
      font-size .28rem
      .minus
        color #fe2a2f
      .add
        color #07ae1a
</style>
