<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <div class="activity-list">
        <div
          class="activity-item this-box"
          v-for="(item,index) in dataList"
          :key="index"
          @click="toLink(item.link,`活动页-${item.title}`)"
        >
          <div class="activity-item-image">
            <img :src="item.logo" alt="">
          </div>
          <div class="activity-item-bottom">
            <dl>
              <dt v-text="item.title"></dt>
              <dd v-if="setTime(item.end_time)>0">{{DateDiff(item.end_time)}}天后活动结束</dd>
              <dd v-else>已结束</dd>
            </dl>
            <div class="activity-item-tag" v-if="setTime(item.end_time)>0">进行中</div>
            <div class="activity-item-tag activity-item-grey-tag" v-else>已结束</div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import { XButton, XHeader, Flexbox, FlexboxItem, dateFormat } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XHeader,
    XButton,
    Flexbox,
    FlexboxItem,
    MescrollVue
  },
  data() {
    return {
      dataList: [],
      timeStatus: "",
      mescroll: null,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false
      }
    };
  },
  computed: {
    setTime() {
      return function(endTime) {
        return (this.timeStatus = new Date(endTime) - new Date());
      };
    }
  },
  methods: {
    getData() {
      this.id = this.$route.params.id;
      this.$ajax
        .get("/xd-shop/activity")
        .then(res => {
          let data = res.data.data;
          if (data.length == 0) return;
          // 解决ios不支持2019-01-01写法的问题
          for (let i of data) {
            i.end_time = dateFormat(i.end_time, "YYYY/MM/DD HH:mm:ss");
            i.start_time = dateFormat(i.start_time, "YYYY/MM/DD HH:mm:ss");
          }
          this.dataList = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    DateDiff: function(endDate) {
      let dateStart = new Date();
      let dateEnd = new Date(endDate);
      let difValue = Math.round(
        Math.abs((dateEnd - dateStart) / (1000 * 60 * 60 * 24))
      );
      if (difValue == 0) difValue = 1;
      return difValue;
    },
    toLink(link,category) {
      window.open(link, "_blank");
      this.cnzzTrackEvent(category);
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getData();
    });
  }
};
</script>

<style>
</style>
