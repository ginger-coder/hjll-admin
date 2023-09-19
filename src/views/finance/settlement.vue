<template>
	<div class="formPage settlement" ref="rmInfo">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box">
				<el-button
				v-hold-click
				type="primary"
				v-if="flag == '2'&& examineStatus=='待审核'"
				@click="submit('1')"
				>确认结算</el-button
				>
				<el-button v-hold-click v-if="flag == '2'" type="" @click="download">下载账单</el-button>
				<el-button v-hold-click v-if="flag == '2'&& examineStatus=='待审核'" type="danger" @click="submit('-1')">取消结算</el-button>
			</div>
		</div>
		<div class="form_box scrllbar">
			<div class="details">结算信息</div>
			<div class="details_box">
				<el-form  label-width="140px">
					<el-form-item label="批次号：">
						{{ detailData.batchNo || '-' }}
					</el-form-item>
					<el-form-item label="结算发起人：">
						{{ detailData.promoter || '-'}}
					</el-form-item>
					<el-form-item label="结算审核人：">
						{{ detailData.examinePerson ||'-' }} 
					</el-form-item>
					<el-form-item label="钱包：">
						{{ detailData.settlementWallet ||'-' }} 
					</el-form-item>
					<el-form-item label="本次结算总金额：">
						￥{{ detailData.settlementAmount ||'-' }} 
					</el-form-item>
					<el-form-item label="结算状态：">
						<span style="color:#2879FF">{{detailData.examineStatus|| '-'}}</span>
					</el-form-item>
					<el-form-item label="结算方式：">
						{{ settlementType ||'-' }} 
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="table_box">
			<div class="details">付款信息</div>
			<div class="details_tab">	
				<publicTable  :tableData="tableData" :tagHeight="560" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
                </publicTable>
			</div>
		</div>
		<!--查看详情弹框-->
			<el-dialog
			:title="detail.title"
			destroy-on-close
			v-if="detail.visible"
			class="el-dialog-unify el-dialog-medium"
        	width="1284px"
			:visible="detail.visible"
			:before-close="handleClose">
			<div class="detail_titleBox">
				<span>批次号：{{detailData.batchNo}}</span>
				<span>收款人：{{row.userName}}</span>
			</div>
			<Detail :row="row" :settlementId="id"/>
		</el-dialog>
		<!-- 确认结算输入密码弹框 -->
		<el-dialog v-if="dialogFormVisible" :before-close="close" title="提示" :visible.sync="dialogFormVisible">
			<!-- <el-form :model="form">
				<el-form-item label="" >
					<el-input v-model="form.pwd" show-password></el-input>
					<el-checkbox class="remember" v-model="checked">记住安全操作码（30分钟）</el-checkbox>
				</el-form-item>
			</el-form> -->
				<div class="himt" v-if="type == '1'">
					<p><i class="el-icon-warning-outline"></i>是否确认结算全部付款申请</p>
					<p></p>
				</div>
				<div class="himt"  v-else>
					<p><i class="el-icon-warning-outline"></i>是否确认删除全部付款申请</p>
					<el-form >
						<el-form-item label="">
							<el-input v-model="examineRemark" placeholder="请输入备注"></el-input>
						</el-form-item>
					</el-form>
				</div>
				
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="sure">确 定</el-button>
			</div>
			</el-dialog>
			<el-dialog
		title="提示"
		:visible.sync="dialogVisible"
		:before-close="handleClose">
		<div class="himt">
			<p><i class="el-icon-warning-outline"></i>是否确认删除本条结算申请</p>
			<p>
				<span>收款人：{{row.userName}}</span>
				<span>实发金额：￥{{row.settlementAmount}}</span>
			</p>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="deleteRow">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { parseTime,dateFormat } from "@/utils";
