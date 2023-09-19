<template>
  <div class="login-container" :class="[rightBgWhite ? 'bg-white' : '', allowRegister ? 'show_register' : '']">
    <!-- <div class="page-col-bg"></div> -->
    <div class="page-col-login">
      <el-form ref="form" :model="form" :rules="rules" class="login-form disp_flex flex_column" label-position="left">
        <div class="header" :style="loginFormStyle">
          <div class="title">{{ title }}</div>
          <div class="title-tips">助力中国通信维护领域降本增效</div>
        </div>
        <div>
          <div class="form-header">注册</div>
          <el-form-item style="margin-top: 40px" prop="username">
            <el-input v-model.trim="form.username" placeholder="用户名" tabindex="1" type="text"/>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model.trim="form.email" tabindex="2" placeholder="邮箱"/>
          </el-form-item>
          <el-form-item prop="code">
            <div class="disp_flex">
              <el-input v-model.trim="form.code" :maxlength="6" :minlength="6" tabindex="3" placeholder="输入验证码"/>
              <el-button v-hold-click style="margin-left: 20px" @click="getCode" v-show="changeget">{{ codecount }}
              </el-button>
              <el-button v-hold-click style="margin-left: 20px" v-show="!changeget">{{ codecount }}</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model.trim="form.password" type="password" placeholder="8 - 16位密码，数字与字母的组合，区分大小写" tabindex="4"
                      auto-complete="new-password"/>
            <!-- <el-input v-model.trim="form.password" class="el_input_type_pw" type="text" placeholder="8 - 16位密码，数字与字母的组合，区分大小写" tabindex="4" /> -->

          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input ref="confirmPassword" type="password" v-model.trim="form.confirmPassword" tabindex="5"
                      placeholder="确认密码" auto-complete="new-password"/>
            <!-- <el-input v-model.trim="form.confirmPassword" class="el_input_type_pw" type="text"  placeholder="确认密码" tabindex="5" ref="confirmPassword" /> -->

          </el-form-item>
          <div class="form_bottom disp_flex ju_bet ali_cen" style="margin-top: 20px">
            <el-button :loading="loading" class="register-btn" type="primary" @click="submitRegister"> 注 册</el-button>
            <div class="blueText" v-if="allowRegister" @click="toLogin">使用已有账户登录</div>
          </div>
        </div>
        <div class="footBar">
          <div class="disp_flex foot_txt_box ju_bet">
            <div class="foot_text">帮助</div>
            <div class="foot_text">隐私</div>
            <div class="foot_text">条款</div>
          </div>
          <div class="foot_text">copyright ©️ 2022 海纳实业控股集团有限公司</div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import {title, prefix, serverMock, loginWhite, allowRegister} from "@/settings";
import {encodeUnicode, decodeUnicode} from "@/utils";
import {setToken} from "@/utils/auth";
import {password, email} from "../../utils/reg";

import {validMobile, validEmail} from "@/utils/validate";
import {getEmailCode, register} from "@/api/auth";
import store from "@/store";
import { BASE_API, BASE_URL } from "@/config";
export default {
  data() {
    let emailRule = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      rightBgWhite: loginWhite,
      allowRegister: allowRegister,
      title: title,

      form: {
        username: "",
        password: "",
        confirmPassword: '',
        email: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            validator: emailRule,
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "输入验证码",
            trigger: "blur",
            min: 6,
            max: 6
          },
        ],
        password: [
          {
            required: true,
            message: "请输入8-16位密码，数字与字母的组合，区分大小写",
            pattern: password,
            trigger: "blur",
          },
        ],
        confirmPassword: [
          // {
          // 	required: true,
          // 	message: "请输入密码",
          // 	trigger: "blur",
          // },
          {
            validator: this.confirmpass, trigger: 'blur'
          }
        ],
      },
      loading: false,
      isremember: false,
      loginFormStyle: {},
      redirect: "",
      codecount: '获取验证码',
      btnbool: 'false',
      changeget: true
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

    that.initer();

    that.$nextTick(() => {
      that.loginFormStyle = that.loginFormStyleFun();
    });
  },
  methods: {
    loginFormStyleFun() {
      let obj = {};
      let _height = window.innerHeight / 2;

      let height2 = 0;
      if (document.querySelector(".login-form")) height2 = _height - document.querySelector(".login-form").clientHeight / 0.2;
      if (height2 > 70) obj.marginTop = `${height2}px`;
      else obj.marginTop = `45px`;

      return obj;
    },
    initer() {
      let that = this;
      window.addEventListener("resize", () => {
        that.loginFormStyle = that.loginFormStyleFun();
      });
    },
    getCode: function () {
      let that = this;
      if (that.form.email) {
        getEmailCode({method: "post"}, {}, {sendTo: that.form.email})
            .then((res) => {
              that.$message({
                type: "success",
                message: "验证码发送成功",
              });
              this.btnbool = true;
              this.changeget = false
              let i = 60;
              let timer = setInterval(() => {
                this.codecount = i + "秒";
                i--;
                if (i < 0) {
                  this.btnbool = false;
                  this.changeget = true
                  this.codecount = "重新发送";
                  clearInterval(timer);
                }
              }, 1000);
            })
            .catch((error) => {
              console.log(error);
              that.$message({
                type: "error",
                message: error.msg,
              });
            });
      } else {
        that.$message({
          type: "warning",
          message: "请输入邮箱",
        });
      }
    },
    submitRegister() {
      let that = this;
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true;

          register({method: "post"}, {}, {...that.form})
              .then((res) => {
                that.$message({
                  type: "success",
                  message: res.msg,
                });
                store.dispatch("user/authLogin", {
                  grant_type: "password",
                  username: that.form.username,
                  password: that.form.password
                }).then((res) => {
                  that.loading = false;
                  that.$router.push("/registerPass");
                });
              })
              .catch((err) => {
                that.$message({
                  type: "warning",
                  message: err.msg,
                });
                that.loading = false;
              });
        }
      });
    },
    toLogin() {
      let that = this;

      that.$router.push("/login");
    },
    confirmpass(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/login.scss";

#app,
body {
  height: 100vh !important;
}

.register_item {
  background-color: #fff;
  padding: 30px 88px 40px 88px;
  border-radius: 10px;
}

.footBar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px !important;

  .el-link-text, .foot_text {
    padding-left: 10px;
    padding-right: 10px;
  }

  .foot_text {
    color: #333;
  }
}


</style>
