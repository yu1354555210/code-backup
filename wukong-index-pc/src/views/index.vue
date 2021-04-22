<template>
  <div>
    <v-top-swiper></v-top-swiper>

    <section class="recommend-section section">
      <div class="content">
        <div class="this-title recommend-title">
          推荐<span>游戏</span>
          <a href="javascript:void(0);">
            MORE
            <i></i>
          </a>
        </div>
      </div>
      <div class="recommend-list">
        <ul>
          <li v-for="(item,index) in reverseRecommendArr" :key="index">
            <div class="num">0{{item.sort}}.</div>
            <div class="recommend-img"><img :src="item.logo" /></div>
            <div class="recommend-body">
              <div class="recommend-body-before">
                <div class="recommend-name" v-text="item.title"></div>
                <div class="recommend-dec" v-text="item.summary"></div>
                <div class="recommend-plat">
                  <span :class="[plat.indexOf('Android') != -1 ? 'android' : 'ios']" v-for="(plat, i) in item.device.split(',')" :key="i"><i></i></span>
                </div>
              </div>
              <div class="recommend-body-after">
                <div class="recommend-qrcode"><img :src="item.thumb" /></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="section news-section">
      <div class="content">
        <div class="this-title news-title">
          新闻<span>公告</span>
          <a href="javascript:void(0);">
            MORE
            <i></i>
          </a>
        </div>
      </div>
      <div class="news-list">
        <div class="news-main">
          <div :class="index == 0 ? 'news-left' : 'news-right'" v-for="(item,index) in newsArr" :key="index">
            <div class="news-img">
              <a :href="item.link"><img :src="item.logo" /></a>
            </div>
            <div class="news-body">
              <a :href="item.link" v-text="item.title">
                <!-- <span>《云中歌》</span>
                online -->

              </a>
              <p v-text="item.summary"></p>
              <div class="time"></div>
            </div>
          </div>
          <div class="news-center">
            <img src="../assets/img/news-center.png" />
            <a href="javascript:void(0);"></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section activity-section">
      <div class="content">
        <div class="this-title activity-title">
          热门<span>活动</span>
        </div>
      </div>
      <div class="activity-list">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in activityArr" :key="index">
              <a href="javascript:void(0);"><img :src="item.logo" /></a>
            </div>
          </div>
        </div>
        <div class="prev arrow"></div>
        <div class="next arrow"></div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {
      userInfo: [],
      menuList: [],
      recommendStatus: false,
      recommendArr: [],
      activityArr: [],
      newsArr: []
    };
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken']),
    reverseRecommendArr() {
      return Array.prototype.reverse.call(this.recommendArr);
    }
  },
  components:{
  },
  mounted() {
    this.$nextTick(function() {
      this.UnitParams();
      this.getRecommendData();
      this.getActivityData();
      this.getNewsData();
      this.activitySwiper();
    });
  },
  methods: {
    ...mapMutations(['removeLogin', 'removeUserInfo', 'removeGameUnit', 'setGameUnit']),
    // checkToken(){
    //   this.$ajax
    //     .get("/user/exits",{
    //       params: {
    //         token: this.getToken
    //       }
    //     })
    //     .then(res => {
    //        if(res.data.code == 0){
    //          setTimeout(() => {
    //            this.outLogin();
    //          }, 1000);
    //          this.$vux.toast.text('token过期,请重新登录');
    //        }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    getRecommendData(){
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 2,
          }
        })
        .then(res => {
          let data = res.data.data;
          this.recommendArr = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getActivityData(){
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 3,
          }
        })
        .then(res => {
          let data = res.data.data;
          this.activityArr = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNewsData(){
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 5,
          }
        })
        .then(res => {
          let data = res.data.data;
          this.newsArr = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    activitySwiper() {
      new this.Swiper('.activity-list .swiper-container', {
        slidesPerView: 2,
        navigation: {
          nextEl: '.next',
          prevEl: '.prev'
        }
      });
    },
    UnitParams() {
      this.$ajax
        .get('/main/params', {
          params: {
            game_id: this.game_id
          }
        })
        .then(res => {
          let data = res.data.data;
          this.menuList = data.menu;
          this.setGameUnit(data.game_unit);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="stylus">
.pagination
  display flex
  align-items center
</style>
