<template>
  <div>
    <section class="service-section">
      <layout-login></layout-login>
      <div class="service-main this-section">
        <div class="service-online">
          <div class="this-title online-title">
            在线<span>服务</span>
          </div>
          <ul>
            <li class="online">
              <a href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed" target="_blank">
                <dl>
                  <dt>在线客服</dt>
                  <dd>
                    <p>工作时间：周一~周六</p>
                    <p>9:00~18:00</p>
                  </dd>
                </dl>
              </a>
            </li>
            <li class="wechat">
              <dl>
                <dt>官方公众号</dt>
                <dd>
                  <p>悟空藏宝阁</p>
                  <p>7x24小时在线</p>
                </dd>
              </dl>
              <div class="wechat-qrcode">
                <img src="../assets/img/qrcode.jpg" alt="">
              </div>
            </li>
            <li class="self">
              <a href="javascript:;" @click="$vux.toast.text('暂未开通')">
                <dl>
                  <dt>自助服务</dt>
                  <dd><p>常见问题自助处理</p></dd>
                </dl>
              </a>
            </li>
          </ul>
        </div>
        <div class="service-account">
          <div class="this-title account-title">
            账号<span>相关</span>
          </div>
          <ul>
          	<li>
              <router-link to="/change-pwd" title="修改密码">
                <img src="../assets/img/user-item1.png" alt="">
              </router-link>
            </li>
          	<li>
              <router-link to="/change-real-name" title="更改实名信息">
                <img src="../assets/img/user-item2.png" alt="">
              </router-link>
            </li>
          	<li>
              <router-link to="/change-mobile" title="更改绑定手机">
                <img src="../assets/img/user-item3.png" alt="">
              </router-link>
            </li>
          	<li>
              <router-link to="/login-history" title="查看账号登录历史">
                <img src="../assets/img/user-item4.png" alt="">
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import layoutLogin from '@/components/layout-login.vue';
export default {
  data() {
    return {
      single: true //checkbox值
    };
  },
  components:{
    layoutLogin
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getGameUnit', 'getToken'])
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    ...mapMutations(['removeLogin', 'removeUserInfo', 'removeGameUnit', 'setGameUnit']),
    check(e) {
      this.single = e.target.checked;
    }
  }
};
</script>

<style lang="stylus" scoped>
.service-section{
  padding-top: 40px;
}
.wechat-qrcode
  img
    width 80%
</style>
