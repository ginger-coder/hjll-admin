<template>
    <div class="app-container ">
        <el-tabs  class="tabs" v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="账户余额" name="one">
            <div  class="accountBox">
            <div class="money">
                <div class="accountTitle">
                    <div class="title">
                        {{getWalletData.walletName}} <em>虚拟银行</em>
                    </div>
                    <div class="listBox">
                        <span @click="upHistory">充值记录</span> | <span @click="invoiceHistory">开票记录</span>
                    </div>
                </div>
                <div class="accountCenter">
                    <h3>
                        ￥{{money}}
                        <p>账户可用余额</p>
                    </h3>
                    <div class="accountBtns">
                        <el-button type="primary" @click="addUp">充值申请</el-button>
                        <el-button @click="addInvoice">开票申请</el-button>
                    </div>
                    <img src="@/assets/settle.png" alt="">
                </div>
            </div>
        </div>
            </el-tab-pane>
            <el-tab-pane label="每日对账" name="two">
                
            </el-tab-pane>
            <el-tab-pane label="提现管理" name="three">
                
            </el-tab-pane>
            <el-tab-pane label="流水管理" name="four">
                
            </el-tab-pane>
        </el-tabs>
        <searchForm ref="searchRef" v-if="activeName != 'one'"  :type="type"  @onSearch="onSearch" @onReset="onReset" :btnItems="'search,export,reset'"/>
        <div  v-if="activeName=='two'" class="table-box">
            <div class="details">基本列表</div>
            <publicTable :tableData="tableData" :tagHeight="410" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
            </publicTable>
        </div>
        <div  v-if="activeName=='three'" class="table-box">
            <div class="details">基本列表</div>
            <publicTable :tableData="depositData" :tagHeight="409" :columObj="columObj1" :pageObj="pageObj" @rowOperation="rowOperation"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
            </publicTable>
        </div>
        <div  v-if="activeName=='four'" class="table-box">
            <div class="details">基本列表</div>
            <div class="overview">
                <span>
                    <p>账户充值（元）</p>
                    <p>{{accountRecharge}}</p>
                </span>
                <span>
                    <p>个人提现（元）</p>
                    <p>{{withdrawAmount}}</p>
                </span>
            </div>
            <publicTable :tableData="waterData" :tagHeight="510" :columObj="columObj2" :pageObj="pageObj" @rowOperation="rowOperation"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
            </publicTable>
        </div>
        <!-- <Footers   v-if="activeName=='one'"/> -->
    </div>
