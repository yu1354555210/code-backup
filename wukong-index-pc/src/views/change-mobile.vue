<template>
  <div>
    <section class="service-section">
      <div class="bread-box">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/service' }">服务中心</el-breadcrumb-item>
          <el-breadcrumb-item>更改绑定手机</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <layout-login></layout-login>
      <div class="service-main this-section">
        <div class="service-right-form-box">
          <div class="this-title mobile-title">
            更改<span>绑定手机</span>
          </div>
          <h3 class="bind-user">当前绑定手机号：{{getUserInfo.mobile}}</h3>
          <div class="service-right-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="" prop="sms">
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col class="sms-input"><el-input v-model="ruleForm.sms" placeholder="请输入短信验证码" autocomplete="off"></el-input></el-col>
                  <el-button plain type="warning" @click="sendSms(getUserInfo.mobile)">获取验证码</el-button>
                </el-row>
              </el-form-item>
              <el-form-item prop="mobile"><el-input v-model="ruleForm.mobile" placeholder="请输入新手机号码" maxlength="11"></el-input></el-form-item>
              <el-form-item><el-button plain type="warning" class="login-btn" @click="submitForm('ruleForm')">完成修改</el-button></el-form-item>
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
          { required: true, message: '请输入新手机号码', trigger: 'blur' },
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
            new_mobile: this.getUserInfo.mobile,
            code: this.ruleForm.sms,
            token: this.getToken
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

<style lang="stylus">

</style>
