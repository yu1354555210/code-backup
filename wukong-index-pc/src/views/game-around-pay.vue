<template>
  <div class="wrapper">
    <!-- <div class="game-header"><game-header></game-header></div> -->
    <div class="pay-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/props-city' }">藏宝阁</el-breadcrumb-item>
          <el-breadcrumb-item v-text="goodsDataArr.title"></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="pay-body">
        <div class="pay-user-panel pay-goods-panel">
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                收货地址
              </span>
            </div>
            <!-- <input type="text" readonly name="" id="" :value="getUserInfo" /> -->
            <div class="pay-user-info">
              <!-- <p>辽宁省  沈阳市  和平区 23-9号 幸福里小区2-4-2 <span>修改</span></p> -->

              <!-- 选择地址 -->
              <div class="select_address pstat" v-show="isShowSelectAddress">
                <ul class="clearfix">
                  <li :class="isActive == index ? 'active' : ''" v-for="(item, index) in addressData" :key="index" @click="selectAddressTab(index)">
                    <a href="javascript:;" class="sel_opt">
                      <i class="iconC_cheack"></i>
                      <div class="wrape_SA">
                        <p class="marginB10">
                          <span v-text="item.username"></span>
                          <span v-text="item.mobile"></span>
                        </p>
                        <p>
                          <span v-text="item.address"></span>
                          <span v-text="item.detail"></span>
                        </p>
                      </div>
                    </a>
                    <p class="foot_SA">
                      <a href="javascript:;" class="" v-if="item.is_default == 1">已为默认</a>
                      <span v-if="item.is_default == 1">|</span>
                      <a href="javascript:;" @click="addressDialogVisible = true">删除</a>
                    </p>
                  </li>
                </ul>
                <a href="javascript:;" class="btn_plusAds" @click="ShowAddAddress">
                  <i class="iconC iconC_plus"></i>
                  填写新地址
                </a>
              </div>

              <!-- 新增收货地址 -->
              <div class="huoAdd_edit_zu pstat" v-show="isShowAddAddress">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                  <el-form-item prop="username" label="收货人"><el-input v-model="ruleForm.username"></el-input></el-form-item>
                  <el-form-item prop="mobile" label="手机号"><el-input v-model="ruleForm.mobile" maxlength="11"></el-input></el-form-item>
                  <el-form-item prop="selectVal" label="所在地">
                    <el-cascader v-model="ruleForm.selectVal" clearable :options="options" @change="handleChange" ref="cascaderAddr"></el-cascader>
                  </el-form-item>
                  <el-form-item prop="detail" label="详细地址"><el-input v-model="ruleForm.detail"></el-input></el-form-item>
                  <el-form-item label="">
                    <div class="agreement">
                      <label><el-checkbox v-model="checked">设为默认</el-checkbox></label>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')">确 认</el-button>
                    <el-button plain @click="ShowSelectAddress">取 消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <div class="input-item">
            <div class="pay-title title">
              <span>
                <i></i>
                确认商品信息
              </span>
            </div>
            <div class="pay-goods-info" v-if="goodsDataArr">
              <div class="pay-goods-img"><img :src="goodsDataArr.logo" alt="" /></div>
              <div class="pay-goods-main">
                <h2 v-text="goodsDataArr.title"></h2>
                <ul>
                  <li>
                    <span>单价（元）</span>
                    {{ goodsDataArr.price | saleAmount }}
                  </li>
                  <li>
                    <span>数量</span>
                    {{ num }}
                  </li>
                  <li>
                    <span>金额</span>
                    <b>¥{{ totalPrice }}元</b>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="total-box pay-goods-total">
          <div class="total-right">
            <div class="pay-total-item">
              收货人
              <b>{{ activeAddressData.username }}</b>
            </div>
            <div class="pay-price pay-total-item">
              应付款
              <span>{{ totalPrice }}元</span>
            </div>
            <a href="javascript:void(0);" class="btn red-btn" @click="pay" v-points>立即购买</a>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="addressDialogVisible" width="15%" top="30vh" center>
      <span>确定删除该地址</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteAddressData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="微信扫码付款" :visible.sync="dialogFormVisible" width="20%" top="20vh" center @close="closeWXpay">
      <h4>订单总额: {{ this.totalPrice }}元</h4>
      <img :src="qrcode" />
      <el-row type="flex" class="row-bg" justify="center"><el-button type="text" @click="refreshWechatCode" icon="el-icon-refresh">点击刷新二维码</el-button></el-row>
      <!-- <div class="wechat-box">
        <el-button type="success" plain round @click="handleFinished">支付完成</el-button>
        <el-button type="info" plain round @click="repeatPay">重新支付</el-button>
      </div> -->
    </el-dialog>

    <el-dialog title="购买成功" :visible.sync="dialogPayStatus" class="dialog-success" width="20%" top="30vh" center :show-close="false">
      <!-- <p>购买成功~</p> -->
      <p>前往订单详情</p>
      <p>
        <el-link
          target="_blank"
          type="primary"
          href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97d57357c0744199e61fe2e03750a645b46ae6cd4fd62ff317e5cdda37c9e329c6a23e4405f291d70d4ab41baa2ffbc2ed"
        >
          遇到问题？
        </el-link>
      </p>
      <el-row type="flex" class="row-bg" justify="center"><el-button type="primary" @click="goHome">回到首页</el-button></el-row>
    </el-dialog>

    <div class="game-around-bottom"><new-game></new-game></div>
  </div>
