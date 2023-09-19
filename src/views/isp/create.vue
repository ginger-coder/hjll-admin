<template>
  <div v-loading="loading">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
        <div class="titleTips">{{ titleTips }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <div class="scrllbar form_box">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="公司名称：" prop="companyName">
          <el-input placeholder="请输入公司名称" clearable v-model="form.companyName"></el-input>
        </el-form-item>
        <el-form-item label="公司logo：" prop="companyLogo">
          <upload-pics class="upload_pics logo" :max="1" :maxSize="'1024'" v-model="form.companyLogo"
                       @success="to_set_pics($event, 'companyLogo')"></upload-pics>
        </el-form-item>
        <el-form-item label="公司代码：" prop="companyShort">
          <el-input placeholder="请输入公司代码（组成要求：2-4位英文大写字母）" clearable v-model="form.companyShort" maxLength="4"></el-input>
        </el-form-item>
        <el-form-item label="营业执照注册号：" prop="licenseNumber">
          <el-input placeholder="请输入营业执照注册号" clearable v-model="form.licenseNumber"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：" prop="license">
          <upload-pics class="upload_pics" :width="240" :height="100" :max="1" :maxSize="'1024'" v-model="form.license"
                       @success="to_set_pics($event, 'license')"></upload-pics>
        </el-form-item>
        <el-form-item label="授权书：" prop="authorization">
          <upload-files ref="upload1" upload-accept="image/png,image/jpg,.pdf,.xlsx" :max="1" :maxSize="'1024'"
                        v-model="form.authorization" @success="to_set_files($event, 'authorization')"></upload-files>
          <div class="disp_flex ali_cen">
            <div class="tips el-info">支持扩展名：.pdf .jpg .png</div>
            <el-button type="text" class="text_btn" @click="fileTpl">下载授权书模板</el-button>
          </div>
        </el-form-item>
        <el-form-item label="法定代表人姓名：" prop="legalName">
          <el-input placeholder="请输入法定代表人姓名" clearable v-model="form.legalName"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人身份证号：" prop="legalIdcard">
          <el-input placeholder="请输入法定代表人身份证号" clearable v-model="form.legalIdcard" maxLength="18"></el-input>
        </el-form-item>
         <!-- <el-form-item label="用户名：" prop="username" required>
          <el-input placeholder="请输入作为账号的用户名" clearable v-model="form.username"></el-input>
        </el-form-item>
       <el-form-item label="邮箱：" prop="email">
          <el-input placeholder="请输入作为账号的邮箱" clearable v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="passWord" required>
          <el-input type="password" placeholder="请输入登陆的密码,8-16位数字与字母的混合" clearable
                    v-model="form.passWord" auto-complete="new-password"></el-input> -->
						<!-- <el-input v-model.trim="form.passWord" class="el_input_type_pw" type="text" placeholder="8 - 16位密码，数字与字母的组合，区分大小写" /> 

        </el-form-item>-->
        <el-form-item label=" " style="margin-top: 40px">
          <el-button v-hold-click type="primary" @click="submit" >
             确定
          </el-button>
          <el-button v-hold-click  @click="back">取消</el-button>
          <div style="height: 60px"></div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {info, create, update, verifyUserName, verifyEmail, verifyCompanyName, verifyLicenseNumber, companyDetail, updateUser} from "@/api/isp";

import {ispStatus} from "@/utils/dict";
import uploadPics from "@/components/custom/uploadPics";
import uploadFiles from "@/components/custom/uploadFile";
import {validEmail, validPass,validNum} from "@/utils/validate";
import {  BASE_UPLOAD } from "@/config";
import { thisExpression, thisTypeAnnotation } from "@babel/types";
export default {
  components: {
    uploadPics,
    uploadFiles,
  },
  data() {
    let numRule = (rule, value, callback) => {
        if (value) {
            if (!validNum(value)) {
                callback(new Error("请输入正确的公司代码"));
            } else {
                callback();
            }
        } else {
            callback(new Error("请输入正确的公司代码"));
        }
    };
    return {
			baseUpload: BASE_UPLOAD,
      id: '',
      userId: '',
      sysUser:{},
      loading: false,
      // pageFun: () => {
      //   const {id} = this.$route.query;
      //   return `${id}`.length > 0 && id ? ispManager({name: 'info'}, {id}) : Promise.reject()
      // },
      moduleTitle: "账号",
      apiKey: "adminId",

      title: "",
      titleTips: "",
      form: {
        companyName: '',
        companyShort: '',
        passWord: '',
        email: '',
        companyLogo: [],
        authorization: [],
        licenseNumber: '',
        license: [],
        legalName: '',
        legalIdcard: '',
        certificationTime: '',
        verificationMethod: ''
      },
      rules: {
        companyName: [
          {validator: this.validateCompanyName, trigger: 'blur'},
          {required: true, message: "请输入公司名称", trigger: 'change'}
        ],
        companyShort: [
          {required: true, message: "请输入公司代码", trigger: 'blur'},
          {validator: numRule, trigger: 'blur'},
        ],
        licenseNumber: [
          {validator: this.validateLicenseNumber, trigger: 'blur'},
        ],
        username: [
          {validator: this.validateUserName, trigger: 'blur'},
          {required: true, message: "请输入用户名", trigger: 'change'}
        ],
        passWord: [
          {validator: this.validatePass, trigger: 'blur'},
          {required: true, message: "请输入密码", trigger: 'change'}
        ],
        email: [
          {validator: this.validateEmail, trigger: 'blur'},
        ],
      },
    };
  },
  mixins: [basic],
  async created() {
    const {id,userId} = this.$route.query;
    this.id = id;
    this.userId = userId;
    this.title = `${this.hasId ? '编辑' : '新增'}运营商信息`;
    this.titleTips = this.hasId ? "如果运营商不方便自己修改信息，可在此页面帮助运营商修改" : "如果运营商不方便直接注册和认证，可在后台直接给运营商生成一个账号";
    if (this.hasId) {
      const data = await companyDetail({},{companyInfoId:this.id,userId:this.userId});
      
      let {companyInfo, sysUser} = data.data
      console.log(companyInfo);
      this.sysUser = sysUser
      
      // this.form = {
      //   ...companyInfo,
      //   companyLogo: [companyInfo.companyLogo]
      // }
      if (this.hasId) {
        // companyInfo.email = sysUser.email || '';
        // companyInfo.username = sysUser.username || '';
        companyInfo.companyLogo = [companyInfo.companyLogo];
        companyInfo.license = [companyInfo.license];
        companyInfo.authorization = [companyInfo.authorization];
      }
      this.form = companyInfo;
    }
  },
  computed: {
    hasId() {
      return `${this.id}`.length > 0 && this.id
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    to_set_pics(files, key) {
      this.form[key] = files;
    },
    to_set_files(files, key) {
      let lists = [];
      if (files && files.length) {
        lists = files.filter(f => f.response && f.response.data).map(f => f.response.data)
      }
      this.form[key] = lists;
    },
    async validateCompanyName(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入公司名称'))
      } else {
        try {
          await verifyCompanyName({companyName: value,id:this.id});

        } catch (e) {
          // callback()
          callback(new Error('系统中存在同名供应商'));
        }
        // callback()
      }
    },
    async validateLicenseNumber(rule, value, callback) {
      if (value !== '' && value !== undefined) {
        try {
          await verifyLicenseNumber({licenseNumber: value,id:this.id});
        } catch (e) {
          callback(new Error('系统中存在相同的营业执照注册号'))
        }
        callback()
      }
    },
    async validateUserName(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入用户名'))
      } else {
        try {
          await verifyUserName({userName: value,userId:this.userId});
        } catch (e) {
          callback(new Error('用户名已存在'))
        }
        callback()
      }
    },
    validatePass(rule, value, callback) {
      if (!validPass(value)) {
        callback(new Error('密码格式为8-16位数字与字母的组合'))
      }
      callback()
    },
    fileTpl() {
      const url = `${this.baseUpload}/%E8%B4%A6%E5%8F%B7%E8%BF%90%E8%90%A5%E6%8E%88%E6%9D%83%E4%B9%A6.doc`;
      window.open(url);
    },
    async validateEmail(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback()
      }else{
          try {
            await verifyEmail({email: value,userId:this.userId});
          } catch (e) {
            callback(new Error('邮箱已存在'))
          }
          callback()
      }
    },
    submit() {
      var that = this
      this.$refs["form"].validate( (valid) => {
        if (valid) {
          if(this.form.legalIdcard.length>0){
            var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if(!reg.test(this.form.legalIdcard)){
                return this.$message({
                  type: "warning",
                  message: "法定代表人身份证号格式不正确",
                });
            }
          }
         
          this.loading = true;
          const data = {...this.form};
          data.companyLogo = (data.companyLogo || [])[0];
          data.license = (data.license || [])[0];
          data.authorization = (data.authorization || [])[0];
          if (this.hasId) {
            update( data).then(code => {
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: "更新成功",
                });
              }
            }).finally(() => {
              this.loading = false;
              this.back();
            })
          } else {
            create({}, data).then(code => {
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: "创建成功",
                });
              }
            }).finally(() => {
              this.loading = false;
              this.back();
            })
          }
        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  font-size: 0;
  position: relative;

  ::v-deep {
    .el-table {
      &::before {
        content: none;
      }
    }
  }
}

.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .back_box {
  }
}

.form_box {
  background-color: #ffffff;
  //height: calc(100% - 80px);
  margin-top: 40px;
  border-radius: 4px;

  .el-form {
    width: 50%;
    min-height: 800px;
    margin: 0 auto;
    padding-top: 40px;
  }

  .text_btn {
    text-decoration: underline;
    margin-left: 1rem;
  }
}

.upload_pics {
  width: 240px;
  height: 120px;
}

.logo {
  width: 80px;
  height: 80px;
}

.footer {
  height: 80px;
}
</style>
