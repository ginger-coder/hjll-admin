<template>
  <div class="app-container">
    <el-scrollbar wrap-class="app-container-wrapper">
      <div ref="pageHead">
        <el-form ref="searchs" :model="searchs" class="form_horizontal">
          <el-form-item label="角色：" prop="name">
            <el-input
              placeholder="请输入角色"
              clearable
              v-model="searchs.name"
              @clear="do_search"
              @keyup.enter.native="do_search"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="searchs.status" clearable @change="do_search">
              <el-option
                v-for="item in stateData"
                :key="'state' + item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              v-hold-click
              @click="do_search"
              >筛选</el-button
            >
            <el-button icon="el-icon-refresh" v-hold-click @click="search_reset"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="add"
          @click="jump('/omp/createrole')"
          >新建</el-button
        >
      </div>
      <template>
        <el-table
          :data="lists"
          ref="lists"
          fit
          highlight-current-row
          border
          class="no_border_table"
          v-loading.body="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-custom-class="custom-loading"
          :max-height="tableMaxHeight"
          :row-key="getRowKey"
          @selection-change="handleSelectionChange"
          @cell-click="cell_click"
        >
          <el-table-column
            key="id"
            type="index"
            width="50"
            align="center"
            label="#"
            fixed
          >
            <template slot-scope="scope">
              {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="name">
            <template v-slot="{ row }">
              {{ row.name || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="运维人员数量" width="200" prop="peopleNum">
            <template v-slot="{ row }">
              <span @click.stop="table_cell_info(row)">{{
                row.peopleNum || "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色编码" width="200" prop="code">
            <template v-slot="{ row }">
              <span>{{ row.code || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template v-slot="{ row }">
              <div class="status">
                <span
                  :class="[`${row.status}` === `1` ? 'dot-open' : 'dot-close']"
                  >●</span
                >
                <span>{{ `${row.status}` === `1` ? "开启" : "关闭" }}</span>
                <el-switch
                  v-model="row.status"
                  :active-value="'1'"
                  :inactive-value="'0'"
                  @change="(val) => changeStatus(row.id, val)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createTime"
            sortable
          ></el-table-column>
          <!--          <el-table-column v-if="perOperate" label="操作" align="center" width="138">-->
          <!--            <template v-slot="{row}">-->
          <!--              <el-button type="text" v-hold-click-->
          <!--                         @click.stop="doCommand('info',row)">-->
          <!--                详情-->
          <!--              </el-button>-->
          <!--              <el-dropdown @command="doCommand($event, row)">-->
          <!--                <el-button @click.stop type="text">更多</el-button>-->
          <!--                <el-dropdown-menu slot="dropdown">-->
          <!--                </el-dropdown-menu>-->
          <!--              </el-dropdown>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column
            v-if="perOperate"
            label="操作"
            align="center"
            width="138"
          >
            <template v-slot="{ row }">
              <el-button
                type="text"
                v-hold-click
                @click.stop="doCommand('info', row)"
              >
                详情
              </el-button>
              <el-dropdown @command="doCommand($event, row)">
                <el-button @click.stop type="text">更多</el-button>
                <el-dropdown-menu slot="dropdown">
         
                  <el-dropdown-item command="add">关联证书</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-scrollbar>
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
import basic from "@/mixins/basic";
import accountForm from "./components/accountForm";
import accountInfo from "./components/accountInfo";

import { ompStatus } from "@/utils/dict";
import { page, update } from "@/api/workRole";
import { delrole } from "@/api/createskill";
export default {
  components: {
    accountForm,
    accountInfo,
  },
  mounted() {
    // setTimeout(() => {
    //   this.lists = new Array(12).fill(0).map((_, idx) => {
    //     return {
    //       id: idx,
    //       role: '巡检员',
    //       grade: idx,
    //       status: idx % 2
    //     }
    //   })
    // }, 1000)
  },
  data() {
    return {
      pageFun: page,
      moduleTitle: "账号",
      apiKey: "adminId",
      loading: false,

      stateData: ompStatus.role,
    };
  },
  mixins: [basic],
  methods: {
    checkboxInit(row, index) {
      // 管理员账号不可删除
      return row.grade !== 10;
    },
    filter_page_row(row) {
      let that = this;

      row.name = row.name || row.account || "";

      row.roleno_names = row.roleno_names || "";
      row.roleName = row.roleno_names || "";

      row.stateName = "";
      row.stateName = that.filterDictLabel(that.stateData, row.state);

      return row;
    },
    async changeStatus(id, val) {
      this.loading = true;
      update({ id, status: val })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "操作失败",
          });
        })
        .finally(() => {
          this.do_search();
          this.loading = false;
        });
    },
    doCommand(command, row) {
      switch (command) {
        case "info":
          this.$router.push({
            path: "/omp/ompRoleInfo",
            query: { id: row.id },
          });
          break;
        case "peiz":
          // let objData = JSON.stringify(row);
          this.$router.push({
            path: "/omp/createrole",
            query: { allData: encodeURIComponent(objData) },
          });
          break;
        case "edit":
          let objData = JSON.stringify(row);
          this.$router.push({
            path: "/omp/createrole",
            query: { allData: encodeURIComponent(objData) },
          });
          break;
          case "add":
          // let objData = JSON.stringify(row);
          this.$router.push({
            path: "/omp/roleadd",
             query:{
              id:row.id
             }
          });
          console.log(row.id,'8989');
          break;
        case "del":
          delrole({ id: row.id })
            .then((res) => {
              console.log(res);
              this.paging_change(this.currentPage);
            })
            .catch((err) => {
              console.log(err);
            });
          break;
      }
    },
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

  .dot {
    &-close {
      color: #909399;
    }

    &-open {
      color: #67c23a;
    }
  }

  .status {
    display: flex;
    align-items: center;

    span:nth-child(2) {
      margin: 0 4px;
    }
  }

  //.no_border_table {
  //  margin-bottom: 72px;
  //}
}

.add {
  margin-bottom: 20px;
}
</style>
