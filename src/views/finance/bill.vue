<template>
    <div class="app-container ">
		<div class="table-box">
			<div ref="pageHead">
                <el-form ref="searchs" :model="pageObj.pageData" class="form_horizontal">
                    <el-form-item label="提现人：" >
                        <el-input  placeholder="请输入" clearable v-model="pageObj.pageData.name" @clear="do_search" @keyup.enter.native="do_search">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="账单类型：" >
                        <el-select v-model="pageObj.pageData.digest"  placeholder="请选择">
                            <el-option v-for="(item,index) in moneyTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="账单方类型：" >
                        <el-select v-model="pageObj.pageData.type1"  placeholder="请选择">
                            <el-option v-for="item in peopleTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
                        <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
                    </el-form-item>
                </el-form>
				<!-- <div v-if="perOperate" class="page_handle_group">
					<el-button type="primary" icon="el-icon-plus" v-hold-click @click="">新增</el-button>
					<el-button type="" icon="" v-hold-click @click="">批量操作</el-button>
					<el-button type="" icon="el-icon-more"></el-button>
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
			<publicTable :tableData="tableData" :tagHeight="230" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
            </publicTable>
        </div>
    </div>
</template>
<script>
import basic from "@/mixins/basic"

import { getBillData } from "@/api/finance"
import publicTable from "@c/business/tables";
import { menusResources, menusRoutes } from "@/api/menu"
import { parseTime,dateFormat } from "@/utils";
import variables from "@/styles/variables.scss"
import {moneyTypeList,peopleTypeList} from '@/utils/finance'
export default {
    components: {
        publicTable
    },
    data() {
        return {
            // pageFun: getBillData,
            apiKey: 'id',
            moduleTitle: '角色',
            searchs_default:{
                // pages:true
            },
            moneyTypeList,
            peopleTypeList,
            tableData:[], 
            columObj:{
                selection: false,
                selectType:false,
                loading:true,
                columnData: [
                {
                prop: "cashOutNumber",
                label: "账单编号",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "digest",
                label: "账单类型",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "name",
                label: "账单方",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "money",
                label: "账单金额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.money
                    
                }
                },
                {
                prop: "amount",
                label: "账户余额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.amount
                    
                }
                },
                {
                prop: "createTime",
                label: "账单时间",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return dateFormat("YYYY-mm-dd HH:MM:SS", new Date(row.createTime))
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
                            label: "详情",
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
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:true,
					pageData: {
                        name:null,
						page: 1,
                        digest:null,
						size: 30,
					}
				},
            perms:[]
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
        do_search(){
            this.getData()
        },
        search_reset(){
            this.pageObj.pageData.name = null
            this.pageObj.pageData.digest = null
            this.$refs.searchs.resetFields()
            this.getData()
        },
        rowOperation(row, $index, now) {
            this.jump(`/finance/billInfo?id=${row.id}`);
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
            getBillData(this.pageObj.pageData).then((res)=>{
                if(res.code === 0){
                    this.tableData = res.data.records || []
                    this.columObj.loading = false
                    this.pageObj.total = res.data.total
                }else{
                    this.$message.error('请求报错')
                }
            })
        },
    },
};
</script>
<style lang="scss" scoped>

.rightTitle {
    height: 53px;
    margin-top: -20px;
    line-height: 53px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}
.table-box{
    padding: 15px;
}
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