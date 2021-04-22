<template>
  <div class="wrapper">
    <no-data></no-data>
  </div>
</template>
<script type="text/javascript">
import { mapMutations, mapState, mapGetters } from 'vuex';
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
  }
};
</script>
<style lang="stylus">

</style>
