<template>
  <div class="">

    <div>
      <el-card shadow="hover">
        <div class="disp_flex ju_bet ali_cen">
          <div class="flex disp_flex flex_column">
            <span class="topic-name">{{ total.paperType }}</span>
            <div>题数: {{ total.themeNumber || 0 }} 满分：{{ total.score || 0 }}</div>
          </div>
          <div class="flex flexs">
            <div class="flexs-1">
              <span class="item-name">答题人数</span>
              <div>
                {{ total.people || 0 }}
              </div>
            </div>
            <div class="flexs-1">
              <span class="item-name">提交次数</span>
              <div>
                {{ total.submitNum || 0 }}
              </div>
            </div>
          </div>

        </div>
      </el-card>
      <el-card shadow="hover" class="mt24">
        <div class="disp_flex ali_cen ">
          <div class="flex">
            <el-form inline>
              <el-form-item style="margin-bottom: 0;">
                <el-input style="width: 200px" placeholder="请输入内容" v-model="input"/>
              </el-form-item>
              <el-form-item label="时间" style="margin-bottom: 0;" v-show="activeName === 'third'">
                <!--                :picker-options="{disabledDate: disabledStartDate}"-->
                <el-date-picker
                    v-model="Time"
                    type="daterange"
                    format="yyyy-MM-dd"

                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="">
            <el-button @click="searchph" type="primary">搜索</el-button>
            <el-button type="primary" plain @click="clear">重置</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div class=" white mt24 Ranking">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="排行榜" name="first">
          <div style="height: 500px">
            <m-table
                v-if="activeName === 'first'"
                height="100%"
                border
                ref="first_table"
                :columns="columns"
                :request="record"
                :payload="payload"
            />
          </div>
          <!--          <el-table-->
          <!--              v-if="false"-->
          <!--              :data="tableData"-->

          <!--              style="width: 100%">-->
          <!--            <el-table-column-->
          <!--                type="index"-->
          <!--                label="排名"-->
          <!--                width="80">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="nickName"-->
          <!--                label="姓名"-->
          <!--                width="180">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="workArea"-->
          <!--                label="工作区域">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="role"-->
          <!--                label="角色">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="grade"-->
          <!--                label="最好成绩">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="submitTime"-->
          <!--                label="提交时间">-->
          <!--            </el-table-column>-->
          <!--          </el-table>-->
        </el-tab-pane>
        <el-tab-pane label="答题记录" name="second">
          <div style="height: 500px">
            <m-table
                height="100%"
                v-if="activeName === 'second'"
                :request="record"
                border
                ref="second_table"
                :columns="columns1"
                :payload="payload"
            />
          </div>

          <!--          <el-table-->
          <!--              :data="logtab"-->
          <!--              border-->
          <!--              style="width: 100%">-->
          <!--            <el-table-column-->
          <!--                prop="nickName"-->
          <!--                label="姓名"-->
          <!--                width="180">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="area"-->
          <!--                label="工作区域">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="role"-->
          <!--                label="角色">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="role"-->
          <!--                label="答对/总题">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="score"-->
          <!--                label="成绩">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="duration"-->
          <!--                label="用时">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="submitTime"-->
          <!--                label="提交时间">-->
          <!--            </el-table-column>-->
          <!--          </el-table>-->
        </el-tab-pane>
        <el-tab-pane label="试题分析" name="third">
          <div style="height: 500px">
            <m-table
                height="100%"
                v-if="activeName === 'third'"
                border
                ref="third_table"
                :request="themeAnalysis"
                :columns="columns2"
                :payload="payload"
            />
          </div>


          <!--          <el-table-->
          <!--              :data="fxtab"-->
          <!--              border-->
          <!--              style="width: 100%">-->
          <!--            <el-table-column-->
          <!--                type="index"-->
          <!--                label="序号"-->
          <!--                width="60">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="testPaperThemeType"-->
          <!--                label="题目类型"-->
          <!--                width="100">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="theme"-->
          <!--                label="题目内容">-->
          <!--            </el-table-column>-->


          <!--            <el-table-column-->
          <!--                prop="rightAnswer[0]"-->
          <!--                width="150"-->
          <!--                label="答案">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="errorNum"-->
          <!--                width="100"-->
          <!--                label="错误次数">-->
          <!--            </el-table-column>-->
          <!--            <el-table-column-->
          <!--                prop="errorRate"-->
          <!--                label="错误率">-->
          <!--            </el-table-column>-->
          <!--          </el-table>-->
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--    <el-scrollbar wrap-class="app-container-wrapper">-->
    <!--      -->
    <!--    </el-scrollbar>-->
  </div>
</template>

