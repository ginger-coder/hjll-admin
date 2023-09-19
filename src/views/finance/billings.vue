<template>
	<div class="formPage billing" ref="rmInfo">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box">
				<el-button
				v-hold-click
				type="primary"
				@click="submit('formData')"
				>提交申请</el-button
				>
				<el-button v-hold-click type="" @click="back">关闭</el-button>
			</div>
		</div>
		<div class="form_box scrllbar">
			<div class="details_box">
					<div class="box">
						<el-form ref="formData"
							class="formModal"
							:model="formData"
							:rules="rules"
							:label-width="'120px'"
							>
							<el-form-item label="钱包选择：" prop="walletId">
								<el-select  v-model="formData.walletId" clearable placeholder="请选择">
									<el-option 
									v-for="(t, i) in selectKey.wallet"
									:key="i"
									:label="t.label"
									:value="t.value"/>
								</el-select>
							</el-form-item>
							<el-form-item label="开票金额：" prop="invoicingAmount">
								<!-- @blur="projectAmounts2" -->
								<el-input style="width:200px" :max="num" @blur="projectAmounts2" v-model="formData.invoicingAmount" placeholder="请输入开票金额"></el-input><span style="margin-left:10px">￥</span>
							</el-form-item>
							<p class="tipsaccount">可开票金额￥{{sum}}</p>
							<el-form-item label="发票类型：" prop="invoiceType">
								<el-select  v-model="formData.invoiceType" clearable placeholder="请选择">
									<el-option v-for="({value, label}) in fapiaoTypeData" :key="value" :value="value" :label="label"/>
								</el-select>
							</el-form-item>
							<el-form-item label="开票类目：" prop="invoiceCategory">
								<el-select  v-model="formData.invoiceCategory" clearable placeholder="请选择">
									<el-option v-for="({value, label}) in categoryData" :key="value" :value="value" :label="label"/>
								</el-select>
							</el-form-item>
							<el-form-item label="发票备注：" prop="invoiceRemark">
								<el-input type="textarea" v-model="formData.invoiceRemark" placeholder="请输入发票备注"></el-input>
							</el-form-item>
							<el-form-item label="提醒事项：" prop="remindMatter">
								<el-input type="textarea" v-model="formData.remindMatter" placeholder="请输入提醒事项"></el-input>
							</el-form-item>
						</el-form>
					</div>
					<div class="box">
						<div class="details"><span @click="invoiceHistory">开票历史<i class="el-icon-caret-right"></i></span></div>
						<!-- <div class="tips"><i class="el-icon-info"></i>如您的开票信息有变更，请先行更改再提交</div> -->
						<div class="box_list">
							<div class="box_title">企业信息
								<!-- <i @click="edit('1')" class="el-icon-edit-outline"></i> -->
							</div>
							<p><em>开票企业名称</em><span>{{editData.invoiceCompanyName || '-'}}</span></p>
							<p><em>纳税识别号</em><span>{{editData.taxpayerNumber|| '-'}}</span></p>
							<p><em>企业类型</em><span>{{editData.companyType|| '-'}}</span></p>
							<p><em>企业地址</em><span>{{editData.companyAddress|| '-'}}</span></p>
							<p><em>企业联系电话</em><span>{{editData.companyContact|| '-'}}</span></p>
							<p><em>开户银行</em><span>{{editData.bank|| '-'}}</span></p>
							<p><em>银行账号</em><span>{{editData.account|| '-'}}</span></p>
						</div>
						<div class="box_list">
							<div class="box_title">邮寄信息
								<!-- <i @click="edit('2')" class="el-icon-edit-outline"></i> -->
							</div>
							<p><em>收件人</em><span>{{editData.mailingPerson|| '-'}}</span></p>
							<p><em>收件人联系电话</em><span>{{editData.mailingContact|| '-'}}</span></p>
							<p><em>收件人地址</em><span>{{editData.mailingAddress|| '-'}}</span></p>
						</div>
					</div>
			</div>
		</div>
		<!-- 编辑信息 -->
        <el-dialog
            :title="editType=='1'?'企业信息修改':'邮寄信息修改'"
            destroy-on-close
            v-if="editFlag"
            :visible="editFlag"
            :before-close="(()=>{editFlag = false;this.$refs.formRef.resetFields()})">
			<el-form class="popleForm" :model="editData" ref="formRef"  >
				<span  v-if="editType=='1'">
					<el-form-item label="开票企业名称" prop="invoiceCompanyName">
							<el-input v-model="editData.invoiceCompanyName" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="纳税人识别号" prop="taxpayerNumber">
							<el-input v-model="editData.taxpayerNumber" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="企业类型" prop="companyType">
						<el-select  v-model="editData.companyType" clearable placeholder="请选择">
							<el-option v-for="({value, label}) in []" :key="value" :value="value" :label="label"/>
						</el-select>
					</el-form-item>
					<el-form-item label="企业地址" prop="companyAddress">
							<el-input v-model="editData.companyAddress" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="企业联系电话" :rules="phonelimit" prop="companyContact">
							<el-input v-model="editData.companyContact" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="开户银行" prop="bank">
							<el-input v-model="editData.bank" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="银行账号" :rules="banklimit" prop="account">
							<el-input v-model="editData.account" placeholder="请输入"></el-input>
					</el-form-item>
				</span>
				<span v-if="editType=='2'">
					<el-form-item label="收件人" prop="mailingContact">
							<el-input v-model="editData.mailingContact" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="收件人联系电话" prop="mailingContact" :rules="phonelimit">
							<el-input v-model="editData.mailingContact" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="收件人地址" prop="mailingAddress">
							<el-input v-model="editData.mailingAddress" placeholder="请输入"></el-input>
					</el-form-item>
				</span>
			</el-form>
             <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import finance from "@/mixins/finance"
