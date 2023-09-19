<template>
  <div
    class="login-container"
    :class="[
      rightBgWhite ? 'bg-white' : '',
      allowRegister ? 'show_register' : '',
    ]"
  >
     <!-- <header class="disp_flex ju_bet ali_cen login-header">
      <div class="logo-title disp_flex ali_cen">
        <img src="../../assets/logo.png" alt="" /> -->
        <!-- {{ title }} -->
        <!--  海久六灵
      </div>
      <div class="header-r">
        <el-link underline @click="jumpHtml('/yhxy.html')">用户协议</el-link>
        <el-link underline @click="jumpHtml('/ystk.html')">隐私政策</el-link>
      </div>
    </header> -->
    <!-- <div class="page-col-bg"></div> -->
    <div class="login-header">
        海久六灵数字维护共享平台
    </div>
    <main class="page-col-login">
      <div class="disp_flex ju_ard flex">
        <div class="login-wrap">
          <div class="login-title">登 录</div>
          <div class="login-box">
             <el-form
                ref="form"
                :model="form"
                :rules="rules"
                class="login-form disp_flex flex_column"
                label-position="left"
              >
                  <el-form-item>
                    <div class="select-box">
                      <div  class="suffix"><img src="@/assets/login/tabs-btn.svg" alt=""></div>
                      <el-select v-model="action" placeholder="请选择" :popper-append-to-body="false">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :disabled="item.disabled"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  
                  </el-form-item>
                  <el-form-item  prop="username">
                        <el-input
                          v-model.trim="form.username"
                          placeholder="用户名/邮箱"
                          tabindex="1"
                          autocomplete="off"
                          :readonly='readonly'
                          @focus='handlerIptClick'
                          class="el-input-box"
                          icon="el-icon-search"
                          type="text">
                          <template #suffix>
                            <div  class="suffix"><img src="@/assets/login/user-btn.svg" alt=""></div>
                          </template>
                        </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                        <el-input
                          ref="password"
                          class="el-input-box"
                          v-model.trim="form.password"
                          type="password"
                          autocomplete="off"
                          :readonly='readonly'
                          @focus='handlerIptClick'
                          tabindex="2"
                          placeholder="密码">
                          <template #suffix>
                            <div  class="suffix"><img src="@/assets/login/pwd-btn.svg" alt=""></div>
                          </template>
                        </el-input>
                  </el-form-item>
                  <el-form-item>
                        <div class="form_bottom disp_flex ju_bet">
                          <el-checkbox v-model="isremember"
                            >7日内自动登录</el-checkbox
                          >
                          <div class="disp_flex">
                            <el-link
                              :underline="false"
                              class="linkText"
                              @click="jump('/passwordReset')"
                              >忘记密码</el-link
                            >
                          </div>
                        </div>
                  </el-form-item>
                  <el-button
                        :loading="loading"
                        class="login-btn"
                        type="primary"
                        @click="handleLogin"
                      >
                        登 录
                  </el-button>
              </el-form>
          </div>
          <div class="footer-tips">
            <div class="form_bottom" style="margin-top: 13px">
              <div class="disp_flex ali_cen">
                <el-checkbox v-model="isagree"></el-checkbox>
                <div style="font-size: 14px; margin-left: 10px">
                  已阅读并同意 
                  <el-link
                    :underline="false"
                    class="blueText"
                    @click="jumpHtml('/yhxy.html')"
                    >用户协议</el-link
                  >
                  和
                  <el-link
                    :underline="false"
                    class="blueText"
                    @click="jumpHtml('/ystk.html')"
                    >隐私条款</el-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!--<footer>
      <p>
        助力中国通信维护领域降本增效 ｜
        <el-link underline href="https://hainacssp.com/">产品官网</el-link> ｜
        联系电话：400-6298080
      </p>
      <p><el-link underline href="https://beian.miit.gov.cn/#/Integrated/recordQuery">晋ICP备18012485号-5</el-link> 2022 海纳实业控股集团有限公司</p>
    </footer> -->
  </div>
</template>
<script>
import {
  title,
  prefix,
  serverMock,
  loginWhite,
  allowRegister,
} from "@/settings";
import "element-ui/lib/theme-chalk/display.css";
import store from "@/store";

export default {
  data() {
    return {
      rightBgWhite: loginWhite,
      allowRegister: allowRegister,
      title: title,
      action: "login",
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名/邮箱",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: "密码的长度在6-16位之间",
            trigger: "blur",
          },
        ],
      },
      loading: false,
      isremember: false,
      isagree: true,
      loginFormStyle: {},
      redirect: "",
      options:[{
        label:'账号登录',
        value:'login'
      },{
        label:'短信登录',
        value:'sms_login',
        disabled:true
      }],
      readonly:true
    };
  },
  // watch: {
  //     $route: {
  //         handler: function(route) {
  //             this.redirect = route.query && route.query.redirect;
  //         },
  //         immediate: true,
  //     },
  // },
  mounted() {
    let that = this;

    store.dispatch("user/resetToken");
    that.initer();

    that.$nextTick(() => {
      that.loginFormStyle = that.loginFormStyleFun();
    });
  },
  methods: {
    handlerIptClick(){
        this.readonly = false;
    },
    loginFormStyleFun() {
      let obj = {};
      let _height = window.innerHeight / 2;

      let height2 = 0;
      if (document.querySelector(".login-form"))
        height2 =
          _height - document.querySelector(".login-form").clientHeight / 1.5;
      if (height2 > 70) obj.marginTop = `${height2}px`;
      else obj.marginTop = `70px`;

      return obj;
    },
    initer() {
      let that = this;
      // that.form.username = localStorage.getItem(prefix + '_username') || '';
      // that.form.password = localStorage.getItem(prefix + '_password') ? decodeUnicode(localStorage.getItem(prefix + '_password')) : '';
      // if (that.form.username && that.form.password) that.isremember = true

      window.addEventListener("resize", () => {
        that.loginFormStyle = that.loginFormStyleFun();
      });
    },
    handleLogin() {
      let that = this;
      if (!that.isagree) {
        that.$message({
          type: "warning",
          message: "登录需同意用户协议和隐私条款",
        });
        return;
      }
      that.$refs.form.validate((valid) => {
        if (valid) {
          store.dispatch("user/resetToken");
          that.loading = true;
          store
            .dispatch("user/authLogin", {
              grant_type: "password",
              ...that.form,
              // type:1,   //平台1 企业2
            })
            .then((res) => {
              console.log(that.$store.getters);
              // localStorage.setItem( 'tenantId', res.operatorCompanyId)
              that.$message({
                type: "success",
                message: "登录成功",
              });
              // if (that.isremember) {
              // 	//存储密码
              // 	// localStorage.setItem(prefix + '_username', that.form.username)
              // 	// localStorage.setItem(prefix + '_password', encodeUnicode(that.form.password))
              // 	// that.$router.push({ path: that.redirect || '/' })
              // } else {
              that.$router.push({ path: "/china" });

              // }
            })
            .catch((err) => {
              that.loading = false;
            });
        }
      });
    },
    jump(route) {
      let that = this;
      that.$router.push(route);
    },
    jumpHtml: function (url) {
      let that = this;
      window.open(process.env.VUE_APP_BASE_URL+'/admin'+ url);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/login.scss";
</style>
<style>
#app,
body {
  height: 100vh !important;
}
</style>
