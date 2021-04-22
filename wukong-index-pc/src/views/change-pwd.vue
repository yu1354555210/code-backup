<template>
  <div>
    <section class="service-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/service' }">服务中心</el-breadcrumb-item>
          <el-breadcrumb-item>修改密码</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <layout-login></layout-login>
      <div class="service-main this-section">
        <div class="service-right-form-box">
          <div class="this-title online-title">
            修改<span>密码</span>
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
              <el-form-item prop="pass">
                <el-input type="password" :show-password="true" :clearable="true" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input type="password" :show-password="true" :clearable="true" v-model="ruleForm.checkPass" placeholder="请再次输入密码" autocomplete="off"></el-input>
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        sms: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        sms: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
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
    check(e) {
      this.single = e.target.checked;
    },
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
        .get('/user/mobile-modifypwd', {
          params: {
            mobile: this.getUserInfo.mobile,
            code: this.ruleForm.sms,
            token: this.getToken,
            passwd1: this.ruleForm.pass,
            passwd2: this.ruleForm.checkPass,
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
