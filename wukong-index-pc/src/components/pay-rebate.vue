<template>
  <section class="pay-rebate">
    <div class="title">
      <span>
        <i></i>
        充值与返利
      </span>
    </div>
    <div class="pay-rebate-main">
      <div class="pay-rebate-arrow pay-rebate-prev"></div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in paramsListArr" :key="index">
            <div class="pay-rebate-img">
              <a href="javascript:;" @click="toPage(item.key)"><img :src="item.logo" alt=""/></a>
            </div>
            <div class="pay-rebate-body">
              <a href="javascript:;" v-text="item.value" @click="toPage(item.key)"></a>
              <p v-text="item.desc"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="pay-rebate-arrow pay-rebate-next"></div>
    </div>
  </section>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
  props: {
    dataList: {
      // default: []
    }
  },
  data() {
    return {
      paramsListArr: []
    };
  },
  computed: {
    ...mapGetters(['getGameHeaderIndex', 'getGameHeaderId'])
  },
  mounted() {
    this.$nextTick(function() {
      this.payRebateSwiper();
      if(this.getGameHeaderId != 0){
        this.getParamsList();
      }
    });
  },
  methods: {
    ...mapMutations(['setGameUnit']),
    toPage(page) {
      this.$router.push('/' + page);
    },
    getParamsList() {
      this.$ajax
        .get('/main/params', {
          params: {
            game_id: this.getGameHeaderId
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.paramsListArr = data.menu;
            this.setGameUnit(data.game_unit);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    payRebateSwiper() {
      new this.Swiper('.pay-rebate-main .swiper-container', {
        slidesPerView: 3,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.pay-rebate-next',
          prevEl: '.pay-rebate-prev'
        }
      });
    }
  }
};
</script>

<style></style>
