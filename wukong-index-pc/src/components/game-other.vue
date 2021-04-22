<template>
  <section class="game-other">
    <div class="title">
      <span>
        <i></i>
        游戏周边
      </span>
      <a href="javascript:;" @click="$vux.toast.text('暂未开放')">更多>></a>
    </div>
    <div class="game-other-main">
      <ul>
        <li v-for="(item,index) in gameOtherListArr" :key="index" @click="toDetail(item)">
          <a href="javascript:;" class="game-other-img"><img :src="item.logo" alt="" /></a>
          <p>
            <a href="javascript:;">
              <span>{{item.goods_name}}</span>
              <b>¥{{item.price / 100}}</b>
            </a>
          </p>
        </li>
      </ul>
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
      gameOtherListArr: []
    }
  },
  mounted() {
    this.$nextTick(function(){
      this.getGameOtherList();
    });
  },
  methods:{
    getGameOtherList() {
      this.$ajax
        .get('/shop/goods')
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.gameOtherListArr = data;
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toDetail(item){
      this.$router.push({
        path: '/game-around-detail',
        query: {
          data: JSON.stringify(item)
        }
      })
    }
  }
};
</script>

<style></style>
