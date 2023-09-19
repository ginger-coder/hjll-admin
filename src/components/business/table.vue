<template>
  <div :class="{'m___table': true, '': alertStatus, hasPagination}" ref="mTable" :style="{'height':height}">
    <el-alert v-if="alertText && alertStatus" class="table_alert" type="info" show-icon close-text="清空" @close="close">
      <template slot="title">
        <div class="table_alert_title">
          已选择<span class="table_alert_title_num">{{ row.length || 0 }}</span>项
        </div>
      </template>
    </el-alert>
    <el-table v-loading="loading || tableLoading"
              class="no_border_table m___el-table"
              ref="m___table"
              :data="getData"
              :height="'100%'"
              fit
              highlight-current-row
              border
              :row-key="getRowKeys"
              @select="(selection, row) => handleSelectEmit(selection, row, 'check')"
              @select-all="(selection) => handleSelectEmit(selection, null ,'checkAll', getData)"
              v-bind="$attrs">
      <el-table-column type="selection" v-if="select" width="60" align="center"/>
      <template v-for="(el, index) in columns">
        <!--  组件的子级要包含 slotName 的标签   -->
        <slot v-if="el.slot" :name="el.slot"></slot>
        <component
            v-else-if="el.component"
            :is="el.component"
            :col-config="el">
        </component>
        <el-table-column v-else v-bind="el" :key="el[rowKey] || index"/>
      </template>
    </el-table>
    <div class="m___table-pagination" v-if="hideOnSinglePage && total > 0">
      <el-pagination
          ref="mTablePagination"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="current"
          :page-size="size"
          layout="total,prev, pager, next,sizes, jumper"
          :total="total"
          v-bind="pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

/**
 * 业务组件: 内部处理了请求数据，分页，多选功能
 * interface columnsItem {
 *    label?: string,
 *    prop?: string,
 *    slot?: string
 *    [propName: string]: any;
 * }
 * interface select
 * interface props {
 *   columns: columnsItem[],
 *   request: Function,
 *   select-change: (selection, row) => void,
 *   [propName: string]: any;
 * }
 *
 * @param {Function} request 请求 table 数据的函数,父级传入;如果父级已有 table data的数据，组件只负责展示，request 就不要传
 * @param {Function} dispose 自定义处理 request 完成之后得数据，最终返回处理结果 (el-table 得 data)
 * @param {[]} columns 循环生成 el-table-column 的数据,自定义显示需要手写对应的slot,写法和el-table的一样
 * @param {Function} select-change 自定义触发的 emit事件, 是对应 el-table 的 @select-all 和 @select事件
 *
 * $attrs 负责传递 el-table 的其他props，可以参考文档
 *
 * @example
 * columns: [{ align: 'center', prop: 'name', label: 姓名, ...el-table-columnProps}]
 * <m-table select @select-change=selectChange :columns='columns' :request='getTableData'/>
 *
 * @example slot用法
 * columns: [{ align: 'center', prop: 'name', label: 姓名, ...el-table-columnProps}, {slot: Action}]
 * <m-table select @select-change=selectChange :columns='columns' :request='getTableData'>
 *      <el-table-column slot="Action" label="操作" width="120">
 *        <template slot-scope="{ row }">{{row}}</template>
 *     </el-table-column>
 *   <m-table/>
 *
 *  @example
 * <m-table :columns='columns' :data='[]' {...el-table-props}/>
 * */

/**
 * m___table table 想要局部滚动就需要把他的父级高度明确或者父级 flex 之后 height: 100%
 * table 默认heigit: 100%;
 * 分页定位在了 m___table 的最下位置,padding-bottom: 分页的高度 + 10px
 * 注意 父级的 overflow:hidden
 * */

/**
 * @param res {Object} 请求结果
 * @param vm {this} 组件的 this
 * 内部处理接口返回的数据
 * */
function handleRequestRes(res, vm) {
  const data = res?.data || res || {};
  if (!res || !data) return [];
  if (Array.isArray(data)) {
    vm.dataSource = data;
    vm.total = data.length || 0;
    vm.current = 1;

  } else {
    const {total, records, list} = data;
    vm.total = total || 0;
    vm.dataSource = records || list ||  [];
    vm.current = data?.current || 1;
  }
  /**
   * 数据处理完成的通知, 返回组件的this, 不要直接操作this
   * 功能: 页面上多个 table联动B依赖A的结果
   * */
  vm.$emit('done', vm);
}

