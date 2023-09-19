<template>
  <div style="height: 100%">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <div class="scrllbar form_box" v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="公司名称：" prop="companyName">
          <span>{{ form.companyName || '-' }}</span>
        </el-form-item>
        <el-form-item label="公司简称：" prop="companyShort">
          <span>{{ form.companyShort || '-' }}</span>
        </el-form-item>
        <el-form-item label="营业执照注册号：" prop="licenseNumber">
          <span>{{ form.licenseNumber || '-' }}</span>
        </el-form-item>
        <el-form-item label="营业执照：" prop="license">
          <img :src="baseUpload+form.license" alt="" style="width: 240px;height: 100px;object-fit:cover;" :preview-src-list="[`${baseUpload+form.license}`]">
          <!-- <el-image :src="`${baseUpload+form.license}`" style="width: 240px;height: 100px"
                    fit="cover" :preview-src-list="[`${baseUpload+form.license}`]"></el-image> -->
        </el-form-item>
        <el-form-item label="授权书：" prop="authorization">
          <el-button type="text" class="text_btn" v-if="form.authorization" @click="view(form.authorization)">
            点击查看
          </el-button>
          <span v-else>-</span>
        </el-form-item>
        <el-form-item label="验证方式：" prop="verificationMethod">
          <span>{{ label(verifyWay, form.verificationMethod) }}</span>
          <el-tag class="verify-status" effect="dark"
                  :type="`${form.checkStatus}` === '1' ? 'success': (`${form.checkStatus}` === '2' ? 'danger':'warning')">
            {{ label(verifyState, form.checkStatus) }}
          </el-tag>
        </el-form-item>
