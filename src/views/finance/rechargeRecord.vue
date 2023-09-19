<template>
    <div class="app-container ">
        <div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">充值记录</div>
			</div>
			<div class="back_box">
				<!-- <el-button v-hold-click type="" @click="back">返回</el-button> -->
			</div>
		</div>
        <searchForm ref="searchRef"  :type="type"  @onSearch="onSearch" @onReset="onReset" :btnItems="'search,export,reset'"/>
        <div class="table-box">
            <div class="details"><span>充值记录</span><span @click="skip">发起充值申请<i class="el-icon-caret-right"></i></span></div>
            <div class="overview">
                <span>
                    <p>充值总金额（元）</p>
                    <p>￥{{aggregateAmount}}</p>
                </span>
                <span>
                    <p>总条款（个）</p>
                    <p>{{clause}}</p>
                </span>
                </div>
                <publicTable :tableData="tableData" :tagHeight="500" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
                </publicTable>
        </div>
    </div>
</template>
<script>
import basic from "@/mixins/basic"
import finance from "@/mixins/finance"
import { PlatformBillRecord } from "@/api/finance"
import publicTable from "@c/business/tables";
import searchForm from "./components/filter"
export default {
    components: {
        searchForm,
        publicTable
    },
    data() {
        return {
            type:'2',
            tableData:[],
            aggregateAmount:'',
            clause:'',
            columObj:{
                selection: false,
                selectType:false,
				index:true,
                loading:true,
                columnData: [
                {
                prop: "person",
                label: "发起人",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "billAmount",
                label: "金额",
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
                editRow: undefined,
                align: "center",
                },
                {
                prop: "status",
                label: "状态",
                status: true,
                width: "",
                align: "center",
                backColor:(row,$index)=>{
                    if(row.status =='已通过'){
                        return '#52C41A'
                    }else if(row.status =='已取消'){
                        return '#BFBFBF'
                    }else if(row.status =='充值审核中'){
                        return '#5674E5'
                    }
                }
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
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:true,
					pageData: {
						current: 1,
						size: 10,
					}
				},
        }
    },
    computed: {
    },
    mixins: [basic,finance],
    created() {
        this.getData()
    },
    mounted() {
        let that = this;
    },
    methods: {
        skip(){
            this.jump(`/finance/recharge`);
        },
         // 获取表格数据
        onSearch(val) {
            delete val.time;
            this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
            this.getData();
        },
        // 重置请求参数请求数据
        onReset(val) {
            this.pageObj.pageData.startDate = null
            this.pageObj.pageData.closeDate = null
            this.getData();
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
            PlatformBillRecord(this.pageObj.pageData).then((res)=>{
                if(res.code === 0){
                    this.tableData = res.data.rechargeRecordVoPage.records || []
                    this.columObj.loading = false
                    this.clause = res.data.size
                    this.aggregateAmount = res.data.rechargeAmount
                    this.pageObj.total = res.data.rechargeRecordVoPage.total
                }else{
                    this.$message.error('请求报错')
                }
            })
           
        },
    },
};
</script>
<style lang="scss" scoped>
.details{
    display: flex;
    justify-content: space-between;
	height: 60px;
	line-height: 60px;
	font-size: 14px;
}
.details span:first-child{
    margin-left: 10px;
}
.details span:last-child{
    margin-right: 10px;
    color: #4365AC;
    cursor: pointer;
}
.search-form-box{
    margin-top: 40px;
}
.line{
    width: 100%;
    background: #F2F5FA;
    height: 20px;
    padding: 15px 15px;
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