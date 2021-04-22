<template>
  <div class="wrapper">
    <!-- <div class="game-header"><game-header></game-header></div> -->
    <div class="pay-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/props-city' }">藏宝阁</el-breadcrumb-item>
          <el-breadcrumb-item>充值妖晶</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="pay-body">
        <div class="pay-user-panel">
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                您的充值账号
              </span>
            </div>
            <!-- <input type="text" readonly name="" id="" :value="getUserInfo" /> -->
            <div class="pay-user-info"><input type="text" readonly name="" id="" v-model="getUserInfo.username" class="input" /></div>
          </div>
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                充值账号昵称
              </span>
            </div>
            <div class="pay-user-info">
              <div class="pay-user-select">
                <el-select v-model="model1" placeholder="请选择">
                  <el-option v-for="item in pickerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>{{ getGameUnit }}：{{ gold }}</span>
              </div>
            </div>
          </div>
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                {{ getGameUnit }}数量：
              </span>
            </div>
            <!-- <input type="text" readonly name="" id="" :value="getUserInfo" /> -->
            <div class="pay-user-info">
              <div class="number-list">
                <ul>
                  <li :class="index == i ? 'cur' : ''" v-for="(item, i) in dataList" :key="i" @click="selectTab(i, item)">
                    <p v-text="item.rebate_title"></p>
                    <span>
                      <em>{{ item.amount | saleAmount }}</em>
                      元
                    </span>
                  </li>
                  <!-- <li class="last-item" :class="index == -1 ? 'cur' : ''" @click="selectLastItem">
                    <p>其他数量</p>
                    <input type="tel" name="" value="" ref="numInput" placeholder="数量" v-model.number.trim="customInput" @input="amountInput" @blur="inputLoseFocus" />
                  </li> -->
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="total-box">
          <div class="agreement">
            <label>
              <el-checkbox v-model="single">
                我已认真阅读
                <router-link to="/pay-agreement">《悟空游戏充值服务协议》</router-link>
              </el-checkbox>
            </label>
          </div>
          <div class="total-right">
            <div class="pay-price">
              应付款
              <span>{{ this.amount }}元</span>
            </div>
            <a href="javascript:void(0);" class="btn" @click="pay" v-points>立即充值</a>
          </div>
        </div>

        <div class="pay-other-game"><game-other></game-other></div>
      </div>
    </div>

    <el-dialog title="微信扫码付款" :visible.sync="dialogFormVisible" width="20%" top="20vh" center @close="closeWXpay">
      <h4>订单总额: {{ this.amount }}元</h4>
      <img :src="qrcode" />
      <el-row type="flex" class="row-bg" justify="center"><el-button type="text" @click="refreshWechatCode" icon="el-icon-refresh">点击刷新二维码</el-button></el-row>
      <!-- <div class="wechat-box">
        <el-button type="success" plain round @click="handleFinished">支付完成</el-button>
        <el-button type="info" plain round @click="repeatPay">重新支付</el-button>
      </div> -->
    </el-dialog>

    <el-dialog title="支付成功" :visible.sync="dialogPayStatus" class="dialog-success" width="20%" top="30vh" center :show-close="false">
      <p>支付成功请前往游戏内邮件领取~</p>
      <p>
        <el-link
          target="_blank"
          type="primary"
          href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed"
        >
          遇到问题？
        </el-link>
      </p>
      <el-row type="flex" class="row-bg" justify="center"><el-button type="primary" @click="dialogPayStatus = false">知道了</el-button></el-row>
    </el-dialog>

    <!-- 提交成功提示框 -->
    <div class="this-winpop-container" v-if="isShowTipsPopup" @click.self="isShowTipsPopup = false">
      <div class="this-winpop-wrapper">
        <dl>
          <dt>阿萨大大大</dt>
          <dd>
            <p>购买完成后，获得妖晶x30，高级聚灵卷x2</p>
            <p>
              价值：
              <span>6.00元</span>
            </p>
          </dd>
        </dl>
        <a href="javascript:void(0);" class="form-btn" @click="isShowTipsPopup = false">知道了</a>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapMutations, mapState, mapGetters } from 'vuex';
