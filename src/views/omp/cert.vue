<template>
  <div class="app-container">
    <el-scrollbar wrap-class="app-container-wrapper">
      <div ref="pageHead">
        <el-form ref="searchs" :model="searchs" class="form_horizontal">
          <el-form-item label="证书：" prop="keyword">
            <el-input
              placeholder="请输入证书"
              clearable
              v-model="searchs.certificateName"
              @clear="do_search"
              @keyup.enter.native="do_search"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-select v-model="searchs.status" clearable @change="doseasrerch">
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
              @click="doseasrerch"
              >筛选</el-button
            >
            <el-button icon="el-icon-refresh" v-hold-click @click="search_reset"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-button
        type="primary"
        style="margin-bottom: 20px; margin-top: 10px"
        @click="zsadd"
        >新增</el-button
      >
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
          <el-table-column label="证书名称" prop="">
            <template v-slot="{ row }">
              {{ row.certificateName || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="证书编码" prop="account">
            <template v-slot="{ row }">
              {{ row.certificateCode || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="运维人员数量" width="200" prop="account">
            <template v-slot="{ row }">
              <span
                class="table_cell_names_span"
                @click.stop="table_cell_info(row)"
                >{{ row.umsNumber || "-" }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="role">
            <template v-slot="{ row }">
              <div class="status">
                <span :class="[row.status === 1 ? 'dot-open' : 'dot-close']"
                  >●</span
                >
                <span>{{ row.status === 1 ? "开启" : "关闭" }}</span>
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeswitch(row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="updateTime"
       
            sortable
          >
            <template v-slot="{ row }">
              {{ formatTime(row.createTime) || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="goinfor(scope.row.id)"
                >详情</el-button
              >
              <el-button type="text" @click="compile(scope.row.id)"
                >编辑</el-button
              >
              <el-button type="text" @click="deletelist(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <!-- <el-table-column v-if="perOperate" label="操作" align="center" width="138">-->
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
          <!--          </el-table-column> -->
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
import { Certificatelist, Certificatelistdelete,statusopen } from "../../api/omptwo";
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
    this.loading = false;
    this.gettablelist();
  },
  data() {
    return {
      moduleTitle: "账号",
      apiKey: "adminId",

      stateData: [
        {
          value:0,
          label:'关闭'
        },{
          value:1,
          label:'开启'
        }
      ],
      lists: [],
      searchs:{
        certificateName:'',
        status:'',
        current:1,
        size:10
      },
      total:''
    };
  },
  mixins: [basic],
  methods: {
    size_change(r){
        console.log(r);
    },
    changeswitch(row){
      console.log(row.id);
      statusopen({id:row.id}).then(res=>{

      })
    },
    gettablelist() {
      Certificatelist(this.searchs).then((res) => {
        this.lists = res.data.records;
        this.total = res.data.total
      });
    },
    doseasrerch(){
       this.gettablelist()
    },
    formatTime(timeString) {
      const dateObject = new Date(timeString);

      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const hours = String(dateObject.getHours()).padStart(2, "0");
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const seconds = String(dateObject.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    goinfor(id) {
      console.log(id);
      this.$router.push({
        path: "/omp/zsinfo",
        query: {
          id,
        },
      });
    },
    compile(id) {
      this.$router.push({
        path: "/omp/zsadd",
        query: {
          id,
        },
      });
    },
    zsadd() {
      this.$router.push({
        path: "/omp/zsadd",
      });
    },
    deletelist(row) {
      console.log(row);

      if (row.umsNumber != 0) {
        this.$message("此证书已被引用不可删除");
      } else {
        Certificatelistdelete({ id: row.id }).then((res) => {
          this.gettablelist()
          this.$message({
          message: '删除成功',
          type: 'success'
        });
        });
      }
    },
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
    doCommand(command, row) {
      switch (command) {
        case "info":
          this.jump(`/omp/ompInfo?id=${row.id}`);
          break;
        case "set":
          break;
        case "sign":
          break;
        case "edit":
          this.jump(`/omp/ompCreate?id=${row.id}`);
          break;
        case "delete":
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
</style>
