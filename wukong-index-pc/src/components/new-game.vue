<template>
  <section class="new-game">
    <div class="title">
      <span>
        <i></i>
        新游预约
      </span>
    </div>
    <div class="new-game-main">
      <div class="new-game-arrow new-game-prev"></div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in newGameListArr" :key="index">
            <div class="new-game-img">
              <img :src="item.logo" alt="" />
              <a :href="item.link" target="_blank" class="new-game-btn">预约</a>
            </div>
          </div>
        </div>
      </div>
      <div class="new-game-arrow new-game-next"></div>
    </div>
  </section>
</template>

<script>
export default {
  props:{
    dataList: {
      // default: []
    }
  },
  data() {
    return {
      newGameListArr: []
    }
  },
  mounted() {
    this.$nextTick(function(){
      this.newGameSwiper();
      this.getNewGameList();
    });
  },
  methods:{
    getNewGameList() {
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 7
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.newGameListArr = data;
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    newGameSwiper() {
      new this.Swiper('.new-game .swiper-container', {
        slidesPerView: 3.5,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.new-game-next',
          prevEl: '.new-game-prev'
        }
      });
    }
  }
};
</script>

<style></style>