<script>
import {recordtotal, ranking, record, themeAnalysis} from '@/api/pxks'
import mTable from "@c/business/table";
import moment from "moment";

export default {
  components: {
    mTable
  },
  data() {
    return {
      columns: [
        {prop: 'index', type: 'index', label: '排名', width: '80'},
        {prop: 'nickName', label: '姓名'},
        {prop: 'area', label: '工作区域'},
        {prop: 'role', label: '角色'},
        {prop: 'score', label: '最好成绩'},
        {prop: 'submitTime', label: '提交时间'},
      ],
      columns1: [
        {prop: 'index', type: 'index', label: '序号', width: '80'},
        {prop: 'nickName', label: '姓名', width: '120'},
        {prop: 'area', label: '工作区域'},
        {prop: 'role', label: '角色'},
        {prop: 'proportionTheme', label: '答对/总题'},
        {prop: 'score', label: '成绩'},
        {prop: 'duration', label: '用时'},
        {prop: 'submitTime', label: '提交时间'},
      ],
      columns2: [
        {prop: 'index', type: 'index', label: '序号', width: '80'},
        {prop: 'testPaperThemeType', label: '题目类型'},
        {prop: 'theme', label: '题目内容'},
        {prop: 'rightAnswer', label: '答案'},
        {prop: 'errorNum', label: '错误次数', width: '100'},
        {prop: 'errorRate', label: '错误率'},
      ],
      activeName: 'first',
      tableData: [],
      testPaperId: 0,
      total: {},
      logtab: [],
      fxtab: [],
      input: '',
      Time: [],
      disabledStartDate(time) {
        // Disable dates after today
        return time.getTime() > Date.now();
      },
      disabledEndDate(time) {
        // Disable dates before start time or after today

      },
      pickerOptions: {
        disabledDate(time) {
          return (
              (this.startTime && time.getTime() < this.startTime.getTime()) ||
              time.getTime() > Date.now()
          );
        },
      },
      payload: {}
    };
  },
  mounted() {
    const testPaperId = this.$route.query.id
    this.testPaperId = testPaperId
    // console.log(testPaperId);
    this.gettotal({testPaperId})

    // this.ranking({testPaperId})
    // this.record({testPaperId})
    // this.themeAnalysis({testPaperId})

  },
  watch: {
    activeName: {
      handler(val) {
        this.rest();
        this.Time = [];
        this.fun(val);
      },
      immediate: true
    }
  },
  methods: {

    fun(val) {
      const testPaperId = this.testPaperId || this.$route.query.id
      switch (val) {
        case "first":
          this.payload = {testPaperId, nickName: this.input}
          // this.ranking({testPaperId, nickName: this.input});
          break;
        case "second":
          this.payload = {testPaperId, nickName: this.input}
          // this.record({testPaperId, nickName: this.input});
          break;
        case "third":
          const [startTime, endTime] = this.Time
          this.payload = {
            testPaperId,
            theme: this.input,
            themeName: this.input,
            startTime: startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss')
          }
          // this.themeAnalysis({
          //   testPaperId,
          //   nickName: this.input,
          //   startTime: this.Time?.[0],
          //   endTime: this.endTime?.[1]
          // });
          break;
      }
    },
    rest() {
      this.input = ''
      this.Time = []
    },
    clear() {
      this.rest();
      this.searchph();
    },
    searchph() {
      const activeName = this.activeName
      this.fun(activeName)
      this.$refs[`${activeName}_table`]?.resetInit?.(this.payload)

    },
    async gettotal(datas) {
      const data = await recordtotal(datas)
      console.log(data);
      this.total = data.data
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    ranking,
    async rankingFun(payload) {
      const res = await ranking(payload)
      console.log(res, 'res=res=res');
      this.tableData = res?.data?.records || res?.data || []
    },
    record,
    async recordFun(payload) {
      const res = await record(payload)
      this.logtab = res?.data?.records || res?.data || []
    },
    themeAnalysis,
    async themeAnalysisFun(payload) {
      const res = await themeAnalysis(payload)
      this.fxtab = res?.data?.records || res?.data || []
    }
  }
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
}

.Ranking {
  padding: 0 20px 10px 20px;

  ::v-deep {
    .el-tabs__item {
      height: 50px;
      line-height: 50px;
    }
  }
}

.white {
  background-color: #fff;
}

.topic-name {
  margin-bottom: 15px;
}

.mt24 {
  margin-top: 24px;
}

.flexs {
  display: flex;
  justify-content: end;

  .flexs-1 {
    margin-left: 15px;

    div {
      text-align: right;
    }
  }

  .item-name {
    display: block;
    margin-bottom: 15px;
  }
}

.topic-name {

}

.item-name {
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 15px;
}
</style>
