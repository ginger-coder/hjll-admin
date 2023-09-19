<template>
  <el-dialog
      :title="title"
      destroy-on-close
      width="621px"
      :laoding="loading"
      :visible.sync="dialogVisible"
      :before-close="handleClose">

    <el-form ref="topicForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="题目类型" prop="themeTypeId">
        <el-select v-model="form.themeTypeId" placeholder="请选择">
          <el-option :label="item.themeName" :value="item.type" v-for="item in choose" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目内容" prop="themeName">
        <el-input v-model="form.themeName" style="width:200px"
                  placeholder="请输入题目内容"/>
        <!--              <upload-pics class="upload_pics logo" :max="1" :maxSize="'1024'" v-model="form.img"-->
        <!--                           @success="to_set_pics($event, 'companyLogo')" style="float: right;"></upload-pics>-->
      </el-form-item>
      <el-form-item v-show="form.themeTypeId" prop="rightAnswer">
        <div v-show="form.themeTypeId==='1'">
          <el-radio-group v-model="form.rightAnswer">
            <el-form-item label="" style="margin-bottom: 16px" v-for="(el, index) in currentOptionsNum"
                          :prop="`${maxOptions[index]}`">
              <div class="disp_flex  ali_cen" :key="el">
                <el-radio class="hidden-label" :label="maxOptions[index]"
                          @change="(e) => handleCheckbox(e, el, index)"/>
                <el-input v-model="form[maxOptions[index]]" style="width: 200px"/>
                <div style="margin-left: 12px" class="disp_flex">
                  <el-button type="text" class="addAndDel" @click="addOptionItem">
                    添加选项
                  </el-button>
                  <el-button v-show="index > 0 || index < maxOptions.length"
                             type="text" class="addAndDel"
                             @click="delOptionItem">
                    删除选项
                  </el-button>
                </div>
              </div>
            </el-form-item>
          </el-radio-group>
        </div>
        <div v-show="form.themeTypeId==='2'">
          <el-checkbox-group v-model="form.rightAnswer">
            <el-form-item label=""
                          style="margin-bottom: 16px"
                          v-for="(el, index) in currentOptionsNum"
                          :prop="`${maxOptions[index]}`">
              <div class="disp_flex  ali_cen" :key="el">
                <el-checkbox
                    @change="(e) => handleCheckbox(e, el, index)"
                    :label="maxOptions[index]">
                  <el-input v-model="form[maxOptions[index]]" style="width: 200px"/>
                </el-checkbox>


                <div style="margin-left: 12px" class="disp_flex">
                  <el-button type="text" class="addAndDel" @click="addOptionItem">
                    添加选项
                  </el-button>
                  <el-button v-show="index > 0 || index < maxOptions.length"
                             type="text" class="addAndDel"
                             @click="delOptionItem">
                    删除选项
                  </el-button>
                </div>
              </div>
            </el-form-item>
            
          </el-checkbox-group>
        </div>
        <div v-show="form.themeTypeId==='3'">
          <el-radio-group v-model="form.rightAnswer">

            <el-form-item label="" v-for="(el, index) in ['a','b']" :prop="el" :key="el"
                          style="margin-bottom: 16px">
              <div class="disp_flex  ali_cen" :key="el">
                <el-radio :label="maxOptions[index]" @change="(e) => handleCheckbox(e, el, index)">
                  <el-input v-model="form[maxOptions[index]]" style="width: 200px"/>
                </el-radio>
              </div>
            </el-form-item>


          </el-radio-group>

        </div>
      </el-form-item>
      <el-form-item label="题目解析">
        <el-input type="textarea" placeholder="请输入题目解析" v-model="form.analysis" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="解析图片">
        <upload-pics class="upload_pics logo" :max="1" :maxSize="'1024'" v-model="form.analysisImage"
                     @success="to_set_pics($event, 'analysisImage')"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCloseEdit">取 消</el-button>
      <el-button type="primary" @click="cofirmsave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  sttypelist,
  themeadd,
  themedetail,
  updatetest,
} from '@/api/pxks'
import uploadPics from "@/components/custom/uploadPics";

