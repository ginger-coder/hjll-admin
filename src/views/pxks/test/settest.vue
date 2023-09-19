<template>
  <div class="has-page-header">
    <div class="disp_flex ju_bet ali_cen page-header">
      <span class="title">设置试卷</span>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <el-form class="page-main" ref="form" :model="form" :rules="rules" label-width="120px">

      <el-card shadow="hover">
        <span slot="header">基础设置</span>
        <el-form-item label="试卷头图:">
          <div style="width: 240px">
            <upload-pics class="upload_pics" :width="240" :height="100" :max="1" :maxSize="'1024'"
                         v-model="form.testPaperImage"
                         @success="to_set_pics($event, 'testPaperImage')"></upload-pics>
          </div>
        </el-form-item>
        <el-form-item label="试卷标题:" prop="title">
          <el-input v-model.trim="form.testPaperName" style="width: 300px;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="答题简介:">
          <el-input type="textarea" maxlength="100" v-model.trim="form.introduce" style="width: 300px;"></el-input>
        </el-form-item>
      </el-card>
      <el-card style="margin-top: 24px" shadow="hover">
        <span slot="header">基础设置</span>
        <el-form-item label="试卷类型:" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">练习</el-radio>
            <el-radio :label="2">考试</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每人答题次数:" prop="answerTime">
          <el-radio-group v-model="form.answerTime">
            <el-radio :label="0">无限次</el-radio>
            <el-radio :label="(+form.answerTime === 0) ? 1: form.answerTime">有限次</el-radio>

          </el-radio-group>
          <el-input-number :min="0" :controls="false" type="number" v-model="form.answerTime" class="num-input"/>
          <span>次</span>
        </el-form-item>
        <el-form-item label="排名:" prop="ranking">
          <el-radio-group v-model="form.ranking">
            <el-radio label="0">展示</el-radio>
            <el-radio label="1">不展示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间限制:" prop="testPaperTime">
          <el-radio-group v-model="form.testPaperTime">
            <el-radio :label="0">无限制</el-radio>
            <el-radio :label="form.testPaperTime === 0 ? 1: form.testPaperTime">有限制</el-radio>
          </el-radio-group>
          <el-input-number :min="0" :controls="false" type="number" v-model="form.testPaperTime"
                           class="num-input"></el-input-number>

          <span>分钟</span>
        </el-form-item>
        <el-form-item label="及格线:">
          <div class="disp_flex">
            <el-form-item prop="passGrade">
              <span>及格线</span>
              <el-input-number :min="0" :controls="false" type="number" v-model="form.passGrade" class="num-input"/>
            </el-form-item>
            <el-form-item prop="excellentGrade">
              <span>优秀线</span>
              <el-input-number :min="0" :controls="false" v-model="form.excellentGrade" class="num-input"/>
            </el-form-item>
          </div>

        </el-form-item>

        <el-form-item label="测试人群:" prop="choicePeople">
          <el-radio-group v-model="form.choicePeople" @change="choosepeoples">
            <el-radio label="1">全部</el-radio>
            <!--            <el-radio label="2">部分</el-radio>-->
          </el-radio-group>
          <!--          <el-button type="text" style="margin-left: 10px" v-show="form.choicePeople === '2'" @click="showFun">选择-->
          <!--          </el-button>-->
        </el-form-item>
        <el-form-item label="答题时间:" prop="timeArr">
          <el-date-picker
              value-format="yyyy-MM-dd hh:mm:ss"
              v-model="form.timeArr"
              type="datetimerange"
              :picker-options="{disabledDate}"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button @click="save" type="primary">保存</el-button>-->
        <!--        </el-form-item>-->
      </el-card>
    </el-form>
    <setrpeople ref="cc" :visible.sync="vissetpeople" @get-people="lists"/>
  </div>
</template>
<script>
import {settingdetail, savepapertop,} from '@/api/pxks'
import uploadPics from "@/components/custom/uploadPics";

import setrpeople from './components/setpeple.vue'

function validateArrayNotEmpty(rule, value, callback) {
  console.log(value, 'value');
  const [s, e] = value || [];
  if (Array.isArray(value) && s && e) {
    callback();
  } else {
    callback(new Error('请选择时间'));
  }
}

