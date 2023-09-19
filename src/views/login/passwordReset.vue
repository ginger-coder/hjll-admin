<template>
  <div class="login-container" :class="[rightBgWhite ? 'bg-white' : '', allowRegister ? 'show_register' : '']">
    <div class="login-header">
        海久六灵数字维护共享平台
    </div>
    <div class="page-col-login">
        <div class="login-wrap">
            <div class="login-title2">忘记密码</div>
            <el-form ref="form" :model="form" :rules="rules" class="login-form disp_flex flex_column" label-position="left">
                <el-form-item prop="email" style="margin-top: 40px">
                  <el-input v-model.trim="form.email" tabindex="2" placeholder="请输入邮箱" class="el-input-box2"/>
                </el-form-item>
                <el-form-item prop="code">
                  <div class="disp_flex">
                    <el-input v-model.trim="form.code" :maxlength="6" :minlength="6" tabindex="3" auto-complete="off" :readonly='readonly'
                 @focus='handlerIptClick' placeholder="输入验证码" class="el-input-box2"/>
                    <el-button v-hold-click style="margin-left: -120px" class="sms-btn" @click="getCode" v-show="changebtn">{{ codecount }}
                    </el-button>
                    <el-button v-hold-click style="margin-left: -120px" class="sms-btn" v-show="!changebtn">{{ codecount }}</el-button>
                  </div>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model.trim="form.password" type="password" placeholder="8 - 16位密码，数字与字母的组合，区分大小写" tabindex="4"
                  auto-complete="off" :readonly='readonly' @focus='handlerIptClick' class="el-input-box2"/>
                  <!-- <el-input v-model.trim="form.password" class="el_input_type_pw" type="text" placeholder="8 - 16位密码，数字与字母的组合，区分大小写" tabindex="4" /> -->
                </el-form-item>
                <el-form-item prop="confirmPassword">
                  <el-input ref="confirmPassword" type="password" v-model.trim="form.confirmPassword" tabindex="5" class="el-input-box2"
                            placeholder="确认密码" auto-complete="new-password"/>
                  <!-- <el-input v-model.trim="form.confirmPassword" class="el_input_type_pw" type="text"  placeholder="确认密码" tabindex="5" ref="confirmPassword"/> -->
                </el-form-item>
                <div class="form_bottom disp_flex ju_bet ali_cen" style="margin-top: 20px">
                  <el-button :loading="loading" class="register-btn" type="primary" @click="submit">更换密码</el-button>
                  <div class="linkText" v-if="allowRegister" @click="jump('/login')">返回登录页面</div>
                </div>
            </el-form>
        </div>
    </div>
  </div>
</template>
<script>
import {title, prefix, serverMock, loginWhite, allowRegister} from "@/settings";
import {encodeUnicode, decodeUnicode} from "@/utils";
import {setToken} from "@/utils/auth";
import {password, email} from "../../utils/reg";
import {update_password, getEmailCode} from "@/api/auth";

export default {
  data() {
    return {
      rightBgWhite: loginWhite,
      allowRegister: allowRegister,
      title: title,
      readonly:true,
      form: {
        password: "",
        confirmPassword: '',
        email: "",
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入6位验证码",
            max: 6,
            min: 6
          },
        ],
        account: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入8-16位密码，数字与字母的组合，区分大小写",
            pattern: password
          },
        ],
        email: [
          {
            required: true,
            message: "请输入正确的邮箱",
            pattern: email
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
      changebtn: true
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
    handlerIptClick(){
        this.readonly = false;
    },
    loginFormStyleFun() {
      let obj = {};
      let _height = window.innerHeight / 2;

      let height2 = 0;
      if (document.querySelector(".login-form")) height2 = _height - document.querySelector(".login-form").clientHeight / 0.2;
      if (height2 > 70) obj.marginTop = `${height2}px`;
      else obj.marginTop = `70px`;

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
              this.changebtn = false
              let i = 60;
              let timer = setInterval(() => {
                this.codecount = i + "秒";
                i--;
                if (i < 0) {
                  this.btnbool = false;
                  this.changebtn = true
                  this.codecount = "获取验证码";
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
    submit() {
      let that = this;
      that.$refs.form.validate((valid) => {
        if (!valid) return false;
        that.loading = true;

        update_password({method: "post"}, {}, {...that.form})
            .then((res) => {
              that.loading = false;
              that.$router.push("/login");
              that.$message({
                type: "success",
                message: res.msg,
              });
            })
            .catch((err) => {
              // that.$message({
              // 	type: "warning",
              // 	message: '请填写内容',
              // });
              that.loading = false;
              console.log("err", err);
            });
      });
    },
    jump(route) {
      let that = this;
      that.$router.push(route);
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
</style>
<style lang="scss" scoped>
#app,
body {
  height: 100vh !important;

}

// 解决密码框自动输入问题
.el_input_type_pw input {
  -webkit-text-security: disc !important;
  text-security: disc !important;
}
</style>