import { querySettlementUserPager,queryInitiateSettlementDetail ,postSettlementExamine,updateSettlementDetail} from "@/api/finance"
import Detail from "./components/detail"
import publicTable from "@c/business/tables";
export default {
	components: {
		Detail,
		publicTable,
	},
	data() {
		return {
			detail:{
				title:'查看结算明细',
				visible:false,
			},
			form:{
				pwd:''
			},
			flag:null,
			dialogVisible:false,
			checked:false,
			dialogFormVisible:false,
			row:{},
			type:'',
			examineRemark:null,
			tableData:[],
			columObj:{
                selection: false,
                selectType:false,
				index:true,
                loading:true,
                columnData: [
                {
                prop: "userName",
                label: "收款人",
                text: true,
                editRow: undefined,
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
                prop: "settlementStatus",
                label: "审核状态",
                status: true,
                width: "",
                align: "center",
                backColor:(row,$index)=>{
                    if(row.settlementStatus =='已审核'){
                        return '#52C41A'
                    }else if(row.settlementStatus =='已取消'){
                        return '#BFBFBF'
                    }else if(row.settlementStatus =='待审核'){
                        return '#5674E5'
                    }
                }
                },
                {
                prop: "settlementCycle",
                label: "结算周期",
                text: true,
                width: "",
                align: "center",
                },
				{
					isOperation: true,
					label: "结算明细",
					operation: [{
						operation: "confirm",
						type: "text",
						label: "查看",
						icon: "",
						color: '#4365AC',
						isShow: (row, $index) => {
							return true
						}
					}
					]
                },
                {
                prop: "createTime",
                label: "创建时间",
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
						settlementId:'',
						size: 10,
					}
				},
			title: "详情",
			id: "",
			examineStatus:null,
			settlementType:null,
			dateFormat,
			detailData:{},
			pageFun:null,
		};
	},
	mixins: [basic],
	created() {
		
	},
	mounted() {
		var that = this
		const { id,examineStatus,settlementType,flag } = this.$route.query;
		this.id = id;
		this.flag = flag
		this.examineStatus = examineStatus
		this.settlementType = settlementType
		if(flag==2 && settlementType =='手动结算' && examineStatus =='待审核'){
			this.columObj.columnData.push({
				isOperation: true,
				label: "操作",
				operation: [{
					operation: "del",
					type: "text",
					label: "移除",
					icon: "",
					color: '#4365AC',
					isShow: (row, $index,color) => {
						if(row.settlementStatus == '待审核'){
							return true
						}else{
							return false
						}
					}
				}
				]
			})
		}else{
			this.columObj.columnData.push({
                prop: "remark",
                label: "反馈信息",
                text: true,
                width: "",
				textColor:'#F5222D',
                align: "center",
            })
		}
		this.pageObj.pageData.settlementId = this.id
		if(this.id){
			queryInitiateSettlementDetail({settlementId:this.id}).then((res)=>{
				if(res.code == 0){
					this.detailData = res.data
				}
			})
		}
		this.title = '结算详情'
		this.getData()
	},
	methods: {
		deleteRow(){
			updateSettlementDetail({
				settlementDetailId:this.row.id,
				settlementId:this.id,
				remark:'',
			}).then((res)=>{
				if(res.code == 0){
					this.$message.success('移除成功')
					this.dialogVisible = false
					this.getData()
					queryInitiateSettlementDetail({settlementId:this.id}).then((res)=>{
						if(res.code == 0){
							this.detailData = res.data
						}
					})
					
				}
			})
		},
		// 取消弹框
		close(){
			this.dialogFormVisible = false
			this.examineRemark = null
		},
		// 确定结算
		sure(){
			postSettlementExamine({
				examineStatus:this.type,
				settlementId:this.id,
				examineRemark:this.examineRemark,
			}).then((res)=>{
				if(res.code == 0){
					this.$message.success('提交成功')
					this.$router.go(-1);
				}
			})
		},
		// 结算
		submit(val){
			this.type = val
			this.dialogFormVisible = true
		},
		handleClose(){
			this.dialogVisible = false
			this.detail.visible = false
		},
		rowOperation(row, $index, now) {
			this.row = row;
			if(now =='del'){
				this.dialogVisible = true
			}else if(now == 'confirm'){
				this.detail.visible = true
			}
            // this.jump(`/finance/billInfo?id=${row.id}`);
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
		initer: function () {
			let that = this;
		},
		// 下载
		download(){
			this.$message.warning('暂缓开通')
		},
		back() {
			this.$router.go(-1);
		},
		getData(){
			querySettlementUserPager(this.pageObj.pageData).then((res)=>{
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
<style>
 /* .settlement .el-dialog {
 margin: 17vh auto !important;
}
.settlement .el-dialog__footer{
  z-index: 100;
}
.settlement .el-dialog__body {
 height: 55vh;
 overflow: hidden;
 overflow-y: auto;
} */

</style>
<style lang="scss" scoped>
.remember{
	color: rgba(0,0,0,0.55);
}
.details{
	border-bottom: 1px solid #F2F5FA;
	height: 60px;
	line-height: 60px;
	text-indent: 40px;
	font-size: 14px;
	color: #000;

}
.table_box{
	background: #fff;
	margin-top: 20px;
}
.details_tab{
	margin: 20px;
}
.details_box{
	padding: 20px;
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
.form_box{
	margin-top: 30px;
	background: #ffffff;
	.el-form-item{
		width: 33.3%;
		min-width: 360px;
		display: inline-block;
		vertical-align: top;
		margin-bottom: 0;
	}
	::v-deep{
		.f18{
			.el-form-item__label{
				font-size: 18px;
			}
		}
		.el-collapse{
			border-top: unset;
			border-bottom: unset;
		}
		.el-collapse-item:last-child{
			margin-bottom: unset;
		}
	}
	.nameForm{
		&.el-form-item{
			width: 100%;
			margin-bottom:unset
		}
	}
}
.detail_titleBox{
	margin: 15px 0;
}
.detail_titleBox span{
	margin-left: 20px;
}
.himt p:first-child{
    color: #000;
    font-size: 16px;
}
.himt p:last-child{
    color: #aaa;
}
.himt p:last-child span{
	display: block;
	color: #aaa;
	font-size: 14px;
	margin-top: 10px;
}
.himt p i{
    font-size: 24px;
    color: #FFC300;
    margin-right: 10px;
    position: relative;
    top:3px;
}
.himt p span{
    color: #4365AC;
}
</style>
