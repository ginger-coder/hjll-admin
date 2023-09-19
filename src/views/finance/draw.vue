<template>
    <div class="app-container ">
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        class="dialog"
        >
        <h3>确定线下发放吗？</h3>
        <p>参考打款信息：{{row.bank}}</p>
        <p>收款行：{{row.openBank}}</p>
        <div class="copy">卡号：{{row.bankCard}}<el-button type="text" @click="copy(row.bankCard)">复制</el-button></div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
        </el-dialog>
		<div class="table-box">
			<div ref="pageHead">
                <el-form ref="searchs" :model="pageObj.pageData" class="form_horizontal">
                    <el-form-item label="提现人：" >
                        <el-input  placeholder="请输入" clearable v-model="pageObj.pageData.name" @clear="do_search" @keyup.enter.native="do_search">
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item label="提现方类型：" id="aaaa">
                        <el-select v-model="searchs.type1"  placeholder="请选择" @change="do_search">
                            <el-option v-for="item in peopleTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="状态：" >
                        <el-select v-model="pageObj.pageData.cashOutStatus"  placeholder="请选择" >
                            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请时间：" >
                        <el-date-picker v-model="time" type="daterange" range-separator="~" start-placeholder="开始日期"
                            end-placeholder="结束日期" @change="changeTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
                        <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
                    </el-form-item>
                </el-form>
				<div v-if="perOperate" class="page_handle_group">
					<el-button type="" icon="" v-hold-click @click="batchOperation(1)">批量通过审核</el-button>
					<el-button type="" icon="" v-hold-click @click="batchOperation(2)">批量拒绝审核</el-button>
					<!-- <el-button type="" icon="" v-hold-click @click="">批量更改为通过审核</el-button> -->
				</div>
			</div>
			<publicTable :tableData="tableData" :tagHeight="280" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
            </publicTable>
		</div>
    </div>
