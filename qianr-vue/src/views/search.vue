<template>
  <div class="wrapper">
    <div class="search-container">
      <div class="search-content">
        <form action="javascript:return true" class="search-input">
          <i class="icon-search"></i>
          <i class="icon-clear" @click.stop="onClear" v-show="searchVal!=''"></i>
          <input
            type="search"
            ref="searchInput"
            name=""
            id=""
            placeholder="请输入游戏名"
            v-model.trim="searchVal"
            @focus="onFocus"
            @blur="onBlur"
            @submit="onSubmit(searchVal)"
            @keyup.enter="onSubmit(searchVal)"
          >
        </form>
        <div class="search-cancel" v-show="is_focus" @click="onCancel">取消</div>
      </div>
      <!-- 历史搜索 -->
      <div class="history-list" v-if="isHistory && result_total == null">
        <div class="history-title">
          <h3>历史搜索</h3>
          <i class="icon-delete" @click="emptyHistory"></i>
        </div>
        <div class="history-main">
          <ul>
            <li v-for="item in historyList" v-text="item" @click="onSubmit(item)"></li>
          </ul>
        </div>
      </div>
      <!-- 搜索结果 -->
      <div class="search-result-list">
        <ul class="game-list" v-if="result_total>0">
          <li v-for="item in result_game">
            <router-link
              :to="{name:'game-detail', params:{'id':item.game_id}}"
              class="item-fl"
              tag="div"
            >
              <div class="game-img">
                <img :src="item.logo" alt="">
              </div>
              <div class="game-media">
                <div class="game-name">
                  <h3 v-text="item.title"></h3>
                </div>
                <div class="game-dec" v-text="item.smr"></div>
              </div>
            </router-link>
            <div class="item-fr">
              <button
                class="item-btn"
                @click="playGame(item.play_link,$route.path,item.game_id)"
              >开始游戏</button>
            </div>
          </li>
        </ul>
        <div class="result-no-data" v-if="result_total==0">
          <dl>
            <dt><img src="../assets/img/not-gift.png" alt=""></dt>
            <dd>神马都没找到~</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton, XHeader } from "vux";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      results: [],
      value: "test",
      is_focus: false,
      result_game: [],
      result_total: null,
      searchVal: "",
      historyList: [],
      isHistory: null
    };
  },
  components: {
    XHeader,
    XButton
  },
  computed: {
    ...mapGetters(["getUserInfo", "getDiamond"])
  },
  mounted() {
    this.$nextTick(function() {
      let historyList = localStorage.getItem("historyList");
      if(historyList){
        this.isHistory = true;
        this.historyList = JSON.parse(historyList);
      }else{
        this.isHistory = false;
      }
    });
  },
  methods: {
    onSubmit(searchVal) {
      this.$ajax
        .get("/xiaodu/game/index", {
          params: {
            searchs: searchVal
          }
        })
        .then(response => {
          let data = response.data.data.product;
          this.result_game = data.data;
          this.result_total = data.total;
        })
        .catch(function(error) {});
        this.searchVal = searchVal;
        this.searchHistory(this.searchVal);
    },
    searchHistory(val) {
      //历史记录存储
      if (this.historyList.length > 0) {
        // 有数据的话 判断
        if (this.historyList.indexOf(val) !== -1) {
          // 有相同的，先删除 再添加
          this.historyList.splice(this.historyList.indexOf(val), 1);
          this.historyList.unshift(val);
        } else {
          // 没有相同的 添加
          this.historyList.unshift(val);
        }
      } else {
        // 没有数据 添加
        this.historyList.unshift(val);
      }
      if (this.historyList.length > 10) {
        // 保留六个值
        this.historyList.pop();
      }
      localStorage.setItem("historyList", JSON.stringify(this.historyList));
    },
    emptyHistory(){
      this.historyList = [];
      this.isHistory = false;
      localStorage.removeItem("historyList");
    },
    onFocus() {
      this.is_focus = true;
      this.$refs.searchInput.focus();
    },
    onClear() {
      this.onFocus();
      this.searchVal = "";
    },
    onCancel() {
      this.is_focus = false;
      this.searchVal = "";
      this.isHistory = true;
      this.result_total = null;
    },
    onBlur() {
      this.is_focus = false;
    }
  }
};
</script>

<style scoped>
.game-list{
  padding: 0;
}
</style>