import gameOther from '@/components/game-other.vue';
export default {
  data() {
    return {
      dialogPayStatus: false,
      dialogFormVisible: false,
      qrcode: null,
      pay_url: '',
      timer: null,
      isShowTipsPopup: false,
      dataList: [],
      propsHeaderIndex: 0,
      index: 0,
      amount: 0,
      customInput: '',
      gold: 0,
      server_id: null,
      role_id: null,
      userList: [],
      pickerList: [], //下拉选框值
      model1: '',
      single: true, //checkbox值
      product_name: '',
      product_id: null,
      server_name: '',
      role_name: '',
      maxNum: 6480 //自定义最大输入值
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getListData();
      this.getUserData();
    });
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getToken', 'getGameUnit'])
  },
  filters: {
    saleAmount(value) {
      return value / 100;
    }
  },
  components: {
    gameOther
  },
  methods: {
    back() {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/' });
        return false;
      } else {
        this.$router.go(-1);
      }
      //上面都没执行就说明卡在当前页不是最后一条， histroy记录数量大于1，又没有回退记录，只能返回首页，
      //如果上面都执行了 页面都跳走了，这个也就不用管了
      setTimeout(() => {
        this.$router.push({ path: '/' });
      }, 500);
    },
    selectTab(i, item) {
      this.index = i;
      var te = this.$options.filters['saleAmount'];
      this.amount = te(item.amount);
      this.product_name = item.rebate_title;
      this.product_id = item.product_id;
    },
    selectLastItem() {
      this.index = -1;
      this.amount = 0;
      this.$refs.numInput.focus();
    },
    amountInput(e) {
      var te = this.$options.filters['saleAmount'];
      this.customInput = e.target.value.replace(/[^\d]/g, '');
      if (this.customInput > this.maxNum) {
        this.customInput = this.maxNum;
        this.$vux.toast.text('最大数量不能超过' + this.maxNum);
      }
      this.amount = this.customInput / 10 || 0;
    },
    onChange(value) {
      this.gold = value;
      if (this.userList.length != 0) {
        let data = this.userList.roles.filter(function(item) {
          return item.gold == value;
        });
        if (data.length != 0) {
          this.role_id = data[0].role_id;
          this.server_id = data[0].server_id;
          this.server_name = data[0].server_name;
          this.role_name = data[0].role_name;
        }
      }
    },
    getUserData() {
      this.$ajax
        .get('/role/info', {
          params: {
            game_id: this.game_id,
            uid: this.getUserInfo.uid
          }
        })
        .then(response => {
          let data = response.data.data;
          if (response.data.code == 1) {
            this.userList = data;
            this.pickerList = [];
            for (let s of data.roles) {
              this.pickerList.push({
                label: s.server_name + ' - ' + s.role_name,
                value: s.gold,
                server_id: s.server_id,
                role_id: s.role_id,
                server_name: s.server_name,
                role_name: s.role_name
              });
            }
            this.model1 = this.gold = this.pickerList[0].value;
            this.server_id = this.pickerList[0].server_id;
            this.role_id = this.pickerList[0].role_id;
            this.server_name = this.pickerList[0].server_name;
            this.role_name = this.pickerList[0].role_name;
            // this.model1 = this.gold = this.pickerList[0].value;
            // this.server_id = this.pickerList[0].server_id;
            // this.role_id = this.pickerList[0].role_id;
          } else {
            this.$vux.toast.text(response.data.msg);
          }
        })
        .catch(error => {
          this.$vux.toast.text('系统错误，请稍后重试');
        });
    },
    getListData() {
      this.$ajax
        .get('/product/list', {
          params: {
            game_id: this.game_id,
            type: 10 //金币类型
          }
        })
        .then(response => {
          var te = this.$options.filters['saleAmount'];
          this.dataList = response.data.data;
          this.amount = te(this.dataList[0].amount);
          this.product_name = this.dataList[0].rebate_title;
          this.product_id = this.dataList[0].product_id;
        })
        .catch(error => {
          this.$vux.toast.text('系统错误，请稍后重试');
        });
    },
    pay() {
      // this.$router.push('/game-around-detail');
      var te = this.$options.filters['saleAmount'];
      if (this.single == false) {
        this.$vux.toast.text('没有同意协议');
        return;
      } else if (this.server_id == null || this.role_id == null) {
        this.$vux.toast.text('请选择区服角色');
        return;
      } else if (this.amount == 0 || this.amount == '') {
        this.$vux.toast.text('支付金额不能为0');
        return;
      }

      let pay_type = 7;
      // if (this.isWeiXin()) {
      //   pay_type = 4;
      // }

      this.$ajax
        .get('/trade/create', {
          params: {
            token: this.getToken,
            game_id: this.game_id,
            anuid: this.getUserInfo.uid,
            product_name: this.product_name,
            product_id: this.product_id,
            amount: this.amount * 100,
            pay_type: pay_type,
            server_id: this.server_id,
            server_name: this.server_name,
            role_id: this.role_id,
            role_name: this.role_name,
            gold: this.gold
          }
        })
        .then(response => {
          let data = response.data.data;
          if (response.data.code == 1) {
            if (pay_type == 2) {
              location.href = data.pay_url;
            } else {
              this.pay_url = data.pay_url;
              this.trade_id = data.trade_id;
              // if (typeof pay_url == 'string') {
              //   pay_url = JSON.parse(pay_url);
              // }
              this.dialogFormVisible = true;
              this.setQrcode();
              // this.weixinPay(pay_url);
            }
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
    },
    setQrcode(time = '') {
      this.qrcode = `${this.baseURL}/qrcode/img?data=${this.pay_url}&time=${time}`;
      this.timer = setInterval(() => {
        this.queryIsPay();
      }, 1000);
    },
    repeatPay() {
      this.dialogFormVisible = !this.dialogFormVisible;
      // this.setQrcode(new Date().getTime());
    },
    refreshWechatCode() {
      this.setQrcode(new Date().getTime());
    },
    handleFinished() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    // 微信支付查询是否支付成功
    queryIsPay() {
      this.$ajax
        .get('/trade/check-pay', {
          params: {
            trade_id: this.trade_id
          }
        })
        .then(response => {
          if (response && response.data.data.pay_status == 1) {
            clearInterval(this.timer);
            this.timer = null;
            this.dialogFormVisible = false;
            this.dialogPayStatus = true;
          } else {
            return false;
          }
        })
        .catch(error => {
          this.$vux.toast.text('系统错误，请稍后重试');
        });
    },
    // 关闭弹窗清除轮询
    closeWXpay() {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="stylus" scoped>
.pay-user-info
  span
    display flex
    align-items center
.el-select
  .el-input__inner
    width 100%
</style>
