<template>
    <div class="wrapper">
      <x-header :left-options="{backText: ''}">分类列表</x-header>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <section class="section">
          <div class="this-title">
              <i class="icon-title"></i>
              <b v-text="title"></b>
              <div class="category-sort" @click="showDataList" :class="showData?'selected':''">
                <span class="select-value">{{selectedValue}}</span>
                <i class="icon-sort-arrow"></i>
                <div class="select-list" v-if="showData">
                  <div class="select-item" v-if="item.name!=selectedValue" v-for="item in selectList" @click.stop="select(item)">{{item.name}}</div>
                </div>
              </div>
          </div>
          <div class="goods-list">
            <ul>
              <router-link tag="li" :to="{name:'goods-detail', params:{'id':item.id}}" v-for="(item, index) in categoryList" :key="index" class="this-box">
                <div class="time-sale" v-if="item.origin_do != 0"></div>
                <div class="goods-image">
                  <img :src="item.logo" alt="">
                </div>
                <div class="goods-info">
                  <div class="goods-name" v-text="item.title"></div>
                  <div class="goods-money">
                    <i class="icon-gold"></i>
                    <span v-text="item.current_do"></span>
                    <s v-if="item.origin_do != 0" v-text="item.origin_do"></s>
                  </div>
                </div>
              </router-link>
            </ul>
          </div>
          <div class="mask" v-if="showData" @click.self="showData=false"></div>
        </section>
        </mescroll-vue>
    </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { mapState, mapGetters } from "vuex";
import { XButton, XHeader } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    swiper,
    swiperSlide,
    XButton,
    XHeader,
    MescrollVue
  },
  mounted() {
    this.$nextTick(function() {
      this.id = this.$route.query.id;
      this.title = this.$route.query.title;
    });
  },
  computed: {},
  methods: {
    showDataList() {
      this.showData = !this.showData;
    },
    select(item) {
      this.selectedValue = item.name;
      this.showData = false;
      this.descId = item.id;
      this.categoryList = [];
      this.mescroll.resetUpScroll();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // 联网请求
      this.$ajax
        .get("/xd-shop/goods-by-category", {
          params: {
            cat_id: this.id,
            desc: this.descId,
            page: page.num, // 页码
            limit: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data.data;
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.categoryList = [];
          // 把请求到的数据添加到列表

          this.categoryList = this.categoryList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    }
  },
  data() {
    return {
      mescroll: null,
      mescrollDown: {},
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 20 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 已加载全部 --</p>',
        noMoreSize: 5 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
      },
      categoryList: [],
      descId: 1,
      showData: false,
      selectedValue: "最新",
      id: undefined,
      title: "",
      selectList: [
        {
          id: 1,
          name: "最新"
        },
        {
          id: 2,
          name: "价格由低到高"
        },
        {
          id: 3,
          name: "价格由高到低"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.mescroll {
  position: absolute;
  top: 0.88rem;
  bottom: 0;
  height: auto;
}
.section{
  overflow: hidden;
}
</style>

