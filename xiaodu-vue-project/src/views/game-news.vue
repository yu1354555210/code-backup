<template>
<div class="wrapper">
	<scroller :on-infinite="infinite" :on-onrefresh="infinite" :ref="scrollBox">
	<!-- 选项卡 -->
	<div class="news-tabs" v-model="index">
		<div class="tab-item" :class="index==i?'active':''" v-for="(m, i) in menu" @click="moveTab(i)" :key="i">
			 {{m}}
		</div>
	</div>
	<div class="swiper-item" v-for="(page, k, i) in pages" v-show=" index == i " :key="i">
		<ul class="game-list game-news-list">
			<li v-for="article in page.article_list" @click="con_page(article.id)" :key="article.id">
			<div class="item-fl">
				<div class="game-img">
					<img :src="article.logo" alt="">
				</div>
				<div class="game-media">
					<div class="game-name">
						<h3>{{article.title}}</h3>
					</div>
					<div class="game-dec">
						{{article.dt}}
					</div>
				</div>
			</div>
			</li>
		</ul>
	</div>
	</scroller>
</div>
</template>
<script>
import { XButton, XHeader, Tab, TabItem } from "vux";
export default {
  components: {
    XButton,
    XHeader,
    Tab,
    TabItem
  },
  mounted() {
    this.initPage();
  },
  data() {
    return {
      menu: [],
      pages: [],
      page_name: "",
      index: 0,
      scrollBox: "gg",
      glPage: 1,
      hdPage: 1,
      ggPage: 1,
      done: ""
    };
  },
  methods: {
    moveTab(index) {
      this.index = index;
      //如果有提示红点,点击过后红点消失
      if (index == 0) {
        this.scrollBox = "gl";
      }
      if (index == 1) {
        this.scrollBox = "hd";
      }
      if (index == 2) {
        this.scrollBox = "gg";
      }
      // 传this.done解决报错
      this.infinite(this.done);
    },
    con_page(_id) {
      this.$router.push({
        name: "article",
        params: {
          id: _id
        }
      });
    },
    infinite(done) {
      this.done = done;
      if (this.scrollBox == "gg") {
        this.ggPage++;
        this.$ajax
          .get("/xd-api/article-list", {
            params: {
              type_id: 6,
              page: this.ggPage
            }
          })
          .then(response => {
            let _d = response.data.data;
            if (_d.length != 0) {
              this.pages.gg.article_list = this.pages.gg.article_list.concat(
                _d
              );
              done();
            } else {
              done(true);
            }
          });
      }
      if (this.scrollBox == "gl") {
        this.glPage++;
        this.$ajax
          .get("/xd-api/article-list", {
            params: {
              type_id: 8,
              page: this.glPage
            }
          })
          .then(response => {
            let _d = response.data.data;
            if (_d.length != 0) {
              this.pages.gl.article_list = this.pages.gl.article_list.concat(
                _d
              );
              done();
            } else {
              done(true);
            }
          });
      }
      if (this.scrollBox == "hd") {
        this.hdPage++;
        this.$ajax
          .get("/xd-api/article-list", {
            params: {
              type_id: 7,
              page: this.hdPage
            }
          })
          .then(response => {
            let _d = response.data.data;
            if (_d.length != 0) {
              this.pages.hd.article_list = this.pages.hd.article_list.concat(
                _d
              );
              done();
            } else {
              done(true);
            }
          });
      }
    },
    initPage() {
      this.$ajax
        .get("/xd-api/article-list", {
          params: {
            type_id: 0,
            page: 1
          }
        })
        .then(response => {
          let _d = response.data;
          if (_d.status !== 1) return;
          this.pages = _d.data.data;
          this.menu = _d.data.menu;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.game-list {
  padding: 0.35rem 0.25rem;
  .item-fl {
    .game-img {
      img {
        border-radius: 0;
      }
    }
  }
}
</style>