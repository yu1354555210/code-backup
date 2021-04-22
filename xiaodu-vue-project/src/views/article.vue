<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">资讯内容</x-header>
        <div class="detail-top">
            <div class="detail-bg article-bg">
                <div class="detail-game-classify" v-text="articel_data.game_type"></div>
            </div>
            <div class="game-detail-box article-game-detail">
                <div class="game-detail-title" v-text="articel_data.title"></div>
                <div class="game-detail-time"><span v-text="articel_data.time"></span></div>
                <div class="game-detail-img"><img alt="" :src="articel_data.game_icon"></div>
                <div class="game-detail-name" v-text="articel_data.game_title"></div>
                <div class="game-detail-person">{{articel_data.play_times}}人玩过</div>
                <div class="game-detail-btn"  @click="playGame(articel_data.play_link,$route.path,articel_data.game_id)">进入游戏</div>
            </div>
        </div>
        <div class="detail-content">
            <div class="content" v-html="articel_data.content" v-if="articel_data.content != ''">
            </div>
            <section class="section">
                <div class="this-title">
                    <i class="icon-title"></i>
                    <b>相关资讯</b>
                </div>
                <div class="related-news">
                    <ul>
                        <li v-for="item in about_list" @click="toDetail(item.id)" :key=item.id>
                            <div class="related-news-fl">
                                <badge :text="item.type_name"></badge>
                                <p v-text="item.title"></p>
                            </div>
                            <div class="related-news-fr" v-text="item.time"></div>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { mapState } from 'vuex';
import { XButton, XHeader, Badge } from "vux";
import giftPopup from "@/components/v-gift-popup.vue";
export default {
  components: {
    XButton,
    XHeader,
    giftPopup,
    Badge
  },
  created() {
      this.fetchDate();
  },
  watch: {
    "$route": "fetchDate"
  },
  computed: {
    ...mapState(['loginPopup'])
  },
  mounted() {
  	this.id = this.$route.params.id;
  },
  methods: {
    toDetail(_id) {
      this.$router.push({ name: "article", params: { id: _id } });
    },
    fetchDate() {
      this.id = this.$route.params.id;
      if (this.id == undefined) return;
      this.$ajax
        .get("/xd-api/article-content", {
          params: { id: this.id }
        })
        .then(response => {
          let _d = response.data;
          if (_d.status !== 1) return;
          this.articel_data = _d.data.article_data;
          this.about_list = _d.data.about_list;
        });
    }
  },
  data() {
    return {
      id: undefined,
      articel_data: {
        id: "",
        title: "",
        play_link: "",
        game_title: "",
        content: ""
      },
      about_list: [],
      swiperOption: {
        observeParents: true,
        spaceBetween: 15,
        slidesPerView: "auto"
      },
      swiperSlides: 5,
      giftDec: "",
      giftCode: ""
    };
  }
};
</script>

<style>
</style>
