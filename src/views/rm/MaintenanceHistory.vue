<template>
  <div class="app-container">
    <el-scrollbar>
      <div ref="pageHead">
        <el-card>
          <el-form ref="searchs" :model="searchs" class="disp_flex ju_bet form_horizontal">
            <el-form-item label="工单编号：" prop="serialNumber">
              <el-input placeholder="请输入工单编号" clearable v-model="searchs.serialNumber" @clear="do_search"
                        @keyup.enter.native="do_search"></el-input>
            </el-form-item>
            <!-- <el-form-item label="工单状态：" prop="workOrderStatus">
              <el-select v-model="searchs.workOrderStatus" clearable @change="do_search">
                <el-option v-for="item in stateData" :key="'state' + item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
              <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <!-- <div v-if="perOperate" class="page_handle_group">
          <el-button type="primary" icon="el-icon-plus" v-hold-click @click="jump('/order/orderCreate')">新增</el-button>
        </div> -->
        <!-- 已选 -->
        <!-- <template v-if="perOperate">
                    <div class="table_selection_card">
                        已选 <span class="mcolor">{{tableSelectionIds.length}}</span> 项
                        <el-button type="text" :disabled="tableSelectionIds.length==0" @click="handleSelectionClear">清空</el-button>
                    </div>
                    <div class="sh1"></div>
                </template> -->
      </div>
      <el-card style="margin-top: 24px">
        <div slot="header" class="disp_flex ali_cen ju_bet">
          <div class="header-title">基本列表</div>
          <div>
            <el-button disabled>选择显示列</el-button>
            <el-button disabled>批量通过审核</el-button>
            <el-button disabled type="primary">拒绝</el-button>
          </div>
        </div>
        <template>
          <el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table"
                    v-loading.body="loading" element-loading-spinner="el-icon-loading"
                    element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey"
                    @selection-change="handleSelectionChange" @cell-click="cell_click">
            <!-- <el-table-column v-if="perOperate" key="selection" type="selection" :reserve-selection="true" align="center" :selectable="checkboxInit" fixed></el-table-column>
            <el-table-column v-else key="id" type="index" width="50" align="center" label="#" fixed></el-table-column> -->
            <el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
              <template slot-scope="scope">
                {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
              </template>
            </el-table-column>
            <el-table-column label="站址名称" width="100" prop="siteName" fixed />
            <el-table-column label="站址编号" prop="serialNumber" min-width="140">
              <template slot-scope="scope">
                {{ scope.row.serialNumber || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="工单类型" width="100" prop="workOrderTypeName">
              <template slot-scope="scope">
                {{ scope.row.workOrderTypeName || "-" }}
              </template>
            </el-table-column>

            <el-table-column label="省份" prop="provinceName">
              <template slot-scope="scope">
                {{ scope.row.provinceName || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="城市" prop="cityName">
              <template slot-scope="scope">
                {{ scope.row.cityName || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="区县" prop="districtName">
              <template slot-scope="scope">
                {{ scope.row.districtName || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="站址详细地址" prop="siteAddress" min-width="140" show-overflow-tooltip />
            <!--            <el-table-column label="站点" prop="siteName" min-width="140" show-overflow-tooltip>-->
            <!--              <template slot-scope="scope">-->
            <!--                {{ scope.row.siteName || "-" }}-->
            <!--              </template>-->
            <!--            </el-table-column>-->

            <el-table-column label="检修项(数值)" prop="reconditionItem" min-width="140" show-overflow-tooltip />
            <el-table-column label="检修人名称" prop="nickName" min-width="140" show-overflow-tooltip />
            <el-table-column label="检修人手机号" prop="mobile" min-width="140" show-overflow-tooltip />
            <el-table-column label="检修时间" prop="orderExecuteStartTime" min-width="140" show-overflow-tooltip />
            <el-table-column label="确认时间" prop="updateTime" min-width="140" show-overflow-tooltip />




            <!--            <el-table-column label="状态" width="140" prop="stateName">-->
            <!--              <template slot-scope="scope">-->
            <!--                <div class="disp_flex ali_cen">-->
            <!--                  <div v-if="scope.row.workOrderStatus != null" class="table_status_box"-->
            <!--                       :class="tableStatusClass(stateData, scope.row.workOrderStatus)"></div>-->
            <!--                  {{ tableStatusLabel(stateData, scope.row.workOrderStatus) }}-->
            <!--                  &lt;!&ndash; 待确认 &ndash;&gt;-->
            <!--                  <el-popconfirm title="确定确认工单吗？" :hide-icon="true" :key="scope.row.serialNumber"-->
            <!--                                 @confirm="confirmOrder(scope.row)">-->
            <!--                    <span v-if="scope.row.workOrderStatus == '7'" slot="reference" class="btn-verify">确认</span>-->
            <!--                  </el-popconfirm>-->
            <!--                </div>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column label="创建时间" width="188" prop="createTime_"></el-table-column>-->
            <el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
              <template slot-scope="scope">
                <!--              <el-popconfirm title="确定确认工单吗？" :hide-icon="true" @confirm="confirmOrder(scope.row)">-->
                <!--                <el-button slot="reference" v-if="scope.row.workOrderStatus == '7'" type="text" style="margin-right: 10px">确认</el-button>-->
                <!--              </el-popconfirm>-->
                <el-button @click.stop="do_info(scope.row)" type="text" style="margin-right: 10px">查看工单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>

    </el-scrollbar>
    <div ref="pagePagign" class="paging_fixed_bottom">
      <div class="pagign_box disp_flex ju_bet ali_cen">
        <div></div>
        <el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount"
                       :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper"
                       :page-sizes="pageSizes" @current-change="paging_change"
                       @size-change="size_change"></el-pagination>
      </div>
    </div>
    <el-drawer title="回单结果" :visible.sync="receiptDrawer" size="70%" :direction="'rtl'"
               custom-class="feedbackDrawerBox1">
      <div class="box" style="height:220px">
        <div class="box_title">基本信息</div>
        {{ siteVo }}
        <span
            class="detail">
          {{ siteVo.provinceName }}
          {{ siteVo.cityName }}
          {{ siteVo.districtName }} - {{ siteVo.siteName }} - {{
            workOrder.workOrderTypeDetailsName
          }} - {{ timeFilter(workOrder.createTime, '{y}-{m}-{d}') }}
        </span>
        <div class="info">
          <div v-for="(item,index) in receipt.info" :key="'info'+index">
            <span> {{ item.label }}</span>
            <span> {{ receipt.infoData[item.key] || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="box" style="height:calc(100% - 240px)">
        <div class="box_title">回单信息</div>
        <div class="tabs" style="height:calc(100% - 40px)">
          <el-tabs v-model="receipt.tab" @tab-click="handleTabClick">
            <el-tab-pane v-for="(module,idx) in receipt.modules"
                         :key="'module' + idx"
                         :label="(module || {name:''}).name"
                         :name="(module || {id:''}).id.toString()">
              <div class="tab-list">
                <div class="tab-list-cell" v-for="(cell,i) in receipt.list" :key="'tab-list-cell' + i">
                  <el-collapse v-model="receipt.activeCollapse">
                    <el-collapse-item name="1">
                      <template #title>
                        <div class="head">
                          <div class="left">
                            <span>{{ cell.moduleName }}</span>
                            <span>{{ cell.required }}</span>
                          </div>
                          <div :class="['right',cell.result === '正常'?'normal':'error']">
                            <span>{{ cell.result }}</span>
                          </div>
                        </div>
                      </template>
                      <el-form>
                        <el-form-item label="巡检对象类型：">{{ cell.pollingTypeName || "-" }}</el-form-item>
                        <el-form-item label="巡检设备：">{{ cell.item || "-" }}</el-form-item>
                        <el-form-item label="反馈结果：">{{ cell.result || "-" }}</el-form-item>
                        <el-form-item label="备注：">{{ cell.remark || '-' }}</el-form-item>
                        <el-form-item label="现场照片：">
                          <el-carousel indicator-position="outside" :autoplay="false" trigger="click" arrow="always">
                            <el-carousel-item v-for="item in cell.photo" :key="item">
                              <el-image :src="baseUpload + item"
                                        fit="contain"/>
                            </el-carousel-item>
                          </el-carousel>
                        </el-form-item>
                      </el-form>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {reconditionHistory, workOrder} from "@/api/order";
import {orderStatus, getLabel, getClass,} from "@/utils/dict";
import {parseTime, deepClone} from "@/utils";
import {BASE_UPLOAD} from "@/config";
export default {
  components: {},
  data() {
    return {
      baseUpload: BASE_UPLOAD,
      receiptDrawer: false,
      pageFun: reconditionHistory,
      apiKey: "reconditionHistory",
      searchs_default: {
        workOrderStatus: "11",
      },

      stateData: orderStatus,
      siteVo: {},
      receipt: {
        tab: '',
        info: [{
          label: "模块数量",
          key: 'moduleCount',
        }, {
          label: "巡检对象类型",
          key: 'xjTypeCount',
        }, {
          label: "巡检设备",
          key: 'xjsbTypeCount',
        }, {
          label: "巡检项目数量",
          key: 'xjxmuTypeCount',
        }, {
          label: "正常数",
          key: 'zcCount',
        }, {
          label: "异常数",
          key: 'ycCount',
        }, {
          label: "总数",
          key: 'count',
        }],
        infoData: {},
        modules: [],
        list: [],

        activeCollapse: ['1']
      },

      orderInfo: {},
      umsMember: {},
      workOrder: {},
      workOrderStatus1: {},
    };
  },
  mixins: [basic],
  methods: {
    handleTabClick(e) {
      const module = this.receipt.modules[e.index];
      // if (this.receipt.tab !== `${module}.id`) {
      //   workOrder({method: "get", name: "receiptResult"}, {
      //     workOrderId: this.workOrder.id,
      //     moduleId: this.receipt.tab
      //   }).then((res) => {
      //     this.receipt.list = res.data
      //   });
      // }
    },
    tableStatusLabel(list, value) {
      return getLabel(list, value);
    },
    tableStatusClass(list, value) {
      return getClass(list, value);
    },
    checkboxInit(row, index) {
      // 管理员账号不可删除
      return row.grade != 10;
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
          this.jump(`/order/orderInfo?id=${row.id}`);
          break;
        case "set":
          break;
        case "sign":
          break;
        case "edit":
          this.jump(`/order/orderInfo?id=${row.id}`);
          break;
        case "delete":
          break;
      }
    },
    timeFilter(time, fmt = "{y}-{m}-{d} {h}:{i}:{s}") {
      return parseTime(new Date(time).getTime(), fmt) || "-";
    },
    filter_worder: function (orderInfo) {
      let that = this;
      return orderInfo;
    },
    openReceiptDrawer: function () {
      var that = this
      that.receiptDrawer = true
      // workOrder({method: "get", name: "receiptResult"}, {workOrderId: that.workOrder.id, optionInfo: 1}).then((res) => {
      //   that.receiptListError = res.data
      // });
      // workOrder({method: "get", name: "receiptResult"}, {workOrderId: that.workOrder.id}).then((res) => {
      //   that.receiptList = res.data
      // });
      workOrder({method: "get", name: "pollingModule"}, {workOrderId: that.workOrder.id}).then((res) => {
        that.receipt.modules = res.data
        that.receipt.tab = res.data.length > 0 ? `${res.data[0].id}` : '';
        workOrder({method: "get", name: "receiptResult"}, {
          workOrderId: that.workOrder.id,
          moduleId: that.receipt.tab
        }).then((res) => {
          that.receipt.list = res.data
        });
      });
      workOrder({method: "get", name: "receiptCount"}, {workOrderId: that.workOrder.id}).then((res) => {
        that.receipt.infoData = res.data
      });
    },
    do_info: function (row) {
      const that = this;
      // this.jump(`/order/orderInfo?id=${row.id}`);
      const workOrderId = this.workOrder.id || row?.workOrderId || row.id  ;
      if (!workOrderId) return false;
      this.loading = true



      workOrder({method: "get", name: "pollingModule"}, {workOrderId}).then((res) => {
        that.receipt.modules = res.data
        that.receipt.tab = res.data.length > 0 ? `${res.data[0].id}` : '';
        workOrder({method: "get", name: "receiptResult"}, {
          workOrderId,
          moduleId: this.receipt.tab
        }).then((res) => {
          this.receipt.list = res.data
        });
      });
      workOrder({method: "get", name: "receiptCount"}, {workOrderId}).then((res) => {
        this.receipt.infoData = res.data
      });
      this.receiptDrawer = true;
      this.loading = false

    },
    confirmOrder: function (row) {
      var that = this
      let _post = row
      _post.id = row.id
      _post.workOrderStatus = 11
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '工单确认成功',
          type: 'success'
        })
        that.paging_change(that.currentPage);
      });
    },
  },
};
</script>

<style lang="scss">
.feedbackDrawerBox1 {
  .el-drawer__body {
    padding: 20px;
    background-color: #eeeeee;
    overflow-y: hidden;
  }

  .el-drawer__header {
    margin-bottom: 22px;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .el-collapse-item__header {
    min-height: 80px;
    line-height: normal;
  }

  .el-form-item {
    margin: 0;
  }
}

</style>
<style lang="scss" scoped>
.header-title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
}
.app-container {
  //font-size: 0;
  position: relative;
  padding: 0;
  ::v-deep {
    .el-table {
      &::before {
        content: none;
      }
    }
  }

  .btn {
    &-verify {
      background: #4993f7;
      border-radius: 4px;
      color: white;
      width: 45px;
      height: 22px;
      display: inline-block;
      text-align: center;
      margin-left: 0.3rem;
      font-size: 13px;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.app-container {
  font-size: 0;
  position: relative;
  background-color: transparent;

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
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .back_box {
  }
}

.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;
  min-width: 990px;

  .card_item {
    padding: 20px;

    .flex_box {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .el-form-item:not(:first-of-type) {
        margin-left: 40px;
      }
    }

    .card_item_header_title ::v-deep {
      .el-form-item__label {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
      }

      .el-form-item__content {
        color: #000000a5;
        font-size: 20px;
      }
    }

    .card_item_title ::v-deep {
      font-size: 16px;
      font-weight: 500;
      margin-top: 20px;
      margin-bottom: 10px;
      color: #333333;

      .el-form-item__label {
        font-size: 16px;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #333333;
      }
    }

    ::v-deep {
      .el-form-item__label {
        color: #000000d8;
        font-weight: 400;
      }

      .el-form-item__content {
        color: #000000a5;
      }
    }
  }

  .order_status_box {
    width: 100%;
    display: flex;

    justify-content: space-between;

    .order_status_box_item {
      min-width: 100px;
      margin-top: 10px;
      flex: 2;

      .status_box_status {
        border-radius: 20px;
        background: #f0f2f5;
        color: #949599;
        font-weight: 500;
        line-height: 40px;
        text-align: center;
        position: relative;
      }

      .status_box_time {
        font-size: 12px;
        color: #333333;
        margin-top: 10px;
        width: 100%;
        text-align: center;
      }
    }

    .status_box_status_empty {
      flex: 1;
      margin: 30px 10px 0;
      border: 1px dotted #2879ff;
      height: 1px;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        left: -2px;
        top: -3px;
        width: 6px;
        height: 6px;
        border-radius: 10px;
        background: #2879ff;
      }

      &:after {
        content: "";
        position: absolute;
        right: -2px;
        top: -3px;
        width: 6px;
        height: 6px;
        border-radius: 10px;
        background: #2879ff;
      }

      /* &:last-of-type {
        display: none;
      } */
    }

    .status_box_time:first-child {
      color: red;
    }

    .status_box_status_empty:last-child {
      /* border: 1px solid red; */
    }

    .order_status_box_item.active {
      .status_box_status {
        color: #ffffff;
        background: #2879ff;
      }
    }
  }
}

.card_right_box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card_right_box_txt {
    font-size: 14px;
    margin-right: 10px;
  }
}

.rate_box {
  margin-top: 10px;
}

.drawer_box {
  .drawer_box_left {
    padding: 20px;
    background: #f5f5f5;
    margin-bottom: 10px;

    .drawer_box_left_header {
      margin-bottom: 10px;

      .drawer_box_left_avater {
        width: 20px;
        height: 20px;
        background: #2879ff;
        border-radius: 20px;
      }

      .drawer_box_left_name {
        margin: 0 10px;
        font-weight: 500;
        font-size: 14px;
      }

      .drawer_box_left_time {
        color: rgba(148, 149, 153, 0.4470588235294118);
      }
    }

    .drawer_box_left_summary {
      color: #696969;
      margin-left: 30px;
    }
  }

  .drawer_box_right {
    padding: 20px;
    min-width: 140px;
  }
}

.score {
  margin-top: 6px;
  height: 22px;
  display: flex;
  align-items: center;

  &.noColor {
    svg {
      color: #c6d1de;
    }

    span {
      color: #c6d1de;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 0.3rem;
    color: #e6a23c;
  }

  span {
    font-size: 17px;
    color: #e6a23c;
  }
}

.empty_order {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #949599
}

.box {
  border-radius: 6px;
  background-color: #fff;
  padding: 20px;

  &_title {
    font-size: 16px;
    color: #000000d8;
    font-weight: 500;
    margin-bottom: 20px;
  }

  &:first-child {
    margin-bottom: 20px;
  }

  .detail {
    display: inline-block;
    margin-bottom: 10px;
  }

  .info {
    display: flex;
    justify-content: space-around;
    background-color: #f1f1f1;
    border-radius: 6px;
    min-height: 60px;
    padding: 20px 10px;

    div {
      display: flex;
      flex-direction: column;
      flex: 1;

      span {
        text-align: center;
        font-size: 22px;
        font-weight: 500;


        &:first-child {
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 16px;
        }
      }
    }
  }

  .hr {
    line-height: 1px;
    border-top: 1px dashed #939292;
    margin-bottom: 8px;
  }

  .tabs {
    ::v-deep {
      .el-tabs, .el-tabs__content, .el-tab-pane {
        height: 100%;
      }

      .el-tabs__content {
        height: calc(100% - 40px);
      }
    }

    .tab-list {
      overflow-y: auto;
      height: 100%;

      &-cell {
        .head {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: space-between;
          align-items: center;

          .left {
            display: flex;
            flex-direction: column;
            justify-content: center;

            span:first-child {
              font-size: 14px;
            }

            span:last-child {
              margin-top: 12px;
              font-size: 13px;
              color: #5a5e66;
            }
          }

          .right {
            height: 26px;
            min-width: 50px;
            border-radius: 20px;
            margin-right: .5rem;
            border: 2px solid #67C23A;
            color: #67C23A;
            padding: 6px;

            display: flex;
            align-items: center;
            justify-content: center;
          }

          .error {
            border: 2px solid #F56C6C;
            color: #F56C6C;
          }
        }
      }
    }
  }
}
</style>
