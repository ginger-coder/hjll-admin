<template>
    <div class="app-container ">
        <el-tabs  class="tabs" v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="结算管理" name="first">
            </el-tab-pane>
            <el-tab-pane label="结算审核" name="last">
            </el-tab-pane>
        </el-tabs>
        <searchForm  @onSearch="onSearch" :type="1" @onReset="onReset" @onAdd="onAdd" :btnItems="btnItem"/>
		<div class="table-box">
			<publicTable :tableData="tableData" :tagHeight="410" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
            </publicTable>
        </div>
    </div>
</template>
<script>
import basic from "@/mixins/basic"

import { queryUserSettlementPager } from "@/api/finance"
import publicTable from "@c/business/tables";
import searchForm from "./components/filter"
export default {
    components: {
        searchForm,
        publicTable
    },
    data() {
        return {
            activeName:'first',
            tableData:[],
            btnItem:'search,export,sponsor,reset',
            columObj:{
                selection: false,
                selectType:false,
                loading:true,
                index:true,
                columnData: [
                {
                prop: "batchNo",
                label: "批次号",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "settlementWallet",
                label: "钱包",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "belongProject",
                label: "所属项目",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "belongGroup",
                label: "所属工作组",
                text: true,
                width: "",
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
                prop: "settlementType",
                label: "结算方式",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "examinePerson",
                label: "审核人",
                text: true,
                width: "",
                align: "center",
                },
                
                {
                prop: "settlementAmount",
                label: "结算金额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.settlementAmount
                    
                }
                },
                {
                prop: "settlementTaxAmount",
                label: "结算金额（含税）",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.settlementTaxAmount
                    
                }
                },
                {
                prop: "workPersonNum",
                label: "人数",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "createTime",
                label: "创建时间",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "examineStatus",
                label: "审核状态",
                status: true,
                width: "",
                align: "center",
                backColor:(row,$index)=>{
                    if(row.examineStatus =='已通过'){
                        return '#52C41A'
                    }else if(row.examineStatus =='已取消'){
                        return '#BFBFBF'
                    }else if(row.examineStatus =='待审核'){
                        return '#5674E5'
                    }
                }
                },
                {
                        isOperation: true,
                        label: "操作",
                        width: "300",
                        fixed:'right',
                        operation: [{
                            operation: "confirm",
                            type: "text",
                            label: "查看详情",
                            icon: "",
                            color: '#4365AC',
                            isShow: (row, $index) => {
                                return true
                            }
                        }
                        ]
                    },
                ]
            },
			loading:false,
            row:{},
            flag:'1',
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:true,
					pageData: {
						current: 1,
                        queryType:null,
						size: 10,
					}
				},
        }
    },
    computed: {
    },
    mixins: [basic],
    created() {
        this.getData()
    },
    mounted() {
        let that = this;
    },
    methods: {
         // 获取表格数据
        onSearch(val) {
            this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
            this.getData();
        },
        // 重置请求参数请求数据
        onReset() {
            this.pageObj.pageData = {
                current: 1,
			    size: 10,
            }
            this.getData();
        },
        onAdd(){
            this.jump(`/finance/check`);
        },
        handleClick(tab, event) {
            if(this.activeName == 'first'){
                this.flag = '1';
                this.btnItem = 'search,export,sponsor,reset'
                this.getData();
            }else{
                this.getData();
                this.btnItem = 'search,export,reset'
                this.flag = '2';
            }
        },
        rowOperation(row, $index, now) {
            this.row = row
            this.jump(`/finance/settlement?id=${row.id}&examineStatus=${row.examineStatus}&settlementType=${row.settlementType}&flag=${this.flag}`);
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
            if(this.activeName == 'first'){
                // 结算管理列表
                this.pageObj.pageData.queryType = '1'
                this.tableData = []
                this.columObj.loading = true
                queryUserSettlementPager(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.tableData = res.data.records || []
                        this.columObj.loading = false
                        this.pageObj.total = res.data.total
                    }else{
                        this.$message.error('请求报错')
                    }
                })
            }else{
                // 结算审核列表
                this.pageObj.pageData.queryType = '2'
                this.tableData = []
                this.columObj.loading = true
                queryUserSettlementPager(this.pageObj.pageData).then((res)=>{
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
    },
};
</script>
<style lang="scss" scoped>
.tabs{
    padding: 15px 15px;
    background: #fff;
}
.rightTitle {
    height: 53px;
    margin-top: -20px;
    line-height: 53px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}
.table-box{
    background: #fff;
    padding: 15px;
}
.app-container {
    font-size: 0;
    position: relative;
    background: transparent;
    ::v-deep {
        .el-table {
            &::before {
                content: none;
            }
        }
    }


    .app-container-left {

        .el-scrollbar {
            height: calc(100% - 54px);
			.left_device_list{
				height: 100%;
				margin: 10px 0;
				padding: 0 10px;
				.left_device_list_item{
					font-size: 14px;
					padding: 10px 10px 10px;
					cursor: pointer;
					border-radius: 4px;
					margin-bottom: 4px;
					&:hover,&.activeSB{
						background: #2280DC;
						color: #ffffff;
					}

				}
			}
        }
		
    }



}
</style>