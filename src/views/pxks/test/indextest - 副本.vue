<template>
  <div>
    <el-card shadow="hover" style="margin-bottom: 24px" :body-style="{padding: '16px 20px 0 20px'}">


      <el-form ref="form" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="试题类型">
          <el-select v-model="formInline.questionBankTypeId" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-select v-model="formInline.status">
            <el-option v-for="el in statusMap" v-bind="{...el}" :key="el.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间段">
          <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="试卷名称">
          <el-input placeholder="搜索试卷" v-model="formInline.testPaperName" style="width:300px">
            <!--           <template slot="append">-->
            <!--             <el-button type="primary" @click="onSubmit">搜索</el-button>-->
            <!--           </template>-->
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="onSubmit" type="primary">搜索</el-button>
          <el-button @click="resetField" type="primary" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="flex" shadow="hover" :body-style="{paddingBottom: '10px'}">
      <div slot="header" class="disp_flex ali_cen ju_bet">
        全部内容
        <el-button
            @click="dialogVisible = true"
            type="primary"
            icon="el-icon-plus"
        >创建试卷
        </el-button>
      </div>

      <div class="test-grid" v-if="testlist && testlist.length">
        <div class="item" v-for="(item, index) in testlist"
             :key="item.id + '_' + index">
          <el-image
              @click="edit(item.id)"
              style="width: 100%; height: 150px"
              :src="BASE_UPLOAD + item.testPaperImage"
              :onerror="defaultImg"
          />
          <div class="">
            <div class="p10">
              <h4 class="disp_flex ali_cen ju_bet">
                <span class="testPaperName"> {{ item.testPaperName }} </span>

                <el-switch
                    :key="item.status +'_'+ index"
                    :value="item.status"
                    :active-value="statusMap[0].value"
                    :inactive-value="statusMap[1].value"
                    @change="(e) => newstatus(e, item)"
                />
              </h4>
              <p>{{ item.createTime | date }}</p>
              <p>{{ item.answerPeople || 0 }}人已作答</p>
            </div>

            <div class="disp_flex ju_bet footer-btn">
              <i class="el-icon-setting cc" @click="settest(item.id)"/>
              <i class="el-icon-time cc" @click="hy(item.id)"/>
              <i class="el-icon-share cc" disabled/>
              <i class="el-icon-delete cc" @click="del(item.id)"/>
            </div>
          </div>
        </div>
      </div>
<!--      <template v-if="false">-->
<!--        <el-row :gutter="24" v-if="testlist && testlist.length">-->
<!--          <el-col class="b-el-col br" :span="6" :xs="12" :sm="8" :md="6" :lg="6" :xl="4"-->
<!--                  v-for="(item, index) in testlist"-->
<!--                  :key="item.id + '_' + index"-->
<!--          >-->
<!--            <div class="item">-->
<!--              <el-image-->
<!--                  @click="edit(item.id)"-->
<!--                  style="width: 100%; height: 150px"-->
<!--                  :src="BASE_UPLOAD + item.testPaperImage"-->
<!--                  :onerror="defaultImg"-->
<!--              />-->
<!--              <div class="">-->
<!--                <div class="p10">-->
<!--                  <h4 class="disp_flex ali_cen ju_bet">-->
<!--                    <span class="testPaperName"> {{ item.testPaperName }} </span>-->

<!--                    <el-switch-->
<!--                        :key="item.status +'_'+ index"-->
<!--                        :value="item.status"-->
<!--                        :active-value="statusMap[0].value"-->
<!--                        :inactive-value="statusMap[1].value"-->
<!--                        @change="(e) => newstatus(e, item)"-->
<!--                    />-->
<!--                  </h4>-->
<!--                  <p>{{ item.createTime | date }}</p>-->
<!--                  <p>{{ item.answerPeople || 0 }}人已作答</p>-->
<!--                </div>-->

<!--                <div class="disp_flex ju_bet footer-btn">-->
<!--                  <i class="el-icon-setting cc" @click="settest(item.id)"/>-->
<!--                  <i class="el-icon-time cc" @click="hy(item.id)"/>-->
<!--                  <i class="el-icon-share cc" disabled/>-->
<!--                  <i class="el-icon-delete cc" @click="del(item.id)"/>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </template>-->

      <el-empty v-else description="暂无数据"/>
    </el-card>
    <el-dialog
        title="创建试卷"
        :visible.sync="dialogVisible"
        destroy-on-close
        width="30%"
        :before-close="handleClose"
    >
      <el-form class="demo-ruleForm" :rules="rules" :model="Form" label-width="100px" ref="ruleForm">
        <el-form-item label="试卷名" prop="testPaperName">
          <el-input
              placeholder="请输入试卷名称"
              v-model.trim="Form.testPaperName"
              style="max-width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="试卷分类" prop="questionBankTypeId">
          <el-select v-model="Form.questionBankTypeId" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button :loading="addLoading" @click="dialogVisible = false">取 消</el-button>
          <el-button :disabled="addLoading" :loading="addLoading" type="primary" @click="confirmtest">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {BASE_UPLOAD} from "@/config";