<!--        <el-form-item v-if="!isInfo && `${form.checkStatus}` !== `1`" label="验证金额：" prop="money">
          <el-input placeholder="请输入金额" clearable v-model="form.moneyInput"></el-input>
        </el-form-item>-->
        <el-form-item label="提交时间：" prop="keyword">
          <span>{{ parse_time(new Date(form.createTime).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-" }}</span>
        </el-form-item>
        <div v-if="!isInfo" class="btns">
          <el-button v-hold-click type="danger" @click="reject.visible=true">
            拒绝
          </el-button>
          <el-button v-hold-click type="primary" @click="resolve.visible=true">
            通过
          </el-button>
          <div style="height: 60px"></div>
        </div>
<!--        <div v-else v-if="!isInfo" class="btns">-->
<!--          <el-button v-if="`${form.checkStatus}` === `2`" v-hold-click type="danger" @click="reject.visible=true">-->
<!--            拒绝-->
<!--          </el-button>-->
<!--          <el-button v-if="`${form.checkStatus}` !== `1`" v-hold-click type="primary" @click="doVerify">-->
<!--            金额验证-->
<!--          </el-button>-->
<!--        </div>-->
      </el-form>
    </div>
    <div class="footer"></div>

    <!--   拒绝   -->
    <el-dialog :visible.sync="reject.visible" title="填写拒绝原因" width="40%" :before-close="closeReject">
      <div class="reject-reason">
        <span>拒绝原因: </span>
        <div class="reasons">
          <div style="width: 100%">
            <div v-for="(v,idx) in reject.reasons" style="display: flex;align-items: center">
              <el-input
                  :rows="2"
                  type="textarea"
                  placeholder="请输入"
                  v-model="v.value">
              </el-input>
              <svg-icon :icon-class="'close'" v-if="idx > 0" v-hold-click @click="reject.reasons.splice(idx,1)"
                        :class-name="'svg'"/>
              <div v-else class="svg"></div>
            </div>
          </div>

          <el-button @click="reject.reasons.push({value:''})">增加拒绝原因</el-button>
        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeReject(false)">取消</el-button>
        <el-button type="primary" @click="closeReject(true)">确认</el-button>
      </span>
      </template>
    </el-dialog>

    <!--  通过   -->
    <el-dialog :visible.sync="resolve.visible" title="确定要通过审核吗？" width="30%">
      <div style="height: 70px"></div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeResolve(false)">取消</el-button>
        <el-button type="primary" @click="closeResolve(true)">确认</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {info, audit, verifyMoney} from "@/api/isp";
import {  BASE_UPLOAD } from "@/config";

import {getLabel, ispStatus} from "@/utils/dict";
import uploadPics from "@/components/custom/uploadPics";
import uploadFiles from "@/components/custom/uploadFile";
import {parseTime} from "@/utils";

export default {
  components: {
    uploadPics,
    uploadFiles,
  },
  data() {
    return {

			baseUpload: BASE_UPLOAD,
      id: '',
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
        email: '',
        companyLogo: '',
        licenseNumber: '',
        license: '',
        legalName: '',
        legalCard: '',
        certificationTime: '',
        verificationMethod: ''
      },
      rules: {},
      resolve: {
        visible: false
      },
      reject: {
        visible: false,
        reasons: [{value: ''}]
      },
      verifyWay: ispStatus.verifyWay,
      verifyState: ispStatus.verify,
      loading:false
    };
  },
  mixins: [basic],
  async created() {
    const {id} = this.$route.query;
    this.id = id;
    this.title = `运营商审核${this.isInfo ? '详情' : ''}`;
    this.loading=true;
    if (this.hasId) {
      const {companyInfo} = await info({id});
      this.form = {...companyInfo, moneyInput: ''};
      this.loading=false;
      // this.form = {
      //   companyInfo: {
      //     ...companyInfo,
      //     companyLogo: [companyInfo.companyLogo]
      //   }
      // }
    }
  },
  computed: {
    hasId() {
      return `${this.id}`.length > 0 && this.id
    },
    isInfo() {
      return `${this.$route.path}`.indexOf("ispAuditInfo") > -1;
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    label(list, value) {
      return getLabel(list, value)
    },
    parse_time(date, fmt) {
      return parseTime(date, fmt);
    },
    view(url = '') {
      url && window.open(`${this.baseUpload+url}`)
    },
    async doVerify() {
      const money = Number.parseFloat(this.form.moneyInput);

      if (!Number.isNaN(money)) {
        await verifyMoney({}, {id: this.form.id, money});
        const {companyInfo} = await info({id: this.form.id});
        this.form = companyInfo;
      }
    },
    async closeResolve(handle) {
      this.resolve.visible = false;

      if (handle && this.hasId) {
        const code = await audit({
          id: this.id,
          authenStatus: 1,
        })
        this.$message({
          message: code === 0 ? '操作成功' : '操作失败',
          type: code === 0 ? 'success' : 'error'
        })
        this.back();
      }
    },
    async closeReject(handle) {
      this.reject.visible = false;
      const reasons = {...this.reject.reasons};
      this.reject.reasons = [{value: ''}]

      if (handle && typeof handle === 'boolean' && this.hasId) {
        const code = await audit({
          id: this.id,
          authenStatus: 2,
          reason: reasons[0].value
        })
        this.$message({
          message: code === 0 ? '操作成功' : '操作失败',
          type: code === 0 ? 'success' : 'error'
        })
        this.back();
      }
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__footer {
    box-shadow: none;
  }
}

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
  min-height: 500px;
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
  }

  span {
    color: rgb(192, 192, 192);
  }

  .verify-status {
    color: #fff;
    margin-left: 2rem;
    height: 30px;
  }

  .btns {
    margin-top: 40px;
    display: flex;
    justify-content: center;

    button {
      padding: 0;
      margin: 0;
      height: 40px;
      min-width: 180px;

      &:first-child {
        margin-right: 3rem;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: end;
}

.reject-reason {
  display: flex;

  span {
    min-width: 70px;
    margin-right: 10px;
    margin-top: 10px;
  }

  button {
    width: 100%;
    margin-top: 10px;
  }

  .reasons {
    width: 100%;
    max-height: 500px;
    overflow: scroll;

    div {
      margin-bottom: 10px;
    }

    .svg {
      width: 30px;
      height: 30px;
      margin-left: .5rem;
      margin-top: -10px;
      color: #e3e3e3;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.footer {
  height: 80px;
}
</style>