export default {
  props: {
    "id": [String, Number],
    "url": {
      type: String,
      default: '/itembank/theme/detail'
    }
  },
  components: {
    uploadPics
  },
  data() {
    return {
      title: '添加题目',
      maxOptions: ['a', 'b', 'c', 'd', 'e', 'f'], // 最多的选项
      currentOptions: ['a'], // 当前的选择数据
      currentOptionsNum: 1,
      dialogVisible: false,
      choose: [],
      chooseMap: {},
      rules: {
        themeTypeId: [{required: true, message: '请选择题目类型'}],
        themeName: [{required: true, message: '请输入题目'}],
        rightAnswer: [{
          required: true, message: '请选择正确答案', validator: (rule, value, callback) => {
            if (!value) callback(new Error());
            if (this.form.themeTypeId === '2' && !value.length) callback(new Error());
            callback();
          }
        }],
      },
      form: {
        questionBankId: '',
        themeName: '',
        themeTypeId: '',
        // a: '',
        // b: '',
        // c: '',
        // d: '',
        // e: '',
        // f: '',
        analysis: '',
        rightAnswer: []
        // rightAnswer:['111']
        // img:'',
        // name:"",
        // choose:''
      },
      loading: false
    };
  },
  watch: {
    'dialogVisible': function (val) {
      if (!val || !this.id) return false;
      this.title = '编辑题目'
      this.questionTypes();
      this.edittest(this.id, this.url);
    }
  },
  methods: {
    // 获取全部类型
    async questionTypes() {
      if (this.choose.length) return;
      const res = await sttypelist({questionBankId: this.form.questionBankId})
      const data = res?.data?.records || [];

      this.choose = data;
      this.chooseMap = data?.reduce((pre, cur) => {
        const {type, themeName} = cur;
        if (!pre.hasOwnProperty(type)) {
          pre[type] = themeName;
        }
        return pre
      }, {})
    },
    async edittest(id, url) {
      this.loading = true;
      const res = await themedetail({id}, url);
      const data = res?.data;
      if (!data) {
        this.$message.warning('数据异常');
        this.handleCloseEdit();
        return false;
      }
      const themeTypeId = data?.themeTypeId;
      const rightAnswer = data?.rightAnswer;
      this.dialogVisible = true
      this.newId = id;
      this.form = {
        ...this.form,
        ...data,
        themeTypeId: themeTypeId ? String(themeTypeId) : '',
        rightAnswer: themeTypeId === 2 ? [] : '' // 答案要单独处理
      };
      // 过滤图片
      Object.keys(data).forEach(el => {
        if (/Image/.test(el)) {
          const item = data[el];
          if (item) {
            this.form[el] = data[el]?.split(',')?.filter(src => src) || []
          }
        }
      })
      // 生成选择
      this.maxOptions.forEach((el, index) => {
        const value = data?.[el];
        if (value) {
          this.form[el] = value;
          if (index) {
            this.currentOptionsNum += 1;
          }
          // 生成答案, 接口返回的答案是 答案的文字，表单是根据a,b,c,d显示的
          if (rightAnswer.includes(value)) {
            if (themeTypeId === 2) {
              this.form.rightAnswer.push(el)
            } else {
              this.form.rightAnswer = el;
            }
          }
        }
      })
      await this.$nextTick();
      this.loading = false;

      // 获取radio的值
      // if (themeTypeId !== 2) {
      //   this.form.rightAnswer = rightAnswer?.[0]
      // }
      // this.form.questionBankId = data.data.questionBankId,
      //     this.form.themeName = data.data.themeName,
      //     this.form.themeTypeId = data.data.themeTypeId
      // this.form.a = data.data.a,
      //     this.form.b = data.data.b,
      //     this.form.c = data.data.c,
      //     this.form.d = data.data.d,
      //     this.form.analysis = data.data.analysis,
      //     this.form.rightAnswer = data.data.rightAnswer
    },
    handleCloseEdit() {

      this.$refs.topicForm.resetFields();
      this.dialogVisible = false;
      this.form = {
        themeName: '',
        themeTypeId: '',
        analysis: '',
        rightAnswer: ''
      }
      this.newId = undefined
      this.currentOptionsNum = 1;

    },
    addOptionItem() {
      const length = this.maxOptions.length;
      let index = this.currentOptionsNum;
      const keyName = this.maxOptions[index - 1]
      if (index < length) {
        index += 1;
        this.$set(this.form, keyName, this.form[keyName] || undefined)
        this.rules[keyName] = [{required: true, message: '请输入选项内容'}]
      }
      this.currentOptionsNum = index;
    },
    delOptionItem() {
      if (this.currentOptionsNum > 1) {
        this.currentOptionsNum -= 1;
        const keyName = this.maxOptions[this.currentOptionsNum];
        delete this.form[keyName]
        this.rules[keyName] = [{required: false, message: '请输入选项内容'}]
      }
    },
    changedialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.handleCloseEdit();
            done();
          })
          .catch(_ => {
          });
    },
    async cofirmsave() {
      await this.$refs.topicForm.validate(async (valid) => {
        if (!valid) return false;
        const {rightAnswer, ...rest} = this.form;
        const payload = {
          ...rest
        };
        if (this.form.themeTypeId === '2') {
          payload['rightAnswer'] = rightAnswer.map(el => rest[el]);
        } else {
          // this.form.rightAnswer = [this.form.rightAnswer]
          payload.rightAnswer = [rest[rightAnswer]] || []
        }
        Object.keys(this.form).forEach(el => {
          if (/Image/.test(el)) {
            payload[el] = this.form[el]?.toString?.()
          }
        })
        // if (this.newId) {
        //   payload['id'] = this.newId
        //   const dataarr = await updatetest(payload);
        //   console.log(dataarr, 'dataarr');
        // } else {
        //   const data = await themeadd(payload)
        // }
        // this.newId = ''
        // await this.sttypelist();
        // this.handleCloseEdit();
        this.$emit('save-success', payload, this.handleCloseEdit)
      })
    },
    async getchoose() {
      const {data} = await sttypelist();
      //    console.log(data);
      this.choose = data.records;
      this.form['testPaperId'] = this.ids
    },
  },
};
</script>

<style lang="scss" scoped>
.hidden-label {
  margin-right: 12px;

  ::v-deep {
    .el-radio__label,
    .el-checkbox__label {
      display: none;
    }
  }
}
</style>
