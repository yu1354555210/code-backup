<template>
  <div class="wrapper">
    <x-header :left-options="{ backText: '' }">充值{{ getGameUnit }}</x-header>
    <div class="pay-section">
      <div class="pay-user-panel">
        <dl>
          <dt class="pay-title">您的充值账号：</dt>
          <dd>
            <div class="this-input">
              <label>账号:</label>
              <input type="text" readonly name="" id="" :value="getUserInfo.username" />
            </div>
            <div class="pay-user-info">
              <span>
                充值账号昵称：
                <Select v-model="model1" size="small" style="width: 3rem;" @on-change="onChange">
                  <Option v-for="item in pickerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </span>
              <span>{{ getGameUnit }}：{{ gold }}</span>
            </div>
          </dd>
        </dl>
      </div>
      <div class="number-list">
        <div class="pay-title">{{ getGameUnit }}数量：</div>
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
      <div class="total-box">
        <div class="pay-title">应付{{ this.amount }}元：</div>
        <div class="agreement">
          <label>
            <Checkbox v-model="single" @click="check"></Checkbox>
            <div>
              我已认真阅读
              <router-link to="/pay-agreement">《悟空游戏充值服务协议》</router-link>
            </div>
          </label>
        </div>
        <a href="javascript:void(0);" class="btn btn-long" @click="pay">立即充值</a>
      </div>
      <p class="pay-tips">提示：道具城充值{{getGameUnit}}不计算游戏中财神活动、累充活动等~</p>

    </div>
  </div>
</template>
<script type="text/javascript">
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
  data() {
    return {
      dataList: [],
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
  },
  methods: {
    alertPopup() {
      this.$vux.alert.show({
        title: '支付成功',
        content: '<p>支付成功请前往游戏内邮件领取~</p><p><a style="color: blue;" href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed">遇到问题？<a/></p>',
      });
    },
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
      } else if (this.isPc()) {
        this.$vux.toast.text('pc端暂不支持支付');
        return;
      }

      let pay_type = 2;
      if (this.isWeiXin()) {
        pay_type = 4;
      }

      this.$ajax
        .get('/trade/create', {
          params: {
            game_id: this.game_id,
            token: this.getToken,
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
              let pay_url = data.pay_url;
              if (typeof pay_url == 'string') {
                pay_url = JSON.parse(pay_url);
              }
              this.weixinPay(pay_url);
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
    weixinPay: function(data) {
      var vm = this;
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
          document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data));
        }
      } else {
        vm.onBridgeReady(data);
      }
    },
    onBridgeReady: function(data) {
      var vm = this;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: data.appId, //公众号名称，由商户传入
          timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: data.nonceStr, //随机串
          package: data.package, //订单详情扩展字符串
          signType: data.signType, //微信签名方式：
          paySign: data.paySign //微信签名
        },
        function(res) {
          console.log(res);
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            vm.getUserData();
            vm.alertPopup();
          } else {
            vm.$vux.toast.text('支付失败');
          }
        }
      );
    },
    check(e) {
      this.single = e.target.checked;
    }
  }
};
</script>
<style lang="stylus" scoped>
.pay-user-info
  span
    display flex
    align-items center
input[type=checkbox]
  -webkit-appearance checkbox !important
  margin-right 0.1rem
.pay-tips
  text-align center
  margin 0.3rem 0
  font-size 0.24rem
</style>