</template>
<script>
import basic from "@/mixins/basic"
import publicTable from "@c/business/tables";
import { cashList,cashStatus } from "@/api/finance"
import { menusResources, menusRoutes } from "@/api/menu"
import { parseTime,dateFormat } from "@/utils";
import variables from "@/styles/variables.scss"
import {statusList,peopleTypeList} from '@/utils/finance'
export default {
    components: {
        publicTable
    },
    data() {
        return {
            apiKey: 'id',
            moduleTitle: '角色',
            dialogVisible: false,
            row:{
                // id:'6214891098019090'
            },
            rowList:[],
            peopleTypeList,
            statusList,
            searchs_default:{
                // pages:true
            },
            tableData:[], 
            columObj:{
                selection: true,
                selectType:false,
                loading:true,
                columnData: [
                {
                prop: "bankCard",
                label: "提现卡号",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "bank",
                label: "提现方/被奖励方",
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
                prop: "cashOutStatus",
                label: "审核状态",
                ownDefined: true,
                width: "",
                ownDefinedReturn:(row, $index) => {
                    if(row.cashOutStatus==1){
                    //     return  <template>
                    //     <el-tag type="primary" disable-transitions>审核通过</el-tag>
                    // </template>
                        return '审核通过'
                    }else if(row.cashOutStatus==2){
                        return '审核拒绝'
                    }else{
                        return '待审核'
                    }
                    
                },
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
                prop: "createTime",
                label: "提现时间",
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
                        width: "320",
                        fixed:'right',
                        operation: [
                            {
                                operation: "details",
                                type: "text",
                                label: "详情",
                                icon: "",
                                color: '#4365AC',
                                isShow: (row, $index) => {
                                    return true
                                }
                            },
                            {
                                operation: "confirm",
                                type: "text",
                                label: "审核通过",
                                icon: "",
                                color: '#67c23a',
                                isShow: (row, $index) => {
                                    if(row.cashOutStatus==0){
                                        return true
                                    }else{
                                        return false
                                    }
                                }
                            },
                            {
                                operation: "trun",
                                type: "text",
                                label: "审核驳回",
                                icon: "",
                                color: '#f56c6c',
                                isShow: (row, $index) => {
                                    if(row.cashOutStatus==0){
                                        return true
                                    }else{
                                        return false
                                    }
                                }
                            },
                            {
                                operation: "grant",
                                type: "text",
                                label: "线下发放",
                                icon: "",
                                color: '#4365AC',
                                isShow: (row, $index) => {
                                    if(row?.cashOutStatus == 1){
                                        return true
                                    }else{
                                        return false
                                    }
                                }
                            },
                            {
                                operation: "cancel",
                                type: "text",
                                label: "取消线下发放",
                                icon: "",
                                color: '#4365AC',
                                isShow: (row, $index) => {
                                    if(row?.cashOutStatus == 3){
                                        return true
                                    }else{
                                        return false
                                    }
                                }
                            }
                        ]
                    },
                ]
            },
			loading:false,
            time:null,
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:true,
					pageData: {
                        name:null,
                        startTime:null,
                        endTime:null,
                        cashOutStatus:'',
						current: 1,
						size: 30,
					}
				},
			loading:false,
            selectKey:[],
            selectIds:[],
            status:null,
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
        changeTime(val){
            if(val){
                this.pageObj.pageData.startTime = parseTime(val[0])
                this.pageObj.pageData.endTime = parseTime(val[1])
            }else{
                this.pageObj.pageData.startTime = null
                this.pageObj.pageData.endTime = null
            }
        },
        search_reset(){
            this.pageObj.pageData.name = null
            this.pageObj.pageData.cashOutStatus = null
            this.pageObj.pageData.startTime = null
            this.pageObj.pageData.endTime = null
            this.time = null
            this.$refs.searchs.resetFields()
            this.getData()
        },
        do_search(){
            this.getData()
        },
        // 批量操作
        operationList(){
            cashStatus({
                ids:this.selectIds,
                status:this.status,
            }).then((res)=>{
                if(res.code == 0){
                    this.$message.success('操作成功')
                    this.getData()
                }
            })
        },
        rowOperation(row, $index, now) {
            if(now =='details'){
                // 详情跳转
                this.jump(`/finance/drawInfo?id=${row.id}`);
            }else if(now =='confirm'){
                // 审批通过
                this.status = 1
                this.audit_change('audit',row)
            }else if(now =='trun'){
                // 审批驳回
                this.status = 2
                this.audit_change('disable',row)
            }else if(now =='grant'){
                // 线下发放
                this.openCard(row)
            }else{
                // 取消线下发放
                this.status = 0
                this.audit_change('cancel',row)
            }
        },
        // 复选框选中添加id
        handleSelectionChange(row) {
            this.rowList = []
            this.selectIds = []
            this.rowList = row.row
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
            cashList(this.pageObj.pageData).then((res)=>{
                if(res.code === 0){
                    this.tableData = res.data.records || []
                    this.columObj.loading = false
                    this.pageObj.total = res.data.total
                }else{
                    this.$message.error('请求报错')
                }
            })
        },
        handleConfirm() {
            this.status = 3
            cashStatus({
                ids:[this.row.id],
                status:this.status,
            }).then((res)=>{
                if(res.code == 0){
                    this.dialogVisible = false
                    this.$message.success('操作成功')
                    this.getData()
                }
            })
            
        },
        batchOperation(type){
            let status = true
            if(this.selectIds.length!=0){
                // 批量操作 1通过 2驳回 先判断是否有不能操作的审核的数据有提示 无正常审核或拒绝
                this.rowList.forEach((item,index)=>{
                    if(item.cashOutStatus !== 0){
                        status = false
                        this.$message.warning('当前数据有不可操作审核的内容！')
                    }
                })
                if(status){
                    this.status = type
                    this.operationList()
                }
            }else{
                this.$message.warning('批量操作请先选择列表内容')
            }
            
        },
        openCard(row){  
            this.row = {}
            this.row = row
            this.dialogVisible = true
        },
        copy(data){
            let OrderNumber = data;
            let newInput = document.createElement("input");
            newInput.value = OrderNumber;
            document.body.appendChild(newInput);
            newInput.select();
            document.execCommand("Copy");
            newInput.remove();
            this.$message({
                message: "复制成功",
                type: "success",
            });
        },
        audit_change:function(command,row){
            this.row = {}
            this.row = row
            let text = ''
            switch (command) {
				case "audit":
					// 通过审核
					text = '确定通过审核吗？'
                    break;
				case "disable":
					// 拒绝通过审核
                    text = '确定驳回审核吗？'
                    break;
				case "offline":
					// 线下发放
                    text = '确定线下发放吗？'
                    break;
				case "cancel":
					// 取消线下发放
                    text = '确定取消线下发放吗？'
                    break;

            }
            var that = this
            that.$confirm(text, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
                    cashStatus({
                            ids:[row.id],
                            status:this.status,
                        }).then((res)=>{
                            if(res.code == 0){
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
				})
				.catch(() => {});
        },
    },
};
</script>
<style lang="scss" scoped>

.table-box{
    padding: 15px;
}
.rightTitle {
    height: 53px;
    margin-top: -20px;
    line-height: 53px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
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
.dialog{
}
.dialog p{
    margin: 15px 0;
}
.dialog .copy{
    margin: 10px 0;
    margin-top: -10px;
}
.copy button{
    margin-left: 20px;
}
</style>