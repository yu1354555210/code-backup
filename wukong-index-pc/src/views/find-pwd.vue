<template>
  <div>
    <section class="service-section">
      <layout-login></layout-login>
      <div class="service-main this-section">
        <div class="service-right-form-box">
          <div class="this-title mobile-title">
            找回<span>密码</span>
          </div>
          <div class="service-right-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item prop="mobile"><el-input v-model="ruleForm.mobile" placeholder="请输入手机号码" maxlength="11"></el-input></el-form-item>
              <el-form-item label="" prop="sms">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col class="sms-input"><el-input v-model="ruleForm.sms" placeholder="请输入短信验证码" autocomplete="off"></el-input></el-col>
                  <el-button plain type="warning" @click="findSendSms('ruleForm')">获取验证码</el-button>
                </el-row>
              </el-form-item>
              <el-form-item prop="pass">
                <el-input type="password" :show-password="true" :clearable="true" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item><el-button plain type="warning" class="login-btn" @click="submitForm('ruleForm')">修改密码</el-button></el-form-item>
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
    return {
      ruleForm: {
        sms: '',
        pass: '',
        mobile: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机号格式错误' }
        ],
        sms: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        pass: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }]
      }
    };
  },
  components: {
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
    findSendSms(formName) {
      this.$refs[formName].validateField('mobile', valid => {
        if (!valid) {
          this.sendSms(this.ruleForm.mobile);
        } else {
          return false;
        }
      });
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    postData() {
      this.$ajax
        .get('/user/modify-mobile', {
          params: {
            mobile: this.ruleForm.mobile,
            code: this.ruleForm.sms,
            passwd1: this.ruleForm.pass
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.$vux.toast.text('修改成功');
            this.$router.back();
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.service-section
  padding-top 40px
</style>