import {testpaper, tktypelist, test_paper_type, addtest, deltest, savepapertopStatus} from "@/api/pxks";
import moment from "moment";
import {statusMap} from '../config'


export default {
  mounted() {
    this.testpaper();
  },
  data() {
    return {
      statusMap,
      defaultImg: 'this.src="' + require('../../../assets/moen.png') + '"',
      value1: '',
      value: '0',
      BASE_UPLOAD,
      dialogVisible: false,
      addLoading: false,
      options: [],
      Form: {
        status: 0,
        testPaperName: undefined,
        questionBankTypeId: undefined,
      },
      rules: {
        testPaperName: [{required: true, message: '请输入名称'}],
        questionBankTypeId: [{required: true, message: '请选择'}],
      },
      testlist: [],
      formInline: {
        testPaperName: '',
        questionBankTypeId: '',
        status: ''
      },
    };
  },
  filters: {
    date(val) {
      return moment(val).format('yyy-MM-DD')
    },
  },
  methods: {
    settest(ids) {
      this.$router.push(`/testTrain/TestList/settest/?id=${ids}`);
    },
    edit(ids) {
      this.$router.push(`/testTrain/TestList/testpaper/?id=${ids}`);
    },
    hy(ids) {
      this.$router.push(`/testTrain/TestList/log/?id=${ids}`);
    },
    async confirmtest() {
      if (this.addLoading) return false;
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return false;
        this.addLoading = true;
        await addtest({
          ...this.Form,
          testPaperTypeCode: this.Form.questionBankTypeId
        })
            .then(async res => {
              const status = res?.data;
              const msg = res?.msg || (status ? '操作成功' : '操作失败');
              this.$message[status ? 'success' : 'error'](msg)
              if (status) {
                this.dialogVisible = false;
                this.Form = {
                  status: 0,
                  testPaperName: "",
                  questionBankTypeId: "",
                }
                this.testpaper();

              }
              this.addLoading = false;
            });
      });


    },
    async del(id) {
      this.$confirm("确定删除该数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const data = await deltest(id);
        this.testpaper();
      });
    },
    async newstatus(e, val) {

      savepapertopStatus({
        ...val,
        status: e,
      }).then(res => {
        const {data, msg} = res;
        this.$message[data ? 'success' : 'error'](msg)
        if (data) {
          this.testpaper()
        }
      })

    },
    async testpaper() {
      const datas = await testpaper({page: 1, size: 999});
      this.testlist = datas?.data?.records || [];
      if (!this.options?.length) {
        this.options = (await test_paper_type())?.data || [];
      }

    },
    handleClose(done) {
      this.$confirm("确认关闭？")
          .then((_) => {
            done();
          })
          .catch((_) => {
          });
    },
    resetField() {
      this.$refs.form.resetFields();
      this.formInline = {
        testPaperName: '',
        questionBankTypeId: '',
        status: '',
        startTime: '',
        endTime: '',
      }
      this.value1 = []
      this.onSubmit();
    },
    async onSubmit() {
      const [startTime, endTime] = this.value1 || [];
      // this.formInline['startTime'] = this.value1?.[0] || ''
      // this.formInline['endTime'] = this.value1?.[1] || ''
      const {questionBankTypeId: testPaperTypeCode, ...rest} = this.formInline;
      const res = await testpaper({
        ...rest,
        startTime,
        endTime,
        testPaperTypeCode,

      });
      this.testlist = res?.data?.records || [];
    }
  },
};
</script>
<style lang="scss" scoped>
.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(243px, 1fr));
  grid-gap: 20px;
  grid-auto-flow: dense;
}

.br {

}

.item:hover {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.item {
  background: #FAFAFA;
  border-radius: 8px;
  border: 1px solid #E9E9E9;

  .el-image {
    border-radius: 8px 8px 0 0;
    cursor: pointer;
  }

  .footer-btn {
    height: 40px;
    align-items: center;
    border-top: 1px solid #E9E9E9;

    i {
      font-size: 14px;
      flex: 1;
      text-align: center;
      border-right: 1px solid #E9E9E9;
    }

    i:hover {
      font-size: 18px;
    }

    i:last-of-type {
      border: none;
    }
  }
}

.cc {
  cursor: pointer;
}

.b-el-col {
  margin-bottom: 10px;
}

.p10 {
  padding: 0 15px;
}

.testPaperName {
  flex: 0 0 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

</style>