</template>
<script type="text/javascript">
import { regionData } from 'element-china-area-data';
import { mapMutations, mapState, mapGetters } from 'vuex';
import newGame from '@/components/new-game.vue';

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        detail: '',
        mobile: '',
        selectVal: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机号格式错误' }
        ],
        username: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        selectVal: [{ required: true, message: '请选择所在地', trigger: 'change' }],
        detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      addressDialogVisible: false,
      isShowAddAddress: false,
      isShowSelectAddress: false,
      propsHeaderIndex: 0,
      isActive: 0,
      options: regionData,
      selectVal: [],
      num: 1,
      isShowTipsPopup: false,
      addressData: [],
      city: '',
      amount: 0,
      checked: true,
      activeAddressData: [],
      goodsDataArr: [],
      dialogPayStatus: false,
      dialogFormVisible: false,
      qrcode: null,
      pay_url: '',
      order_id: '',
      timer: null,
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getAddressData();
      if (this.$route.query) {
        let data = this.$route.query.data;
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        this.goodsDataArr = data;
        this.num = this.$route.query.num;
      }
    });
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getUserInfo', 'getToken', 'getGameUnit']),
    totalPrice() {
      return (this.goodsDataArr.price * this.num) / 100;
    }
  },
  filters: {
    saleAmount(value) {
      return value / 100;
    }
  },
  components: {
    newGame
  },
  methods: {
    handleChange(value) {
      //获取label，
      let cityArr = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels || '';
      this.city = cityArr.join('|');
    },
    selectAddressTab(i) {
      this.isActive = i;
      this.activeAddressData = this.addressData[i];
    },
    getAddressData() {
      this.$ajax
        .get('/shop/address-list', {
          params: {
            token: this.getToken
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.addressData = data;
            if (this.addressData.length > 0) {
              this.ShowSelectAddress();
              let idx;
              let data = this.addressData.filter((item, index) => {
                if (item.is_default == 1) {
                  this.isActive = index;
                  return item;
                }
              });
              this.activeAddressData = data[0];
            } else {
              this.ShowAddAddress();
              this.activeAddressData = [];
            }
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setAddressData() {
      this.$ajax
        .get('/shop/address-save', {
          params: {
            token: this.getToken,
            id: 0,
            username: this.ruleForm.username,
            mobile: this.ruleForm.mobile,
            address: this.city,
            detail: this.ruleForm.detail,
            is_default: this.checked ? 1 : 0
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.getAddressData();
            this.ShowSelectAddress();
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteAddressData() {
      this.$ajax
        .get('/shop/address-remove', {
          params: {
            token: this.getToken,
            id: this.activeAddressData.id
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.getAddressData();
            this.addressDialogVisible = false;
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.setAddressData();
        } else {
          return false;
        }
      });
    },
    ShowSelectAddress() {
      this.isShowSelectAddress = true;
      this.isShowAddAddress = false;
    },
    ShowAddAddress() {
      this.isShowSelectAddress = false;
      this.isShowAddAddress = true;
      this.resetForm('ruleForm');
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getHeaderIndex(index) {
      this.propsHeaderIndex = index;
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
    pay() {
      // this.$router.push('/game-around-detail');
      var te = this.$options.filters['saleAmount'];
      if (this.totalPrice == 0 || this.totalPrice == '') {
        this.$vux.toast.text('支付金额不能为0');
        return;
      } else if (this.activeAddressData.length == 0) {
        this.$vux.toast.text('请填写收货地址');
        return;
      }

      let pay_type = 7;
      // if (this.isWeiXin()) {
      //   pay_type = 4;
      // }
      this.$ajax
        .get('/shop/order-create', {
          params: {
            token: this.getToken,
            goods_id: this.goodsDataArr.id,
            price: this.goodsDataArr.price,
            num: this.num,
            username: this.activeAddressData.username,
            mobile: this.activeAddressData.mobile,
            address: this.activeAddressData.address,
            detail: this.activeAddressData.detail,
            pay_type: pay_type,
          }
        })
        .then(response => {
          let data = response.data.data;
          if (response.data.code == 1) {
            if (pay_type == 2) {
              location.href = data.pay_url;
            } else {
              // console.log(data);
              this.pay_url = data.pay_url;
              this.order_id = data.order_id;
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
        .get('/shop/order-check-pay', {
          params: {
            order_id: this.order_id
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
    },
    goHome(){
      this.dialogPayStatus = false;
      this.$router.push('/');
    }
  }
};
</script>
<style lang="stylus">
.el-cascader
  width 500px
.huoAdd_edit_zu
  width 850px
</style>
