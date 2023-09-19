<template>
  <div class="app-container">
    <el-scrollbar wrap-class="app-container-wrapper">
      <div ref="pageHead">
        <el-form ref="searchs" :model="searchs" class="form_horizontal">
          <el-form-item label="公司名称：" prop="keyword">
            <el-input placeholder="请输入公司名称" clearable v-model="searchs.companyName" @clear="do_search"
                      @keyup.enter.native="do_search"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-select v-model="searchs.checkStatus" clearable @change="do_search">
              <el-option v-for="item in stateData" :key="'state' + item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
            <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template>
        <el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table"
                  v-loading.body="loading" element-loading-spinner="el-icon-loading"
                  element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey"
                  @selection-change="handleSelectionChange" @cell-click="cell_click">
          <el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
            <template slot-scope="scope">
              {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
            </template>
          </el-table-column>
          <el-table-column label="客户名称" min-width="200" prop="companyName" show-overflow-tooltip>
            <template v-slot="{row}">
              {{ row.companyName || "" }}
            </template>
          </el-table-column>
          <el-table-column label="营业执照注册号" prop="licenseNumber">
            <template v-slot="{row}">
              {{ row.licenseNumber || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="验证方式" prop="verificationMethod" :filters="verifyWay"
                           :filter-method="filterVerificationMethod">
            <template v-slot="{row}">
              {{ label(verifyWay, row.verificationMethod) }}
            </template>
          </el-table-column>
          <el-table-column label="验证结果" prop="checkStatus" :filters="stateData"
                           :filter-method="filterCheckStatus">
            <template v-slot="{row}">
              <span :class="dotClass(row.checkStatus)">●</span>
              {{ label(stateData, row.checkStatus) }}
            </template>
          </el-table-column>
          <el-table-column label="提交时间" width="188" prop="updateTime_" sortable></el-table-column>
          <el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
            <template v-slot="{row}">
              <template v-if="`${row.checkStatus}` === '1'">
                <el-button type="text" v-hold-click style="margin-right: .6rem"
                           @click.stop="doCommand('info',row)">
                  详情
                </el-button>
              </template>
              <template v-else>
                <el-popover
                    :ref="`pop${row.id}`"
                    :value="row.verify.visible"
                    trigger="click"
                    placement="top"
                    title="输入验证金额"
                    @hide="row.verify.money = ''"
                >
                  <el-input placeholder="请输入验证金额" clearable v-model="row.verify.money"></el-input>
                  <div style="text-align: right; margin: 1rem 0 0 0">
                    <el-button size="small" text @click="()=>doVerify(row)">取消</el-button>
                    <el-button size="small" type="primary" @click="()=>doVerify(row,true)">确认</el-button>
                  </div>
                  <template #reference>
                    <el-button v-if="`${row.checkStatus}` === '0'" type="text" v-hold-click style="margin-right: .6rem"
                               @click.stop="doCommand('verify',row)">
                      验证
                    </el-button>
                    <el-button v-if="`${row.checkStatus}` === '2'" type="text" v-hold-click style="margin-right: .6rem"
                               @click.stop="doCommand('re-verify',row)">
                      重新验证
                    </el-button>
                  </template>
                </el-popover>
                <el-button type="text" v-hold-click
                           @click.stop="doCommand('info',row)">
                  详情
                </el-button>
                <!--                <el-popover-->
                <!--                    :ref="`pop${row.id}`"-->
                <!--                    trigger="click"-->
                <!--                    placement="top"-->
                <!--                    title="输入验证金额"-->
                <!--                >-->
                <!--                  <el-input placeholder="请输入验证金额" clearable v-model="searchs.keyword"></el-input>-->
                <!--                  <div style="text-align: right; margin: 1rem 0 0 0">-->
                <!--                    <el-button size="small" text @click="visible = false">取消</el-button>-->
                <!--                    <el-button size="small" type="primary" @click="visible = false">确认</el-button>-->
                <!--                  </div>-->
                <!--                  <template #reference>-->
                <!--                    <el-button v-if="`${row.checkStatus}` === '0'" type="text" v-hold-click style="margin-right: .6rem"-->
                <!--                               @click.stop="doCommand('verify',row)">-->
                <!--                      验证-->
                <!--                    </el-button>-->
                <!--                    <el-button v-if="`${row.checkStatus}` === '2'" type="text" v-hold-click style="margin-right: .6rem"-->
                <!--                               @click.stop="doCommand('re-verify',row)">-->
                <!--                      重新验证-->
                <!--                    </el-button>-->
                <!--                  </template>-->
                <!--                </el-popover>-->
                <!--                <el-dropdown @command="doCommand($event, row)">-->
                <!--                  <el-button @click.stop type="text">更多</el-button>-->
                <!--                  <el-dropdown-menu slot="dropdown">-->
                <!--                    <el-dropdown-item command="info">详情</el-dropdown-item>-->
                <!--                  </el-dropdown-menu>-->
                <!--                </el-dropdown>-->
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-scrollbar>
    <div ref="pagePagign" class="paging_fixed_bottom">
      <div class="pagign_box disp_flex ju_bet ali_cen">
        <div></div>
        <el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount"
                       :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper"
                       :page-sizes="pageSizes"
                       @current-change="paging_change" @size-change="size_change"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {checkList, verifyMoney} from "@/api/isp";

import accountForm from "./components/accountForm";
import accountInfo from "./components/accountInfo";

import {ispStatus, getLabel} from "@/utils/dict";

export default {
  components: {
    accountForm,
    accountInfo,
  },
  data() {
    return {
      pageFun: (opt, data, post) => checkList(opt, {checkStatus: 0, ...data}, post),
      moduleTitle: "账号",
      apiKey: "adminId",

      stateData: ispStatus.verify,
      verifyWay: ispStatus.verifyWay,
    };
  },
  mixins: [basic],
  mounted() {
    const that = this;
    this.scrollFunc = function () {
      Object.keys(that.$refs).filter(k =>
          k.indexOf("pop") > -1
      ).forEach(k => {
        // that.$refs[k].doClose();
        document.body.click()
      })
    }
    document.addEventListener('DOMMouseScroll', this.scrollFunc);
    // setTimeout(() => {
    //   this.lists = new Array(12).fill(0).map((_, idx) => {
    //     return {
    //       id: idx,
    //       base: `911400007435195673`,
    //       gd: idx
    //     }
    //   })
    // }, 1000)
  },
  beforeDestroy() {
    document.removeEventListener('DOMMouseScroll', this.scrollFunc);
  },
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

      row.verify = {
        visible: false,
        money: ''
      }

      row.stateName = "";
      row.stateName = that.filterDictLabel(that.stateData, row.state);

      return row;
    },
    label(list, value) {
      return getLabel(list, value)
    },
    dotClass(status) {
      switch (`${status}`) {
        case '1':
          return 'dot-success';
        case '2':
          return 'dot-error';
        default :
          return 'dot-normal';
      }
    },
    doCommand(command, row) {
      switch (command) {
        case "info":
          this.jump(`/isp/ispInfo?id=${row.id}`);
          break;
        case "verify":
        case "re-verify":
          this.showVerify(row);
          break;
      }
    },
    showVerify(row) {
      document.body.click();
      row.verify.visible = true;
    },
    async doVerify(row, submit) {
      row.verify.visible = false;
      const money = Number.parseFloat(row.verify.money);
      if (submit && !Number.isNaN(money)) {
        verifyMoney({}, {id: row.id, money})
            .then(() => {
              this.$message({
                message: '金额验证成功',
                type: 'success'
              })
              this.do_search();
            })
            .catch(() => {
              this.do_search();
            });

      }
    },
    filterVerificationMethod(value, row) {
      return row.verificationMethod === value
    },
    filterCheckStatus(value, row) {
      return row.checkStatus === value
    }
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


  //.form_horizontal {
  //  margin-bottom: 1rem;
  //}

  //.no_border_table {
  //  margin-bottom: 72px;
  //}

  .dot {
    &-success {
      color: #67C23A;
    }

    &-error {
      color: #F56C6C;
    }

    &-normal {
      color: #E6A23C;
    }
  }
}
</style>