import { parseTime,dateFormat } from "@/utils";
import { getBillData,getCompanyInfo,getwallets} from "@/api/finance"
import { invoiceApplyFor } from "@/api/finance"
import Detail from "./components/detail"
import {
  selectKey
} from "@/utils/filterSettle";
import publicTable from "@c/business/tables";
export default {
	components: {
		Detail,
		publicTable,
	},
	data() {
		return {
			editData:{
				
			},
			formData:{
				invoicingAmount:null,
			},
			selectKey:selectKey,
			num:null,
			walletData:[
				{
					label:'海纳实业-研发测试',
					value:3
				}
			],
			fapiaoTypeData:[
				{
					label:'纸质专票',
					value:1
				},
				{
					label:'电子专票',
					value:2
				},
				{
					label:'纸质普票',
					value:3
				},
				{
					label:'电子普票',
					value:4
				}
			],
			categoryData:[
				{
					label:'现代服务',
					value:1
				},
				{
					label:'服务费',
					value:2
				}
			],
			editType:'1',
			editFlag:false,
			title: "开票申请",
			id: "",
			dateFormat,
			detailData:{},
		};
	},
	mixins: [basic,finance],
	computed:{
		sum() {
			return this.num-this.formData.invoicingAmount
		},
	},
	created() {
	},
	mounted() {
		this.getData()
	},
	methods: {
		close(){
			this.editFlag = false
			this.$refs.formRef.resetFields()
		},
		sure(){
			this.editFlag = false
			// 请求编辑修改接口
		},
		edit(type){
			this.editType = type
			this.editFlag = true
		},
		getData(){
			getwallets({}).then((res)=>{
                if(res.code == 0){
					this.num = res.data[0].invoiceAmount
					let rulest =  res.data[0]
					let dataNew = []
					let obj = {
							value: rulest.walletId,
							label: rulest.walletName,
					}
					dataNew.push(obj);
					this.selectKey.wallet = dataNew
				}
            })
			getCompanyInfo({}).then((res)=>{
				if(res.code == 0){
					this.editData = res.data || {}
				}
			})
		},
		// 结算
		submit(formName){
			// 开发票提交
			this.$refs[formName].validate((valid) => {
			if (valid) {
			 invoiceApplyFor(this.formData).then((res)=>{
				if(res.code == 0){
					this.$message.success('保存成功')
					this.$router.go(-1);
				}
			})
			} else {
				console.log("error submit!!");
				return false;
			}
		});
		},
		back() {
			this.$router.go(-1);
		},
		
	},
};
</script>
<style>
 .billing .el-dialog {
 margin: 17vh auto !important;
}
.billing .el-dialog__footer{
  z-index: 100;
}
.billing .el-dialog__body {
 height: 55vh;
 overflow: hidden;
 overflow-y: auto;
}
</style>
<style lang="scss" scoped>
.remember{
	color: rgba(0,0,0,0.55);
}
.details{
	height: 60px;
	text-align: right;
	line-height: 60px;
	font-size: 14px;
	width: 90%;
	margin: 0 auto;
	text-align: right;
	color: #4365AC;
	border-bottom: 1px solid #E9E9E9;
	span{
		cursor: pointer;
	}
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
	display: flex;
	justify-content: space-between;
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
	.el-form-item{
		padding: 30px 30px 0 0;
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
.box{
	background: #ffffff;
	width: 49%;
	border-radius: 2px;
}
.box_title{
	color: rgba(0,0,0,0.75);
	font-size: 14px;
	font-weight: bold;
	margin: 20px 0;
}
.box_title i {
	float: right;
	font-size: 16px;
	cursor: pointer;
}
.tipsaccount{
	color: rgba(0,0,0,0.45);
	text-indent: 120px;
}
.tips{
	width: 90%;
	height: 40px;
	line-height: 40px;
	margin-top: 20px;
	background: #EBF0FF;
	border: 1px solid #ABBDFF;
	color: rgba(0,0,0,0.65);
	margin: 0 auto;
	margin-top: 20px;
}
.tips i{
	display: inline-block;
	margin: 0 10px;
	color: #ABBDFF;	
}
.box_list{
	width: 90%;
	margin: 0 auto;
}
.box_list p{
	line-height: 28px;
}
.box_list:last-child{
	border-top:1px solid #E9E9E9;
}
.box_list p span{
	color: rgba(0,0,0,0.35);
	margin-left: 50px;
}
.box_list p em{
	font-style: normal;
	display: inline-block;
	width: 150px;
}
.popleForm{
	margin: 20px 0;
}
.popleForm .el-form-item{
	display: inline-block !important;
    margin-right: 40px !important;
    vertical-align: top;
    width: 45% !important;
}

</style>
