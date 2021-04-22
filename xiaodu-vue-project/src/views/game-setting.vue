<template>
  <div class="wrapper">
    <x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="back">设置</x-header>
    <div class="setting-list this-box">
      <ul>
        <li @click="cnzzTrackEvent('设置页-头像')">
          <span>头像</span>
          <label class="setting-label" for="uploads">
            <span class="setting-header">
              <input
                type="file"
                id="uploads"
                style="position:absolute; clip:rect(0 0 0 0);"
                accept="image/*"
                @change="uploadImg($event, 1)"
              >
              <img v-if="getUserInfo" :src="getUserInfo.logo" class="needsclick" alt="">
            </span>
          </label>
        </li>
        <router-link tag="li" to="change-username" @click.native="cnzzTrackEvent('设置页-昵称')">
          <span>昵称</span>
          <div class="setting-info" v-if="getUserInfo" v-text="getUserInfo.nick_name"></div>
        </router-link>
        <router-link v-if="getUserInfo" tag="li" to="bind-phone" @click.native="cnzzTrackEvent('设置页-帐号升级')">
          <span>帐号升级</span>
          <div
            class="setting-info"
            v-text="getUserInfo.bind_phone"
            v-if="getUserInfo.is_bind_phone == 1"
          ></div>
          <div class="setting-up-status" v-else>未升级</div>
        </router-link>
        <router-link tag="li" to="change-pwd" @click.native="cnzzTrackEvent('设置页-修改密码')">
          <span>修改密码</span>
        </router-link>
        <router-link tag="li" to="game-address" @click.native="cnzzTrackEvent('设置页-收货地址')">
          <span>收货地址</span>
        </router-link>
      </ul>
    </div>
    <div class="btn-box btn-blue" @click="cnzzTrackEvent('设置页-退出登录')">
      <x-button type="primary" @click.native="loginout">退出登录</x-button>
    </div>
    <div class="set-header-dialog-container" v-if="isShowSetHeader">
      <div class="set-header-dialog this-box">
        <!-- <div class="set-header-item">
          <img src="../assets/img/icon-take.png" alt="">
          <p>拍照</p>
        </div>-->
        <div class="icon-set-header-close" @click="isShowSetHeader=false"></div>
      </div>
      <div class="model" v-show="model">
        <div class="model-show" @click="model = false">
          <img :src="modelSrc" alt="" @click="model = false">
        </div>
      </div>
    </div>
    <div class="cropper" v-if="isCropper">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.outputSize"
        :outputType="option.outputType"
        :info="option.info"
        :canScale="option.canScale"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixed="option.fixed"
        :canMove="option.canMove"
        :fixedNumber="option.fixedNumber"
      ></vueCropper>
      <div class="cropper-btn-box">
        <button class="cropper-cancel-btn" @click="isCropper=false">取消</button>
        <button @click="onCubeImg" class="cropper-sumbit-btn">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, XHeader } from "vux";
import { mapGetters } from "vuex";
import { VueCropper } from "vue-cropper";
export default {
  components: {
    XButton,
    XHeader,
    VueCropper
  },
  computed: {
    ...mapGetters(["getUserInfo"])
  },
  watch: {
    getUserInfo(val) {
      this.info = val;
    }
  },
  mounted() {
    this.$nextTick(function() {
      var playerInfo = this.getUserInfo;
      if (playerInfo != null && playerInfo != "[]") {
        this.info = playerInfo;
      } else {
        this.$store.dispatch("LoginInfo");
      }
    });
  },
  data() {
    return {
      info: [],
      isShowSetHeader: false,
      isCropper: false,
      option: {
        img: "", //裁剪图片的地址
        info: true, //裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "jpeg", //裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: true, //是否开启截图框宽高固定比例
        fixedNumber: [4, 4], //截图框的宽高比例
        canMove: false
      },
      model: false,
      modelSrc: "",
      crap: false,
      isShowCropper: false, //是否显示截图框
      fileUpload: null,
      form: {}
    };
  },
  methods: {
    loginout() {
      this.$ajax
        .get("/login/out")
        .then(response => {
          if (response.data.status == 0) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          setTimeout(() => {
            this.$router.push({
              path: "/login",
              query: {
                redirect: this.$route.path
              }
            });
            this.$store.commit("removeUserInfo");
            this.$store.commit("removeLogin");
            this.$store.commit("removeOpenid");
            this.$store.commit("removeDiamond");
          }, 30);
        })
        .catch(error => {
          console.log(error);
          this.$vux.toast.text("logout err");
        });

      $.ajax({
          dataType: "jsonp",
          url: "http://h5.nzha.com/xdcoop/player/logout",
          jsonp: "callback",
          jsonpCallback: "logout_jsonpCallback",
          success: function (data) {
              // console.log(data);
          }
      });

      function logout_jsonpCallback(res) {
          // console.log(res);
      }
    },
    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      this.isCropper = true;
      reader.readAsArrayBuffer(file);
    },
    // 确定裁剪图片
    onCubeImg() {
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        this.isShowCropper = false;
        //先将显示图片地址清空，防止重复显示
        this.option.img = "";
        this.isCropper = false;
        this.$ajax
          .put("/xd-shop/upload", {
            head_img: data // 页码
          })
          .then(response => {
            this.$store.dispatch("LoginInfo");
            this.isShowSetHeader = false;
            setTimeout(() => {
              this.$vux.toast.text("上传成功");
            }, 500);
          });
      });
    },
    back() {
      this.$router.push("/game-mine");
    }
  }
};
</script>

<style lang="less">
.cropper {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 8888;
  .vue-cropper {
    background: rgba(0, 0, 0, 0.8);
  }
  .cropper-btn-box {
    position: absolute;
    bottom: 50px;
    left: 0;
    display: flex;
    justify-content: space-around;
    width: 100%;
    button {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c0ccda;
      color: #1f2d3d;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 20px 10px 0px 0px;
      padding: 9px 15px;
      font-size: 14px;
      border-radius: 4px;
      color: #fff;
      background-color: #50bfff;
      border-color: #50bfff;
      transition: all 0.2s ease;
      text-decoration: none;
      user-select: none;
    }
  }
}
</style>
