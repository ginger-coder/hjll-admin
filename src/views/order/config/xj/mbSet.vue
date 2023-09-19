<template>
  <div style="height: 100%">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
        <div class="titleTips">{{ titleTips }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="primary" @click="save">保存</el-button>
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>

    <div class="form_box scrllbar">
      <div>
        <template v-if="form.moduleVOList && form.moduleVOList.length>0">
          <div v-for="(item,index) in form.moduleVOList" :key="item.moduleId">
            <div class="card_item disp_flex ju_bet ali_cen">
              <div style="margin-right: 20px;" class="flex">{{ item.moduleName }}</div>
              <div class="flex" style="margin-right: 20px;">
                <span class="el-info">适用</span>{{ item.moduleUmsRoleName }}<span class="el-info">类专业</span>
              </div>
              <!--              <div class="flex">-->
              <!--                <span class="el-info">按</span>{{ item.modulePollingPeriodName }}-->
              <!--                <span class="el-info">巡检</span>-->
              <!--              </div>-->
              <div class="">
                <el-button size="small" v-hold-click type="danger" @click="removeList(index)">删除</el-button>
              </div>
            </div>
            <div class="sh1" style="background: #f2f2f2"></div>
          </div>
        </template>
        <div v-else class="empty_box card_item">
          暂无数据
        </div>
      </div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="table_box card_item">
        <div style="font-size:16px;font-weight:bold;margin:-20px 0 20px">添加巡检模块</div>
        <el-form ref="searchs" :model="searchs" class="form_horizontal" style="margin-bottom:10px">
          <el-form-item label="巡检模块：" prop="name">
            <el-input placeholder="请输入" clearable v-model="searchs.name" @clear="do_search"
                      @keyup.enter.native="do_search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
            <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table"
                  v-loading.body="loading" element-loading-spinner="el-icon-loading"
                  element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey"
                  @selection-change="handleSelectionChange" @cell-click="cell_click">
          <el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
            <template slot-scope="scope">
              {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
            </template>
          </el-table-column>
          <el-table-column label="模块名称" min-width="100" prop="name" fixed>
            <template slot-scope="scope">
              {{ scope.row.name || "-" }}
            </template>
          </el-table-column>

          <el-table-column label="项目名称" min-width="140">
            <template slot-scope="scope">
              {{ showItemName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="适用专业" prop="orderTypeDetailsIdName" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.orderTypeDetailsIdName || "-" }}
            </template>
          </el-table-column>
          <!--          <el-table-column label="巡检周期" prop="pollingPeriodName">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.pollingPeriodName || "-" }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="创建时间" width="188" prop="createTime">
            <template slot-scope="scope"> {{ scope.row.createTime_ }}</template>
          </el-table-column>
          <el-table-column v-if="perOperate" label="操作" align="center" width="80" fixed="right">
            <template slot-scope='scope'>
              <el-button type="text" v-hold-click @click.stop="topAdd(scope.row)"> 添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="disp_flex ali_cen ju_bet" style="margin-top:10px">
          <div></div>
          <el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount"
                         :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper"
                         :page-sizes="pageSizes" @current-change="paging_change"
                         @size-change="size_change"></el-pagination>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {parseTime} from "@/utils";
import {mbConfig, mkConfig} from "@/api/orderXjConfig";

export default {
  components: {},
  data() {
    return {
      title: "配置巡检模块",
      titleTips: "",

      pageFun: mkConfig,

      id: '',
      apiKey: "id",
      searchs_default: {
        status: 0
      },

      form: {
        moduleList: [],
        moduleVOList: [],
      },
      rules: {},
    };
  },
  mixins: [basic],
  created() {
    const {id, typeDetailsIds} = this.$route.query;

    this.searchs_default.typeDetailsIds = typeDetailsIds;
    this.id = id;
    if (id) {
      this.loader_info();
    }
  },
  mounted() {
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    showItemName(row) {
      return row?.itemVOList?.map?.(el => el?.itemName)?.toString() || '-'
    },
    loader_info: function () {
      var that = this
      mbConfig({method: "get", name: "detail"}, {id: that.id})
          .then((res) => {
            that.form = {
              ...this.form,
              ...res.data
            }
            that.form.moduleVOList = res.data.moduleVOList || []
          })
    },

    save: function () {
      var that = this
      let _post = that.form
      if (_post.moduleVOList && _post.moduleVOList.length) {
        _post.moduleList = _post.moduleVOList.map(item => item.moduleId).filter(id => id).join(",")
      } else {
        _post.moduleList = ''
      }
      mbConfig({method: "post", name: "updateTemplate"}, {}, _post).then((res) => {
        that.$message({
          type: "success",
          message: res.msg,
        });
        that.back();
      });
    },
    topAdd: function (row) {
      var that = this

      let _json = {
        moduleName: row.name,
        moduleUmsRoleName: row.umsRoleName,
        modulePollingPeriodName: row.pollingPeriodName,
        moduleId: row.id
      }

      if (this.form.moduleVOList && !this.form.moduleVOList.length) {
        this.form.moduleVOList.push(_json)
        return
      }

      if (that.form.moduleVOList && that.form.moduleVOList.length && row.id) {
        let _index = that.form.moduleVOList.findIndex(item => item.moduleId === row.id)
        if (_index < 0) {
          that.form.moduleVOList.push(_json)
        } else {
          this.$message({
            message: '该模块已存在，请勿重复添加',
            type: 'warning'
          })
        }
      }
    },
    removeList: function (index) {
      var that = this
      that.$delete(that.form.moduleVOList, index)
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
}

.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;

  .title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}

.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;

  .card_item {
    padding: 20px;
    font-size: 14px;
  }
}

.empty_box {
  text-align: center;
  color: #949599;
  font-size: 16px;
  font-weight: bold;
}

.table_box {
  margin-top: 20px;
}

</style>