export default {
  components: {
    setrpeople,
    uploadPics
  },
  data() {
    return {
      vissetpeople: false,
      cs: 11,
      value1: '',
      rules: {
        testPaperName: [{required: true, message: '请输入试卷标题'}],
        type: [{required: true, message: '请选择试卷类型'}],
        answerTime: [{
          required: true,
          message: '请选项每人答题次数',
          // validator: (rules,value, callback) => {
          //   console.log(value);
          //   callback();
          // }
        }],
        ranking: [{required: true, message: '请选择是否排名'}],
        testPaperTime: [{required: true, message: '请选择时间限制'}],
        choicePeople: [{required: true, message: '请选择测试人群'}],
        excellentGrade: [{required: true, message: '请输入优秀分数'}],
        passGrade: [{required: true, message: '请输入及格分数'}],
        timeArr: [{required: true, message: '请选择时间', validator: validateArrayNotEmpty}],
      },
      form: {
        id: '',
        testPaperImage: [],
        title: '',
        introduce: '',
        type: '',
        answerTime: '',
        ranking: '',
        testPaperTime: '',
        passGrade: '',
        excellentGrade: '',
        choicePeople: undefined,
        timeArr: undefined

      },
      disabledDate(time) {
        // Disable dates after today
        return time.getTime() < Date.now() - 60 * 60 * 24 * 1000;
      },
      id: '',
      // url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      // srcList: [
      //   'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      //   'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      // ]
    }
  },
  mounted() {
    this.getId()
  },
  watch: {
    'form.choicePeople': function (val) {
      // this.vissetpeople = val === '2'
    }
  },
  methods: {
    lists(data) {

      if (data) {

        this.form['people'] = data

      } else {
        this.form.choicePeople = ''
      }
    },
    showFun() {
      this.vissetpeople = true;
    },
    choosepeoples() {

      // if(this.form.choicePeople==2){
      //     this.vissetpeople=true
      // }
    },
    to_set_pics(files, key) {
      this.form[key] = files;
    },
    async getId() {
      const {id} = this.$route.query
      // console.log(id);
      this.form.id = id
      const res = await settingdetail({id})
      const {testPaperImage, endTime, startTime, ...rest} = res?.data || {};
      this.$set(this, 'form', {
        ...this.form, ...rest,
        testPaperImage: testPaperImage?.split(',') || [],
        timeArr: [startTime, endTime],
      })
      // this.form.id = data.data.id
      // this.form.testPaperImage = data.data.testPaperImage
      // this.form.title = data.data.title
      // this.form.introduce = data.data.introduce
      // this.form.type = data.data.type
      // this.form.answerTime = data.data.answerTime
      // this.form.ranking = data.data.ranking
      // this.form.testPaperTime = data.data.testPaperTime
      // this.form.estPaperTime = data.data.estPaperTime
      // this.form.passGrade = data.data.passGrade
      // this.form.excellentGrade = data.data.excellentGrade
      // this.form.choicePeople = data.data.choicePeople


    },
    async save() {
      // console.log(this.form);
      this.$refs.form.validate(async valid => {
        if (!valid) return false;
        const {timeArr, choicePeople, testPaperImage, people, ...rest} = this.form;
        const [startTime, endTime] = timeArr || [];
        const data = {
          ...rest,
          choicePeople,
          testPaperImage: testPaperImage?.[0],
          people: choicePeople === '2' && Array.isArray(people) ? people.toString() : people,
          // id: this.form.id,
          // type: this.form.type,
          // answerTime: this.form.answerTime,
          // ranking: this.form.ranking,
          // testPaperTime: this.form.testPaperTime,
          // passGrade: this.form.passGrade,
          // excellentGrade: this.excellentGrade,
          // choicePeople: this.form.choicePeople,
          // testPaperImage:this.form.testPaperImage[0],
          // title: this.form.title,
          // introduce: this.form.introduce,
          endTime,
          startTime

        }
        console.log(data);
        const res = await savepapertop(data);
        console.log(res);
        const status = res?.data;
        const msg = res?.msg || (status ? '删除成功' : '删除失败');
        if (status) {
          this.$router.replace(`/testTrain/TestList`)
        }
        this.$message[status ? 'success' : 'error'](msg)

      })

    },
  }
}
</script>
<style lang="scss" scoped>
.has-page-header {
  margin: -20px;

  .page-header {
    background-color: #fff;
    margin-bottom: 24px;
    padding: 20px 24px;

    .title {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
  }

  .page-main {
    padding: 0 20px;
    overflow: hidden;
  }
}

.num-input {
  width: 100px;
  margin: 0 10px;
}
</style>
