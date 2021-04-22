<template>
  <div class="wrapper">
    <x-header :left-options="{backText: ''}">收货地址</x-header>
    <div class="this-form">
      <div class="this-form-tips"></div>
      <div class="this-form-main">
        <ul>
          <li>
            <x-input placeholder="请填写收货人" required ref="userName" v-model="userName"></x-input>
          </li>
          <li>
            <x-input
              placeholder="联系电话"
              required
              id="receivephone"
              type="tel"
              is-type="china-mobile"
              :max="11"
              v-model="userPhone"
              ref="validMobile"
              @on-change="isWin"
            ></x-input>
          </li>
          <li class="address-select">
            <x-address
              required
              :list="addressData"
              title=""
              placeholder="请选择所在地区"
              value-text-align="left"
              id="receiveaddr"
              ref="selectAddress"
              v-model="addressVal"
            ></x-address>
          </li>
          <li>
            <x-input placeholder="请输入详细地址" required ref="userAdd" v-model="userAdd"></x-input>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-box btn-blue">
      <x-button type="primary" @click.native="postData">确认</x-button>
    </div>
    <div class="this-form-other">
      <icon type="warn"></icon>
      <span>由于快递原因,香港、澳门、台湾、新疆、西藏暂不邮寄</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  XButton,
  XHeader,
  XInput,
  Icon,
  XAddress,
  XTextarea,
  Value2nameFilter as value2name,
  ChinaAddressV4Data
} from "vux";
export default {
  components: {
    XButton,
    XHeader,
    XInput,
    Icon,
    XAddress,
    ChinaAddressV4Data,
    XTextarea
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      addressData: ChinaAddressV4Data,
      userName: "",
      userPhone: "",
      userAdd: "",
      valid_mobile: false,
      addressVal: []
    };
  },
  computed: {
    ...mapGetters(["getAddress"])
  },
  methods: {
    // 手机验证是否通过
    isWin() {
      this.valid_mobile = this.$refs.validMobile.valid;
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    getData() {
      if(this.getAddress != null){
        this.userName = this.getAddress.title;
        this.userPhone = this.getAddress.mobile;
        this.addressVal = this.getAddress.province.split(" ");
        this.userAdd = this.getAddress.info;
      }
    },
    postData() {
      let userNameInfo = this.$refs.userName.currentValue,
        validMobile = this.$refs.validMobile.currentValue,
        selectAddress = this.$refs.selectAddress.currentValue,
        userAdd = this.$refs.userAdd.currentValue;
      if (userNameInfo == "") {
        this.$vux.toast.text("请填写收货人");
        return;
      } else if (validMobile == "") {
        this.$vux.toast.text("请填写手机号");
        return;
      } else if (selectAddress == "") {
        this.$vux.toast.text("所在地区未选择");
        return;
      } else if (userAdd == "") {
        this.$vux.toast.text("请填写详细地址");
        return;
      } else if (!this.valid_mobile) {
        this.$vux.toast.text("请填写正确的手机号");
        return;
      } else {
        let newUser = this.userName;
        let userPhone = this.userPhone;
        let userAdd = this.userAdd;
        let addressVal = this.getName(this.addressVal);
        let params = new URLSearchParams();
        params.append("title", newUser);
        params.append("mobile", userPhone);
        params.append("province", addressVal);
        params.append("info", userAdd);
        this.$ajax({
          method: "post",
          url: "xd-shop/save-address",
          data: params
        })
          .then(response => {
            if (response.data.status != 1) {
              this.$vux.toast.text(response.data.msg);
              return;
            }
            this.$vux.toast.text("修改成功");
            this.$store.dispatch("getAddressData");
            setTimeout(() => {
              this.$router.back();
            }, 500);
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    }
  }
};
</script>

<style>
#receiveaddr {
  width: 100%;
}
.vux-cell-placeholder {
  color: #757575 !important;
}
</style>

<style lang="less" scoped>
.address-select {
  height: 1.2rem;
  font-size: 0.26rem;
  display: flex;
  align-items: center;
  color: #9fabbe;
}
</style>
