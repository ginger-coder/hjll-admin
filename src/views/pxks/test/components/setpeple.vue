<template>
  <div class="app-container">
    <el-scrollbar wrap-class="app-container-wrapper">
      <el-dialog
          title="编辑"
          destroy-on-close
          :visible.sync="show"
          :before-close="close"
          width="80%">

        <el-form :inline="true" :model="formInline" class="demo-form-inline">

          <el-form-item label="签约情况">
            <el-select clearable v-model="formInline.sign">
              <el-option label="已签约" value="已签约"></el-option>
              <el-option label="未签约" value="未签约"></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="姓名">-->
          <!--            <el-input v-model="formInline.nickNmae"  placeholder="请输入姓名"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="角色">
            <el-select placeholder="请选择角色" clearable v-model="formInline.role">
              <el-option v-for="el in role" :label="el.name" :value="el.id" :key="el.id"/>
            </el-select>

          </el-form-item>
          <!--          <el-form-item label="技能">-->
          <!--            <el-input v-model="formInline.skill" placeholder="请输入技能"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="评分">
            <el-input-number class="number" v-model.number="formInline.score" :controls="false" :min="0" :max="5"
                             placeholder="请输入评分"/>
            <!--            <el-select clearable v-model="formInline.score" placeholder="请输入评分">-->
            <!--              <el-option label="1" value="1"/>-->
            <!--              <el-option label="2" value="2"/>-->
            <!--              <el-option label="3" value="3"/>-->
            <!--              <el-option label="4" value="4"/>-->
            <!--              <el-option label="5" value="5"/>-->
            <!--            </el-select>-->
          </el-form-item>
          <!--          <el-form-item label="地域">-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="公司">-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="confirm">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 100%;height: 400px;overflow: auto ">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <!--          <el-table-column-->
          <!--              prop="nickName"-->
          <!--              label="姓名"-->
          <!--              width="200">-->
          <!--          </el-table-column>-->
          <el-table-column
              prop="workRoleName"
              label="角色"
              width="180">
          </el-table-column>
          <!--          <el-table-column-->
          <!--              prop="workSkillName"-->
          <!--              label="技能">-->
          <!--          </el-table-column>-->
          <el-table-column
              prop="score"
              label="评分">
          </el-table-column>
          <el-table-column
              prop="sign"
              label="签约情况">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="quxiao">确 定</el-button>
  </span>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>
<script>
import {getcrowd, work_role_page} from '@/api/pxks'


export default {
  props: {
    visible: Boolean
  },
  watch: {
    'visible': {
      handler(val) {
        this.show = val;
      },
      immediate: true
    }
  },
  data() {
    return {
      // dialogVisible: true,
      role: [],
      tableData: [],
      formInline: {
        skill: undefined,
        nickName: undefined,
        role: undefined,
        score: undefined,
      },
      pepple: [],
      show: false
    };
  },
  mounted() {
    this.getcrowd()
    work_role_page({current: 1, size: 999})
        .then(res => {
          console.log(res);
          this.role = res?.data?.records || [];

        })

  },
  methods: {
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    close() {
      this.$emit('update:visible', false)
    },
    quxiao() {
      this.$emit('get-people', this.people)
      this.close();
      // this.$emit('update.dialogVisible',false)
    },
    getcrowd() {
      getcrowd({current: 1, size: 10}).then((res) => {
        this.tableData = res.data.records
        //   console.log(res);
      })
    },
    confirm() {
      getcrowd(this.formInline).then((res) => {
        this.tableData = res.data.records
        //   console.log(res);
      })
    },
    handleSelectionChange(val) {
      //  console.log(val);
      this.people = [val.userId]
      let count = []

      val.forEach(e => {
        count.push(e.userId)
      })
      this.people = count
      // this.multipleSelection = val;
    },
    getIds() {
      console.log(this.people);
    }
  }
};
</script>
<style lang="scss" scoped>
.number {
  width: 110px;

  ::v-deep input {
    text-align: left;
  }
}
</style>
