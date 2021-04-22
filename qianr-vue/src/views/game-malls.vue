<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <div class="malls-swiper-container">
        <div class="malls-swiper-body">
          <swiper :options="swiperOption" v-if="slides.length>0">
            <swiper-slide v-for="(slide,i) in slides" :key="i">
              <img :src="slide.logo" alt="" @click="toLink(slide.link,`商城页轮播图-${slide.title}`)">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </div>
      <section class="section bb-line">
        <div class="malls-nav-box">
          <ul>
            <router-link
              tag="li"
              :to="{name:'game-malls-category', query:{'id':item.id,'title':item.title}}"
              v-for="(item, index) in navList"
              :key="index"
              @click.native="cnzzTrackEvent(`商城页快捷导航-${item.title}`)"
            >
              <div class="malls-nav-icon">
                <img :src="item.logo" alt="">
              </div>
              <p v-text="item.title"></p>
            </router-link>
          </ul>
        </div>
      </section>
      <section class="section">
        <div class="this-title">
          <i class="icon-title"></i>
          <b>热门商品</b>
        </div>
        <div class="goods-list">
          <ul>
            <router-link
              tag="li"
              :to="{name:'goods-detail', params:{'id':item.id}}"
              v-for="(item, index) in hotGoodsList"
              :key="index"
              class="this-box"
              @click.native="cnzzTrackEvent(`商城页热门商品-${item.title}`)"
            >
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
      // 焦点图
      this.getFocusData();
      this.getNavData();
      this.getHotListData();
    });
  },
  computed: {},
  methods: {
    getFocusData() {
      this.$ajax
        .get("/xd-shop/focus")
        .then(res => {
          this.slides = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNavData() {
      this.$ajax
        .get("/xd-shop/category-list")
        .then(res => {
          this.navList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getHotListData() {
      this.$ajax
        .get("/xd-shop/hot")
        .then(res => {
          this.hotGoodsList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    toLink(link, category) {
      window.location.href = link;
      this.cnzzTrackEvent(category);
    }
  },
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false
      },
      slides: [],
      navList: [],
      hotGoodsList: [],
      swiperOption: {
        loop: false, // 循环
        speed: 500, //切换速度
        mousewheelControl: false, // 禁止鼠标滚轮切换
        lazy: {
          loadPrevNext: true
        },
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false, // 切换到最后一个时不停止
          disableOnInteraction: false //用户操作swiper之后 不停止autoplay
        },
        pagination: {
          el: ".swiper-pagination"
        },
        watchSlidesProgress: true,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      }
    };
  }
};
</script>

<style lang="less" scoped>
.swiper-pagination {
  text-align: right;
  padding: 0 0.28rem;
}
.mescroll {
  overflow-x: hidden;
}
</style>
<style lang="less">
.malls-swiper-body .swiper-pagination-bullet-active {
  background-color: #43e2ca;
}
</style>