</template>
<script>
import basic from "@/mixins/basic"
import finance from "@/mixins/finance"
import Footers from "./components/footer"
import { getBillData,getWalletList,getPlatformBill,getWithDraw,getDayReconciliation,getwallets } from "@/api/finance"
import publicTable from "@c/business/tables";
import searchForm from "./components/filter"
export default {
    components: {
        searchForm,
        Footers,
        publicTable
    },
    data() {
        return {
            activeName:'one',
            type:'2',
            money:'',
            accountRecharge:'',
            withdrawAmount:'',
            tableData:[], 
            depositData:[],
            waterData:[],
            columObj:{
                selection: false,
                selectType:false,
                loading:true,
                columnData: [
                {
                prop: "walletName",
                label: "钱包名称",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "initialBalance",
                label: "期初余额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.initialBalance
                    
                }
                },
                {
                prop: "endBalance",
                label: "期末余额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.endBalance
                    
                }
                
                },
                {
                prop: "statisticsDate",
                label: "日期",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "refertoDate",
                label: "参考点",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "accountRecharge",
                label: "账户充值",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.accountRecharge
                    
                }
                },
                {
                prop: "umsWithdraw",
                label: "个人提现",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.umsWithdraw
                    
                }
                },
                ]
            },
            columObj1:{
                selection: false,
                selectType:false,
                loading:true,
                index:true,
                columnData: [
                {
                prop: "orderId",
                label: "流水号",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "cashPersonName",
                label: "收款人姓名",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "cashPersonMobile",
                label: "收款人手机号",
                text: true,
                width: "",
                align: "center",
                
                },
                {
                prop: "collectionBankCard",
                label: "银行卡号",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "billAmount",
                label: "提现金额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.billAmount
                    
                }
                },
                {
                prop: "realityAccount",
                label: "提现金额（含税）",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.realityAccount
                    
                }

                },
                {
                prop: "billStatus",
                label: "提现结果",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "createAndPeriodTime",
                label: "创建时间/交割时间",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "remark",
                label: "备注",
                text: true,
                width: "",
                align: "center",
                },
                ]
            },
            columObj2:{
                selection: false,
                selectType:false,
                loading:true,
                index:true,
                columnData: [
                {
                prop: "orderId",
                label: "流水号",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "cashPersonName",
                label: "交易目标",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "billType",
                label: "所属业务",
                text: true,
                width: "",
                align: "center",
                
                },
                {
                prop: "billStatus",
                label: "状态",
                text: true,
                width: "",
                align: "center",
                },
                {
                prop: "billAmount",
                label: "数额",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.billAmount
                    
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
                prop: "createAndPeriodTime",
                label: "创建时间/交割时间",
                text: true,
                width: "",
                align: "center",
                },
                ]
            },
            getWalletData:{},
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:true,
					pageData: {
                        current:1,
						size: 10,
					}
				},
            perms:[]
        }
    },
    computed: {
    },
    mixins: [basic,finance],
    created() {
        this.getData()
    },
    mounted() {
        this.getWell()
        let that = this;
    },
    methods: {
         // 获取表格数据
        onSearch(val) {
            delete val.time;
            this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
            delete this.pageObj.pageData.closeDate 
            this.getData();
        },
        // 重置请求参数请求数据
        onReset() {
            this.pageObj.pageData = {
                current:1,
			    size: 10,
            }
            this.getData();
        },
        handleClick(tab, event) {
            if(this.$refs.searchRef){
                this.$refs.searchRef.time = ''
                this.$refs.searchRef.formData = {}
            }
            if(this.activeName == 'four'){
                this.type = '4'
            }else if(this.activeName == 'two'){
                this.type = '3'
            }else{
                this.type = '2'
            }
            
            this.pageObj.pageData.current = 1
            this.pageObj.pageData.size = 10
            this.onReset()
        },
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
        getWell(){
            getWalletList({}).then((res)=>{
                if(res.code == 0){
                    this.getWalletData = res.data.walletVos[0]
                    this.money = res.data.walletVos[0].accountBalance
                    
                }
            })
            // getwallets({}).then((res)=>{
            //     if(res.code == 0){
            //     //   this.money = this.fmoney(res.data[0].invoiceAmount)
            //     }
            // })
        },
        getData(){
            if(this.activeName == 'two'){
                // 每日对账列表
                getDayReconciliation(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.tableData = res.data.records || []
                        this.columObj.loading = false
                        this.pageObj.total = res.data.total
                    }else{
                        this.$message.error('请求报错')
                    }
                })
            }else if(this.activeName == 'three'){
                // 提现管理列表
                getWithDraw(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.depositData = res.data.records || []
                        this.columObj1.loading = false
                        this.pageObj.total = res.data.total
                    }else{
                        this.$message.error('请求报错')
                    }
                })
            }else if(this.activeName == 'four'){
                // 流水管理列表
                getPlatformBill(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.waterData = res.data.platformBillVoPage.records || []
                        this.accountRecharge = res.data.accountRecharge
                        this.withdrawAmount = res.data.personWithdraw
                        this.columObj2.loading = false
                        // this.rechargeAmount = res.data.rechargeAmount
                        // this.withdrawAmount = res.data.withdrawAmount
                        this.pageObj.total = res.data.platformBillVoPage.total
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
.details{
	height:40px;
	line-height: 40px;
	font-size: 16px;
	color: #000;
}
.line{
    width: 100%;
    background: #F2F5FA;
    height: 20px;
    padding: 15px 15px;
}
.overview{
    height: 80px;
    line-height: 80px;
    width: 100%;
    text-align: center;
    margin:  0 0 10px 0 ;
    background: #F2F5FA;
}
.overview span{
    display: inline-block;
    width: 50%;
    font-size: 14px;
    color: #000;
}
.overview span p{
    line-height: 20px;
}
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
.accountBox{
    width: 100%;
    height: 386px;
    background: #fff;
    color: #000;
    font-size: 14px;
}
.accountBox .money{
    height: 386px;
    width: 100%;
    margin: 0 auto;
    background: linear-gradient(360deg, #FAFBFD 0%, #F2F5FA 100%);
    border-radius: 12px;
    position: relative;
}
.accountTitle{
    padding: 40px 0 0 40px;
    display: flex;
    justify-content: space-between;
}
.accountTitle .title{
    color: rgba(0,0,0,0.75);
    background: transparent !important;
}
.accountTitle .title em{
    font-style: normal;
    display: inline-block;
    background: rgba(86,116,229,0.1);
    border-radius: 3px;
    font-size: 14px;
    padding: 3px;
    color: #4365AC;
    margin-left: 40px;
}
.accountTitle .listBox{
    color: #4365AC;
    margin-right: 40px;
}
.accountTitle .listBox span{
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
}
.accountCenter{
    width: 95%;
    height: 266px;
    margin: 0 auto;
    margin-top: 20px;
    background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 100%);
    border-radius: 12px;
    padding: 20px 0 0 20px;
}
.accountCenter h3{
    font-size: 40px;
    font-weight: 600;
    margin: 0;
    margin: 40px 0 0 40px;
    color: #000;
}
.accountCenter h3 p{
    font-size: 16px;
    font-weight: 400;
    color: rgba(0,0,0,0.45);
    line-height: 22px;
}
.accountBtns{
    margin:60px 0 0 40px;
}
.accountCenter img{
    position: absolute;
    right: 200px;
    width: 266px;
    height: 166px;
    top: 160px;
}
</style>