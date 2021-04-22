<template>
  <div>
    <section class="service-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/service' }">服务中心</el-breadcrumb-item>
          <el-breadcrumb-item>更改实名认证信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <layout-login></layout-login>
      <div class="service-main this-section">
        <div class="service-right-form-box">
          <div class="this-title real-title">
            更改实名<span>认证信息</span>
          </div>
          <h3 class="bind-user">当前绑定手机号：{{getUserInfo.mobile}}</h3>
          <div class="service-right-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="" prop="sms">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col class="sms-input">
                    <el-input v-model="ruleForm.sms" placeholder="请输入短信验证码"></el-input>
                  </el-col>
                  <el-button plain type="warning" @click="sendSms(getUserInfo.mobile)">获取验证码</el-button>
                </el-row>
              </el-form-item>
              <el-form-item prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item prop="realCode">
                <el-input v-model="ruleForm.realCode" placeholder="请输入身份证号" maxlength="18"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button plain type="warning" class="login-btn" @click="submitForm('ruleForm')">完成修改</el-button>
              </el-form-item>
            </el-form>
          </div>
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

    // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
    // 详情查看javascript的数值范围
    function checkIDCard(idcode){
        // 加权因子
        var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
        // 校验码
        var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

        var code = idcode + "";
        var last = idcode[17];//最后一位

        var seventeen = code.substring(0,17);

        // ISO 7064:1983.MOD 11-2
        // 判断最后一位校验码是否正确
        var arr = seventeen.split("");
        var len = arr.length;
        var num = 0;
        for(var i = 0; i < len; i++){
            num = num + arr[i] * weight_factor[i];
        }

        // 获取余数
        var resisue = num%11;
        var last_no = check_code[resisue];

        // 格式的正则
        // 正则思路
        /*
        第一位不可能是0
        第二位到第六位可以是0-9
        第七位到第十位是年份，所以七八位为19或者20
        十一位和十二位是月份，这两位是01-12之间的数值
        十三位和十四位是日期，是从01-31之间的数值
        十五，十六，十七都是数字0-9
        十八位可能是数字0-9，也可能是X
        */
        var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

        // 判断格式是否正确
        var format = idcard_patter.test(idcode);

        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        return last === last_no && format ? true : false;
    }

    var validateIdCard = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入身份证号'));
      } else if (!checkIDCard(value)) {
        callback(new Error('身份证号码格式不正确'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: '',
        sms: '',
        realCode: '',
      },
      rules: {
        sms: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        realCode: [
          { validator: validateIdCard, trigger: 'blur' },
        ],
      }
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
    ...mapActions(['sendSms']),
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    postData(){
      this.$ajax
        .get('/user/modify-realname', {
          params: {
            code: this.ruleForm.sms,
            token: this.getToken,
            realname: this.ruleForm.name,
            idcard: this.ruleForm.realCode,
          }
        })
        .then(res => {
          if(res.data.code == 1){
            this.$vux.toast.text('修改成功');
            this.$router.back();
          }else{
            this.$vux.toast.text(res.data.msg);
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
