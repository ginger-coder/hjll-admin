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
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="姓名：" prop="nickName" required>
          <el-input placeholder="请输入姓名" clearable v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop="keyword">
          <upload-pics class="upload_pics logo" :max="1" :maxSize="'1024'" v-model="form.avatarUrl"
                       @success="to_set_pics($event, 'avatarUrl')"></upload-pics>
        </el-form-item>
        <el-form-item label="身份证号：" prop="card">
          <el-input placeholder="请输入身份证号" clearable v-model="form.card"></el-input>
        </el-form-item>
        <el-form-item label="身份证照片：" prop="cardUrl">
          <upload-pics class="upload_pics" :width="240" :height="100" :max="1" :maxSize="'1024'" v-model="form.cardUrl"
                       @success="to_set_pics($event, 'cardUrl')"></upload-pics>
        </el-form-item>
        <el-form-item label="选择工作地区：" prop="keyword">
          <!--          <el-select-->
          <!--              v-model="form.region"-->
          <!--              placeholder="请选择工作地区"-->
          <!--              style="width: 100%"-->
          <!--          >-->
          <!--            <el-option-->
          <!--                v-for="item in options"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->
          <area-select style="width: 100%" @change="changeArea($event)"
                       :value="[form.province, form.city, form.area]"></area-select>
        </el-form-item>
        <el-form-item label="选择角色：" prop="role">
          <el-select v-model="form.role" multiple placeholder="请选择(多选)" style="width: 100%">
            <el-option v-for="item in roleOp" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status !== '1'"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择技能：" prop="skill">
          <el-select v-model="form.skill" multiple placeholder="请选择(多选)" style="width: 100%">
            <el-option v-for="item in skillOp" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status !== '1'"/>
          </el-select>
        </el-form-item>
        <el-form-item label="技能相关证书：" prop="keyword">
          <template v-for="(item, idx) in []">
            <el-select v-model="item.type" multiple placeholder="请选择(多选)" style="width: 100%">
              <el-option v-for="item in certOp" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <upload-files ref="upload1" upload-accept="image/png,image/jpg,.pdf" :max="1" :maxSize="'1024'"
                          v-model="form.attaches" @success="to_set_pics($event, 'certificate')"
                          style="margin-top: 0.6rem">
            </upload-files>
            <div class="disp_flex ali_cen">
              <div class="tips el-info">支持扩展名：.pdf .jpg .png</div>
              <div v-if="idx > 0" class="btn-remove" @click="form.cert.list.splice(idx, 1)">删除</div>
            </div>
          </template>
          <div v-hold-click class="cert-add" @click="add_cert">继续添加证书</div>
        </el-form-item>
        <el-form-item label="合同扫描件：" prop="keyword">
          <upload-files ref="upload2" upload-accept="image/png,image/jpg,.pdf" :max="1" :maxSize="'1024'"
                        v-model="form.contract" @success="to_set_files($event, 'contract')"></upload-files>
          <div class="disp_flex ali_cen">
            <div class="tips el-info">支持扩展名：.pdf .jpg .png</div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="divider"></div>
        </el-form-item>
        <el-form-item label="手机：" prop="mobile" required>
          <el-input placeholder="请输入作为账号的手机" clearable v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="loginPassword" required>
          <el-input type="password" placeholder="请输登录的密码" clearable v-model="form.loginPassword"
                    auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label=" " style="margin-top: 40px">
          <el-button :loading="loading" v-hold-click type="primary" @click="submit" style="min-width: 180px">{{
              hasId ? '保存' : '提交并创建运维人员账号'
            }}
          </el-button>
          <div style="height: 60px"></div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";

import uploadPics from "@/components/custom/uploadPics";
import uploadFiles from "@/components/custom/uploadFile";
import {create, update, info} from "@/api/omp";
import AreaSelect from "@/components/custom/areaSelect";
import * as role from "@/api/workRole";
import * as skill from "@/api/workSkill";
import {verifyMobile, verifyIdCard} from "@/api/omp";
import {validMobile, validPass} from "@/utils/validate";

