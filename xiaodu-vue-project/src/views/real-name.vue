<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">实名认证</x-header>
        <div v-if="isSuccess==false">
            <div class="this-form">
                <div class="this-form-tips"></div>
                <div class="this-form-main">
                    <ul>
                        <li>
                            <x-input v-model="realname_val" ref="user_name" placeholder="请输入真实姓名" required ></x-input>
                        </li>
                        <li>
                            <x-input v-model="idcard_val" ref="real_code" :max="18" placeholder="请使用真实身份证信息认证" type="tel" required></x-input>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="btn-box btn-blue">
                <x-button type="primary" @click.native="postData">确认</x-button>
            </div>
        </div>

        <div class="bind-success" v-if="isSuccess">
          <div class="bind-success-img">
            <img src="../assets/img/real-name-success.png" alt="">
          </div>
          <div class="bind-success-body">
            <h2>认证成功</h2>
            <p>系统已成功审核您的实名认证</p>
          </div>
        </div>
    </div>
</template>

<script>
import { XButton, XHeader, XInput, Icon } from "vux";
import { mapGetters } from 'vuex';
export default {
  components: {
    XButton,
    XHeader,
    XInput,
    Icon
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted() {
    this.$nextTick(function() {
      let playerInfo = this.getUserInfo;

      if (playerInfo != null) {
        if (playerInfo.is_bind_idcard == 1) {
          this.isSuccess = true;
        } else {
          this.$ajax
            .get("/xd-api/player-info")
            .then(res => {
              let data = res.data.data;
              if (data.is_bind_idcard == 1) {
                this.isSuccess = true;
              } else {
                this.isSuccess = false;
              }
              this.$store.commit("setUserInfo",data);
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    });
  },
  data() {
    return {
      isSuccess: false,
      realname_val: "",
      idcard_val: ""
    };
  },
  methods: {
    postData() {
      let userNameInfo = this.$refs.user_name.currentValue,
        realCode = this.$refs.real_code.currentValue;
      if (userNameInfo == "") {
        this.$vux.toast.text("姓名未填写");
        return;
      } else if (realCode == "") {
        this.$vux.toast.text("身份证号码未填写");
        return;
      } else if (!this.IdentityCodeValid(realCode)) {
        this.$vux.toast.text("身份证号码格式不正确");
        return;
      } else {
        let realname = $.trim(this.realname_val);
        let idcard = $.trim(this.idcard_val);
        let params = new URLSearchParams();
        params.append("realname", realname);
        params.append("idcard", idcard);
        this.$ajax({
          method: "post",
          url: "/bind-idcard/bind-idcard",
          data: params
        })
          .then(response => {
            if (response.data.status != 1) {
              this.$vux.toast.text(response.data.msg);
              return;
            }
            this.isSuccess = true;
          })
          .catch(error => {
            this.$vux.toast.text("发送失败，请稍后重试");
          });
        this.isSuccess = true;
      }
    },
    IdentityCodeValid(code) {
      //验证身份证号码
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      };
      var tip = "";
      var pass = true;

      if (
        !code ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
          code
        )
      ) {
        tip = "身份证号格式错误";
        pass = false;
      } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
      } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
          code = code.split("");
          //∑(ai×Wi)(mod 11)
          //加权因子
          var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          //校验位
          var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if (parity[sum % 11] != code[17]) {
            tip = "校验位错误";
            pass = false;
          }
        }
      }
      //if(!pass) alert(tip);
      return pass;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
