<template>
  <div class="wrapper">
    <!-- <div class="game-header"><game-header @headerEvent="getHeaderIndex"></game-header></div> -->
    <div class="game-around-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/props-city' }">藏宝阁</el-breadcrumb-item>
          <el-breadcrumb-item v-text="detailData.title"></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="game-around-box">
        <div class="game-around-img"><img :src="detailData.logo" alt="" /></div>
        <div class="game-around-info">
          <div class="game-around-info-top">
            <h2 v-text="detailData.title"></h2>
            <p>
              <span>道具介绍</span>
              {{detailData.summary}}
            </p>
            <p>
              <b>{{detailData.price | saleAmount}}</b>
              <s>¥{{detailData.original_price | saleAmount}}</s>
            </p>
            <p>
              <el-tag type="danger">下单返利</el-tag>
              购买可得
              <i>{{detailData.price * 10 | saleAmount}}</i>
              成长值
            </p>
            <p>
              <span>角色信息</span>
              {{detailData.goods_name}}
            </p>
          </div>
          <div class="game-around-info-bottom">
            <p>
              <span>数量</span>
              <el-input-number v-model="num" @change="handleChange" :min="1" size="small" label="数量"></el-input-number>
              (库存{{detailData.sku}})
            </p>
            <a href="javascript:;" class="btn red-btn" @click="toDetail">立即购买</a>
          </div>
        </div>
      </div>
    </div>

    <div class="game-around-bottom">
      <new-game></new-game>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapMutations, mapState, mapGetters } from 'vuex';
import newGame from '@/components/new-game.vue';

export default {
  data() {
    return {
      num: 1,
      propsHeaderIndex: 0,
      detailData: []
    };
  },
  mounted() {
    this.$nextTick(function() {
      if(this.$route.query){
        let data = this.$route.query.data;
        if(typeof data == 'string'){
          data = JSON.parse(data);
        }
        this.detailData = data;
      }
    });
  },
  filters: {
    saleAmount(value) {
      return value / 100;
    }
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getToken', 'getGameUnit','getGameHeaderIndex'])
  },
  components: {
    newGame
  },
  methods: {
    unit(index = this.getGameHeaderIndex){
      this.propsHeaderIndex = index;
    },
    getHeaderIndex(data) {
      this.unit(data.index);
    },
    toDetail(){
      this.$router.push({
        path: '/game-around-pay',
        query: {
          data: JSON.stringify(this.detailData),
          num: this.num
        }
      })
    },
    handleChange(value) {
      // console.log(value);
    },
    check(e) {
      this.single = e.target.checked;
    }
  }
};
</script>
<style lang="stylus" scoped>

</style>