export default {
  components: {
    AreaSelect,
    uploadPics,
    uploadFiles,
  },
  data() {
    return {
      id: '',
      // pageFun: () => {
      //   const {id} = this.$route.query;
      //   return `${id}`.length > 0 && id ? info : Promise.reject()
      // },
      loading: false,
      moduleTitle: "账号",
      apiKey: "adminId",

      title: "",
      titleTips: "",
      form: {
        province: "",
        city: "",
        area: "",
        avatarUrl: [],
        card: '',
        cardUrl: [],
        workRoleId: [],
        workSkillId: [],
        skill: [],
        role: [],
        cert: {
          list: [
            {type: undefined, value: ''}
          ]
        },
        loginPassword: '',
      },
      rules: {
        nickName: [
          {required: true, message: "请输入姓名", trigger: 'change'},
          {required: true, message: "请输入姓名", trigger: 'blur'},
        ],
        role: [
          {required: true, message: "请选择角色", trigger: 'blur'},
        ],
        mobile: [
          {validator: this.validateMobile, trigger: 'blur'},
          {required: true, message: "请输入手机号", trigger: 'change'},
          {required: true, message: "请输入手机号", trigger: 'blur'},
        ],
        loginPassword: [
          // { validator: this.validatePass, trigger: 'blur' },
          {required: true, message: "请输入密码", trigger: 'change'},
          {required: true, message: "请输入密码", trigger: 'blur'},
        ],
        card: [
          {required: true, validator: this.validateIdCard, trigger: 'blur'},
        ],
      },
      roleOp: [],
      skillOp: [],
      certOp: []
    };
  },
  mixins: [basic],
  async created() {
    const {id} = this.$route.query;
    this.id = id;
    this.title = `${this.hasId ? '编辑' : '新增'}运维人员信息`;
    this.titleTips = this.hasId ? "如果运维人员不方便自己修改信息，可在此页面帮助运维人员修改" : "如果运维人员不方便直接注册和认证，可在后台直接给运维人员生成一个账号";

    role.page(null, {current: 1, size: 999}).then(t => {
      this.roleOp = t.data.records;
    });
    skill.page(null, {current: 1, size: 999}).then(t => {
      this.skillOp = t.data.records;
    });

    if (this.hasId) {
      const {umsMember, signInfoMessageVo} = await info({userId: id});

      const data = {...umsMember, ...signInfoMessageVo}
      if (this.hasId) {
        data.avatarUrl = [data.avatarUrl];
        data.cardUrl = [data.cardUrl];
        // data.role = data.role ? data.role.split(',') : [];
        // data.skill = data.skill ? data.skill.split(',') : [];
        data.role = data.roleId ? data.roleId.split(',').map(id=>Number.parseInt(id)) : [];
        data.skill = data.skillId ? data.skillId.split(',').map(id=>Number.parseInt(id)) : [];
        data.cert = {
          list: [
            {type: undefined, value: ''}
          ]
        };
      }
      this.form = data;
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
    changeArea({province, city, area}) {
      this.form.province = province;
      this.form.city = city;
      this.form.area = area;
    },
    validatePass(rule, value, callback) {
      if (!validPass(value)) {
        callback(new Error('密码格式为8-16位数字与字母的组合'))
      }
      callback()
    },
    async validateMobile(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入手机号'))
      }
      if (!validMobile(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        try {
          await verifyMobile({phone: value, userId: this.id});
        } catch (e) {
          callback("系统中存在相同的手机号")
        }
        callback()
      }
    },
    async validateIdCard(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback('请输入身份证号')
      } else {
        try {
          await verifyIdCard({card: value, userId: this.id});
        } catch (e) {
          callback()
        }
      }
      callback()
    },
    add_cert(){
      this.form.cert.list.push({ type: undefined, value: '' })
    },
    submit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.loading = true;

          const data = {...this.form};
          data.avatarUrl = (data.avatarUrl || [])[0];
          data.cardUrl = (data.cardUrl || [])[0];
          data.contract = (data.contract || [])[0];

          if (this.hasId) {
            update({}, data).then(code => {
              if (code ==  0) {
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
            data.workSkillId = data.skill;
            data.workRoleId = data.role;

            await create({}, data).then(code => {
              if (code ==  0) {
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

  .divider {
    height: 1px;
    background-image: linear-gradient(to right, #d1d2d9 0%, #d1d2d9 50%, transparent 0%);
    background-size: 14px 1px;
    background-repeat: repeat-x;
  }

  .cert-add {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 38px;
    border: 1px dashed #8f959e;
    background: #eaecf1;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background: #dadbe0;
    }
  }

  .ali_cen {
    display: flex;
    justify-content: space-between;

    .btn {
      &-remove {
        justify-content: center;
        display: flex;
        align-items: center;
        background: #4993f7;
        border-radius: 4px;
        color: white;
        width: 45px;
        height: 22px;
        text-align: center;
        margin-left: .3rem;
        font-size: 13px;

        &:hover {
          cursor: pointer;
        }
      }
    }
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
