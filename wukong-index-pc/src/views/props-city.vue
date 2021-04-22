<template>
  <div>
    <v-top-swiper><game-header @headerEvent="getHeaderIndex"></game-header></v-top-swiper>
    <section class="props-main">
      <div class="props-activity">
        <div class="title">
          <span>
            <i></i>
            精彩活动
          </span>
        </div>
        <ul>
          <li v-for="(item, index) in activityListArr" :key="index">
            <div class="props-activity-img">
              <a :href="item.link" target="_blank"><img :src="item.logo" alt="" /></a>
            </div>
            <div class="props-activity-title">
              <a :href="item.link" v-text="item.title" target="_blank"></a>
              <p v-text="item.summary"></p>
            </div>
            <div class="props-activity-bottom"><a :href="item.link" target="_blank">进入活动</a></div>
          </li>
        </ul>
      </div>
      <div class="props-recommend">
        <div class="title">
          <span>
            <i></i>
            热门推荐
          </span>
        </div>
        <ul>
          <li v-for="(item,index) in recommendListArr" :key="index">
            <a href="javascript:;" @click="toGift(item)">
              <div class="props-recommend-img"><img :src="item.logo" alt="" /></div>
              <div class="props-recommend-body">
                <p v-text="item.rebate_title"></p>
                <p v-text="item.rebate_summary"></p>
              </div>
              <span class="props-recommend-arrow"></span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <router-view></router-view>

    <new-game v-show="isShowNewGame"></new-game>

    <pay-rebate ref="payRebate" v-show="isShowPayRebate && getLoginStatus"></pay-rebate>

    <game-other v-show="isShowOtherBar"></game-other>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import newGame from '@/components/new-game.vue';
import gameOther from '@/components/game-other.vue';
import payRebate from '@/components/pay-rebate.vue';
export default {
  data() {
    return {
      isShowNewGame: true,
      isShowOtherBar: false,
      isShowPayRebate: false,
      activityListArr: [],
      recommendListArr: []
    };
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken','getGameHeaderIndex','getGameHeaderId'])
  },
  mounted() {
    this.$nextTick(function() {
      this.unit();
    });
  },
  components: {
    newGame,
    gameOther,
    payRebate
  },
  methods: {
    ...mapMutations(['removeLogin', 'removeUserInfo', 'removeGameUnit', 'setGameUnit','changeGameHeader']),
    unit(index = this.getGameHeaderIndex){
      this.setShowBar(index);
      this.getActivityList();
      this.getRecommendList();
    },
    getHeaderIndex(data) {
      this.unit(data.index);
      if(this.getGameHeaderId != 0){
        this.$refs['payRebate'].getParamsList();
      }
    },
    getActivityList(){
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 6,
          }
        })
        .then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            this.activityListArr = data;
          }else{
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRecommendList(){
      this.$ajax
        .get('/product/recommend', {
          params: {
            game_id: this.getGameHeaderId,
          }
        })
        .then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            this.recommendListArr = data;
          }else{
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setShowBar(index){
      if (index == 0) {
        this.isShowNewGame = true;
        this.isShowOtherBar = this.isShowPayRebate = false;
      } else {
        this.isShowNewGame = false;
        this.isShowOtherBar = this.isShowPayRebate = true;
      }
    },
    toGift(item){
      this.$router.push({
        path: 'pay-gift',
        query: {
          giftId: item.product_id
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
