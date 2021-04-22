<template>
  <div class="wrapper">
    <div class="pay-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/props-city' }">藏宝阁</el-breadcrumb-item>
          <el-breadcrumb-item>领取累计充值返利</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="pay-body" style="display: none;">
        <div class="pay-user-panel">
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                您的领取账号
              </span>
            </div>
            <!-- <input type="text" readonly name="" id="" :value="getUserInfo" /> -->
            <div class="pay-user-info">
              <input type="text" readonly name="" id="" v-model="getUserInfo.username" class="input" />
              <span>累计充值金额：{{ money / 100 }} 元</span>
            </div>
          </div>
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                领取礼包码：
              </span>
            </div>
            <!-- <input type="text" readonly name="" id="" :value="getUserInfo" /> -->
            <div class="pay-user-info">
              <div class="number-list rebate-list">
                <ul>
                  <li
                    :class="[{ 'yes-draw': item.is_yes == 1 && item.is_got == 0 }, { 'no-draw': item.is_got != 0 }]"
                    v-for="(item, index) in giftList"
                    :key="index"
                    @click="drawGift(item)"
                  >
                    <p v-text="item.title"></p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <no-data></no-data>
    </div>
    <v-popup v-if="popupToggle">
      <div class="gift-popup">
        <h2 v-text="giftPopup.title"></h2>
        <div class="cdk">
          <span>兑换码:</span>
          <p v-text="code"></p>
        </div>
        <div class="dec" v-text="giftPopup.summary"></div>
        <div class="btn copy-btn" :data-clipboard-text="code">复制</div>
      </div>
    </v-popup>
  </div>
</template>
<script type="text/javascript">
import { mapMutations, mapState, mapGetters } from 'vuex';
import vPopup from '../components/v-popup.vue';
import noData from '../components/nodata.vue';
export default {
  data() {
    return {
      giftList: [],
      money: '',
      giftPopup: [],
      code: ''
    };
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getToken']),
    ...mapState(['popupToggle'])
  },
  components: {
    vPopup,
    noData
  },
  mounted() {
    this.$nextTick(function() {
      this.getData();
    });
  },
  methods: {
    ...mapMutations(['switch_dialog']),
    getData() {
      this.$ajax
        .get('/gift/list', {
          params: {
            game_id: this.game_id,
            token: this.getToken
          }
        })
        .then(response => {
          if (response.data.code == -1) {
            setTimeout(() => {
              this.outLogin();
            }, 1000);
            this.$vux.toast.text('token过期,请重新登录');
          }
          let data = response.data.data;
          this.giftList = data.gifts;
          this.money = data.money;
          for (let s of data.gifts) {
            if (parseInt(this.money) >= parseInt(s.min_amount)) {
              this.$set(s, 'is_yes', 1);
            } else {
              this.$set(s, 'is_yes', 0);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    drawGift(item) {
      this.$ajax
        .get('/gift/code', {
          params: {
            game_id: this.game_id,
            token: this.getToken,
            gift_id: item.id
          }
        })
        .then(response => {
          let data = response.data.data;
          if (response.data.code == 1) {
            this.giftPopup = item;
            this.code = data.code;
            this.switch_dialog(true);
            this.getData();
          } else {
            if (response.data.code == -1) {
              setTimeout(() => {
                this.outLogin();
              }, 1000);
              this.$vux.toast.text('token过期,请重新登录');
            } else {
              this.$vux.toast.text(response.data.msg);
            }
          }
        })
        .catch(error => {
          this.$vux.toast.text('系统错误，请稍后重试');
        });
    }
  }
};
</script>
<style lang="stylus">

</style>
