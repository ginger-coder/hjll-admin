<template>
  <div>
    <el-card class="card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="计划名称">
          <el-input v-model="formInline.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select
            v-model="formInline.planStatus"
            placeholder="请输入"
            @change="select"
          >
            <el-option label="未执行" value="0"></el-option>
            <el-option label="已执行" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="result">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="goNewPage">新建</el-button>
        <!-- <el-button>批量操作</el-button> -->
        <!-- <el-button>...</el-button> -->
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 25px"
        height="500"
        fit highlight-current-row
        header-align="center"
        border
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="计划名称" width="100" fixed>
        </el-table-column>
        <el-table-column prop="area" label="计划编号" width="100">
        </el-table-column>
        <el-table-column prop="pollingName" label="巡检类型" width="120">
        </el-table-column>
        <el-table-column prop="#" label="机房巡检工单数量" width="120">
        </el-table-column>
        <el-table-column prop="#" label="铁塔巡检工单数量" width="120">
        </el-table-column>
        <el-table-column prop="#" label="工单总计" width="120">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="所属通信企业"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.companyName || "- -" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="workArea"
          label="计划执行区域"
          width="150px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.workArea || "- -" }}
          </template>
        </el-table-column>
        <el-table-column label="计划执行周期" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.orderExecuteStartTime | moment }}</span> -
            <span>{{ row.orderExecuteEndTime | moment }}</span>
            
          </template>
        </el-table-column>
        <el-table-column label="完成进度">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="150px"
          sortable
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row.createTime | moment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template v-slot="{ row }">
            <el-button
              type="text"
              style="color: #000000"
              v-if="row.planStatus === '1'"
              >已经执行</el-button
            >
            <el-button
              type="text"
              v-hold-click
              @click.stop="doCommand('info', row)"
              v-else
            >
              <el-button type="text">开始执行</el-button>
            </el-button>
            <el-dropdown @command="doCommand($event, row)">
              <el-button @click.stop type="text">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" disabled="true" v-if="row.planStatus === '1'">编辑</el-dropdown-item>
                <el-dropdown-item command="edit" v-else>编辑</el-dropdown-item>
                <el-dropdown-item command="delete"
                  ><span class="el-danger">删除</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div ref="pagePagign" class="paging_fixed_bottom">
      <div class="pagign_box disp_flex ju_bet ali_cen">
        <div></div>
        <el-pagination
          background
          :total="total"
          :page-size="pageSize"
          :pager-count="pagerCount"
          :current-page="currentPage"
          layout="total,prev, pager, next,sizes, jumper"
          :page-sizes="pageSizes"
          @current-change="paging_change"
          @size-change="size_change"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryList,
  deleteList,
  particularsList,
  setParticularsList,
} from "../../../api/patrol";
import moment from "moment";
import basic from "@/mixins/basic";
export default {
  filters: {
    moment(date) {
      return moment(date).format("YYYY-MM-DD HH:MM:SS");
    },
  },
  data() {
    return {
      formInline: {
        name: "",
        planStatus: "",
      },
      tableData: [],
      multipleSelection: [],
      total: "",
      detail: {},
      size: "",
      current: "",
    };
  },
  mixins: [basic],
  created() {},
  mounted() {
    queryList()
      .then((res) => {
        console.log(res,11111);
        this.tableData = res.data.records;
        this.total = res.data.total;
      })
      .catch((rej) => {
        console.log(rej);
      });
       this.changepag()
  },
  methods: {
    onSubmit() {
      queryList(this.formInline)
        .then((res) => {
          this.tableData = res.data.records;
          console.log(this.tableData);
          console.log(res);
        })
        .catch((rej) => {
          console.log(rej);
        });
    },
    goNewPage() {
      this.$router.push({
        path: "/newPat",
      });
    },
    select(val) {
      this.formInline.planStatus = val;
    },
    result() {
      this.formInline.name = "";
      this.formInline.planStatus = "";
      this.$router.go(0)
    },

    doCommand(commat, row) {
      switch (commat) {
        case "info":
          this.setListStatus(row.id);
          break;
        case "edit":
          this.setxiugaiList(row);
          break;
        case "delete":
          this.open(row.id);
          break;
      }
    },
    open(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteList(id)
            .then((res) => {
              console.log(res);
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.onSubmit();
              }
            })
            .catch((ret) => {
              console.log(ret);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    setListStatus(id) {
      particularsList(id)
        .then((res) => {
          this.detail = res.data;
        })
        .catch(() => {});
      this.$confirm("是否开始执行计划?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          console.log(this.detail);
          this.detail.planStatus = "1";
          setParticularsList(this.detail);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消执行",
          });
        });
    },
    setxiugaiList(row) {
      console.log(row);
      this.$router.push({
        path: "/newPat",
        query: {
          row: row.id,
        },
      });
    },
    size_change(res) {
      this.size = res;
      queryList({ size: this.size }).then((res) => {
        this.tableData = res.data.records;
      });
    },
    paging_change(res) {
      this.current = res;
      queryList({ current: this.current }).then((res) => {
        this.tableData = res.data.records;

      });
    },
    changepag(){
      let res = 30
      this.size = res;
      queryList({ size: this.size }).then((res) => {
      this.tableData = res.data.records;
      });
    },
  },
};
</script>

<style scoped>
</style>
