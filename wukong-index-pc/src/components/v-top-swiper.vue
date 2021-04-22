<template>
  <div class="focus-wrapper">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in dataList" :key="index">
          <a :href="item.link"><img :src="item.logo" /></a>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="pagination"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:{
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.$nextTick(function(){
      this.getFocusData();
      this.focusSwiper();
    });
  },
  methods:{
    focusSwiper() {
      new this.Swiper('.focus-wrapper .swiper-container', {
        observer: true,
        observeParents: true,
        // 如果需要分页器
        pagination: {
          el: '.pagination',
          clickable: true
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      });
    },
    getFocusData(){
      this.$ajax
        .get('/banner/index', {
          params: {
            is_pc: 1,
            type: 1,
          }
        })
        .then(res => {
          let data = res.data.data;
          this.dataList = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>

<style></style>
