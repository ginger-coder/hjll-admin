<template>
  <div>
    <publicTable  :tableData="tableData" :tagHeight="330" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
          @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
      </publicTable>
  </div>
</template>

<script>
import publicTable from "@c/business/tables";
import { querySingleUserWorkers } from "@/api/finance"
export default {
  components: {
    publicTable
  },
  props: {
    // 显示
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    settlementId:'',
    row:{}
  },

  data() {
    return {
      tableData:[],
      columObj:{
				      selection: false,
              selectType:false,
				      index:true,
              loading:true,
				      columnData: [
                {
                prop: "serialNumber",
                label: "工单编号",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "orderTypeCode",
                label: "工单类型",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "promoter",
                label: "发起人",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "actualMoney",
                label: "金额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.actualMoney
                    
                }
                },
                {
                prop: "remark",
                label: "备注",
                text: true,
                width: "",
                align: "center",
                },
				{
                prop: "updateTime",
                label: "工单完成时间",
                text: true,
                width: "",
                align: "center",
                },
                ]
			},
      pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
          show:true,
					pageData: {
						current: 1,
						size: 10,
					}
				},
    };
  },
  mounted() {
    this.getData()
  },
  created() {
  },
  methods: {
    rowOperation(row, $index, now) {
      },
      // 复选框选中添加id
      handleSelectionChange(row) {
          this.selectIds = row.selectKey
      },
      //页码变化
      handleCurrentChange(e) {
          this.pageObj.pageData.current = e;
          this.getData()
      },
      //条数变化
      handleSizeChange(e) {
          this.pageObj.pageData.size = e;
          this.pageObj.pageData.current = 1;
          this.getData()
      },
      getData(){
        console.log(this.row)
        this.pageObj.pageData.userId = this.row.userId
        let settlementCycle = this.row.settlementCycle
        this.pageObj.pageData.startTime = settlementCycle.substr(0, 19)
        this.pageObj.pageData.endTime = this.row.settlementCycle.slice(-19)
        this.pageObj.pageData.settlementId = this.settlementId
        querySingleUserWorkers(this.pageObj.pageData).then((res)=>{
				if(res.code === 0){
					this.tableData = res.data.records || []
					this.columObj.loading = false
					this.pageObj.total = res.data.total
				}else{
					this.$message.error('请求报错')
				}
			})
      }
  },
};
</script>
<style scoped lang="scss">
 .el-cascader-menu{
    max-width:250px;
  }
::v-deep .selets {
  .tags-select-input {
    height: 40px;
    .el-select__tags {
      white-space: nowrap;
      overflow: hidden;
      flex-wrap: nowrap;
    }
  }

  .el-select__tags-text {
    display: inline-block;
    max-width: 85px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.search-form-box {
  background: #fff;
  padding: 15px 0;
  margin-bottom: 20px;
}
.btn-box {
  display: inline-block;
  margin-left: 35px;
}

.up-down {
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
  color: #5674e5;
  font-size: 14px;
}
.up-down i {
  margin-left: 5px;
}
.search-form-box .el-input{
    margin-right: 15px;
}
</style>