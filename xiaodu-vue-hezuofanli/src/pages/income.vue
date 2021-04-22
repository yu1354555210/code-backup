<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">收支明细</x-header>
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div class="content">
                <div class="card-item">
                    <div class="tab vux-1px-b">
                        <div
                            class="tab-item"
                            :class="temp==true?'cur':''"
                            @click="toggleTab(true)"
                        >提现记录</div>
                        <div
                            class="tab-item"
                            :class="temp==false?'cur':''"
                            @click="toggleTab(false)"
                        >
                            收入记录
                            <span>(分成后)</span>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div class="tab-content-item" v-show="temp" id="dataList0">
                            <div class="table">
                                <div class="table-tr table-tr-th">
                                    <div class="table-th">项目</div>
                                    <div class="table-th">金额</div>
                                    <div class="table-th time">时间</div>
                                </div>
                                <div class="table-tr" v-for="item in xdCoopList">
                                    <div class="table-td">分成后收入</div>
                                    <div class="table-td" v-text="item.amount"></div>
                                    <div class="table-td time" v-text="item.payment_time"></div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-content-item" v-show="!temp" id="dataList1">
                            <div class="table">
                                <div class="table-tr table-tr-th">
                                    <div class="table-th">项目</div>
                                    <div class="table-th">金额</div>
                                    <div class="table-th">时间(日)</div>
                                </div>
                                <div class="table-tr" v-for="item in incomeList">
                                    <div class="table-td">分成后收入</div>
                                    <div class="table-td" v-text="item.amount"></div>
                                    <div class="table-td" v-text="item.s_day_format"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </mescroll-vue>
    </div>
</template>

<script>
import { XHeader } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XHeader,
    MescrollVue
  },
  data() {
    return {
      temp: true,
      incomeList: [],
      xdCoopList: [],
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
          warpId: "dataList0", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/images/no-data.png", //图标,默认null,支持网络图
          tip: "暂无数据" //提示
        },
      }
    };
  },
  methods: {
    toggleTab(t) {
      this.temp = t;
      let index;
      t == true ? (index = 0) : (index = 1);
      this.mescroll.resetUpScroll();
      this.mescrollUp.empty.warpId = "dataList" + index;
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      if (this.temp == true) {
        this.$ajax
          .get("/xdcoop/rebate/index", {
            params: {
              page: page.num, // 页码
              "per-page": page.size // 每页长度
            }
          })
          .then(response => {
            if (response.data.code == 403) {
              window.location.href = this.toUrl;
              return;
            }
            var msg = response.data.msg;
            if(msg == "请注册商户"){
                this.$router.push('/');
                return;
            }
            let data = response.data.data.channel.data;
            // 如果是第一页需手动制空列表
            if (page.num === 1) this.xdCoopList = [];
            // 把请求到的数据添加到列表

            this.xdCoopList = this.xdCoopList.concat(data);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          })
          .catch(function(error) {
            // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
          });
      } else {
        this.$ajax
          .get("/xdcoop/income/index", {
            params: {
              page: page.num, // 页码
              "per-page": page.size // 每页长度
            }
          })
          .then(response => {
            let data = response.data.data.channel.data;

            // 如果是第一页需手动制空列表
            if (page.num === 1) this.incomeList = [];
            // 把请求到的数据添加到列表

            this.incomeList = this.incomeList.concat(data);
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
  },
  computed:{
      ...mapGetters(["getLoginStatus"]),
  },
  mounted() {
    this.$nextTick(function() {
      // console.log(this.xdCoopList)
    });
  }
};
</script>

<style lang="stylus" scoped>
/* 通过fixed固定mescroll的高度 */
.mescroll {
    position: absolute;
    top: 0.88rem;
    left: 0;
    bottom: 0;
    height: auto;
}

.tab {
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .tab-item {
        color: #333333;
        font-size: 0.32rem;
        height: 100%;
        display: flex;
        align-items: center;
        padding-top: 0.1rem;
        border-bottom: 0.06rem solid #ffffff;

        &.cur {
            color: #53c6ff;
            border-color: #53c6ff;
        }

        span {
            color: #636363;
            font-size: 0.24rem;
        }
    }
}

.tab-content {
    padding: 0.2rem;
}

.table {
    width: 100%;

    .table-tr {
        display: flex;
        align-items: center;
        height: 1.1rem;
        text-align: center;
        border-bottom: 1px solid #eee;
        font-size: 0.26rem;

        &:last-child {
            border-bottom: none;
        }
    }

    .table-tr-th {
        background-color: #f7f6f6;
        height: 0.5rem;
        border-radius: 5000px;
        color: #636363;
        border-bottom: none;
    }

    .table-th, .table-td {
        flex: 1;
    }

    .table-td {
        color: #333333;
    }

    .time {
        flex: 2;
    }
}
</style>