export default {
  name: "m-table",
  props: {
    height: {
      type: String,
      default: '100%'
    },
    columns: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String, // 这个值是 key
      default: 'id'
    },
    defaultSize: {
      type: Number,
      default: 10
    },
    height: {
      type: String,
      default: '100%'
    },
    defaultCurrent: {
      type: Number,
      default: 1
    },
    select: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean,
      default: false
    },
    alertText: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideOnSinglePage: {
      type: Boolean,
      default: true
    },
    // url: {
    //   type: String,
    //   default: false
    // },
    request: Function,
    dispose: {
      type: Function,
      default: handleRequestRes
    },
    // 表单联动的参数
    payload: {
      type: Object,
      default: () => ({})
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    active: {
        type: Array,
        default: () => []
    }
  },
  data() {
    return {
      dataSource: [],
      row: [],
      selectKey: [],
      allRow: [],
      total: 0,
      tableLoading: false,
      maxHeight: undefined,
      current: 1,
      size: 10,
      timeOutId: undefined
    }
  },
  created() {
    if (this.defaultSize) {
      this.size = this.defaultSize || 10;
    }
    if (this.defaultCurrent) {
      this.current = this.defaultCurrent || 1;
    }
    this.init();
  },
  methods: {
    getTableRef(){
      return this.$refs.m___table
    },
    setTableHeight() {
      const tableTop = this.$refs.mTable.getBoundingClientRect()?.top || 0;
      const appMain = document.querySelector('.app-main')
      const tablePagination = document.querySelector('.m___table-pagination')
      this.maxHeight = appMain.offsetHeight - tableTop - tablePagination.clientHeight - 25
    },
    // 重置请求 父级可以通过ref获取实例并调用
    resetInit(props) {
      this.total = 0;
      // this.current = 1;
      this.init(props);
    },
    // 初始请求
    async init(props) {
      const {current, size, payload, request, tableLoading, timeOutId} = this;
      if (timeOutId) {
        clearTimeout(timeOutId);
        this.tableLoading = false;
      }
      if (request && typeof request === "function") {
        this.timeOutId = setTimeout(() => {
          if (tableLoading) return false;
          this.tableLoading = true;
          request({
            current,
            size,
            ...payload,
            ...props
          })
              .then(res => {
                let time = setTimeout(() => {
                  this.tableLoading = false;
                  clearTimeout(time)
                }, 500)
                this.dispose.call(null, res, this)
              })
              .catch(error => {
                const data = error?.response?.data?.status;
                if (data !== 200) {
                  this.dispose.call(null, {}, this)
                }
              })
              .finally(() => {
                this.tableLoading = false;
                clearTimeout(timeOutId);
              })
        }, 0)
      }
    },
    handleSelectEmit(selection, row, type, pageData = []) {
      this.row = (selection || []).map(el => {
        el.current = this.current;
        return el;
      });
      this.selectKey = selection?.map(el => el[this.rowKey])?.filter(el => el) || [];
      this.$emit('select-change', {
        row: this.row,
        selectKey: this.selectKey,
        type,
        current: this.current,
        activeRow: row,
        pageData,
        // allRow: this.allRow,
      })
    },
    close() {
      this.$refs.m___table?.clearSelection();
      this.handleSelectEmit([])
    },
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.$emit('update:current', this.current);
      this.$emit('update:size', size);
      this.init();
    },
    handleCurrentChange(current) {
      this.current = current;
      this.$emit('update:current', current);
      this.init();
    },
    //指定key值,数据更新之后保留之前选中的数据
    getRowKeys(row){
      return row.id;
    }
  },
  computed: {
    alertStatus() {
      return !!this.row?.length
    },
    getData() {
      if (!this.request) return this.$attrs?.data || [];
      if(this.dataSource.length==0){
        if(this.current == 1){
          this.current = 1
        }else{
          this.current=this.current-1
          setTimeout(() => {
            this.init();
          }, 500);
        }
      }
      return this.dataSource || [];
    },
    hasPagination() {
      return this.hideOnSinglePage && this.total > 1 ? ' has-pagination' : ''
    },
  },
  watch: {
    /**
     * 异步修改父级的 loading
     * <m-table :loading.sync="loading"/>
     * */
    'tableLoading': function (val) {
      this.$emit('update:loading', val);
    },
    /**
     * @param val {Object}
     * @param old {Object}
     * 判断是否相等, 不相等触发分页重置和用新参数重新请求
     * payload 不要用 v-modal
     * */
    'payload': function (val, old) {
      console.log(val, old, !_.isEqual(val, old));
      if (!_.isEqual(val, old)) {
        this.resetInit(val);
      }
    },
    /**
     * @param val {Boolean}
     * @param old {Boolean}
     * 不重置分页, 触发一次请求
     * */
    'refresh': function (val, old) {
      if (val !== old) {
        this.init();
      }
    },
    'defaultCurrent': function (val, old) {
      if (val !== old) {
        this.current = val
        this.init();
      }
    },
    'defaultSize': function (val, old) {
      if (val !== old) {
        this.size = val
        this.init();
      }
    },
  },
  deactivated() {
    this.row = null;
    this.selectKey = [];
  }
}
</script>

<style lang="scss">
.m___table {
  --pagination-height: 52px;
  //padding-bottom: var(--pagination-height);
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 54px;
  position: relative;
  transition: all .3s;

  .m___el-table {
    position: relative;
    width: 100%;
  }

  .m___table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: var(--pagination-height);
    position: absolute;
    right: 0;
    left: 0;
    background-color: #fff;
    z-index: 99;
    box-shadow: 0 -1px 3px 0 rgb(100 100 100 / 12%);
  }

  .table_alert {
    border: 1px solid #BAE7FF;
    background-color: #E6F7FF !important;
    margin-bottom: 15px;

    .table_alert_title {
      color: #000000 !important;
    }

    .table_alert_title_num {
      color: #1890FF;
      padding: 0 5px;
    }

    .el-alert__icon, .el-alert__closebtn {
      color: #1890FF !important
    }
  }
}

.m___table.has-pagination {
  padding-bottom: calc(var(--pagination-height));
}

.m___table.has-alert {
  padding-bottom: calc(var(--pagination-height) + 10px + 36px + 15px);
}


</style>
