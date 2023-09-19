<template>
	<div class="formPage" ref="rmInfo">
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
				<div class="details"><span @click="upHistory">充值历史<i class="el-icon-caret-right"></i></span></div>
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
					<p>钱包费率：<span>{{rate}}%</span></p>
					<el-form-item   label="充值金额：" prop="rechargeMoney">
						<el-input  style="width:200px" @blur="projectAmounts" v-model="formData.rechargeMoney" placeholder="请输入充值金额"></el-input><span style="margin-left:10px">￥</span>
					</el-form-item>
					<p>大写金额：<span>{{accountLong}}</span></p>
					<p>预计可发：<span>{{factAccount}}</span></p>
					<el-form-item label="充值备注：" prop="rechargeRemark">
						<el-input type="textarea" v-model="formData.rechargeRemark" placeholder="请输入充值备注"></el-input>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- <Footers/> -->
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import finance from "@/mixins/finance"
import { parseTime,dateFormat } from "@/utils";
import { getWalletList,getwallets } from "@/api/finance"
import { rechargeApply } from "@/api/finance"
import {
  selectKey
} from "@/utils/filterSettle";
import Detail from "./components/detail"
import { cnMoneyFormat } from "@/utils/index";
import Footers from "./components/footer"
import publicTable from "@c/business/tables";
export default {
	components: {
		Detail,
		Footers,
		publicTable,
	},
	data() {
		return {
			row:{},
			formData:{
				walletId:'',
				rechargeRemark:'',
				rechargeMoney:null,
			},
			selectKey,
			rate:null,
			detailData:[],
			tableData:[],
			title: "充值申请",
			id: "",
		};
	},
	mixins: [basic,finance],
	created() {
		console.log(this.selectKey)
	},
	computed: {
		accountLong() {
			return cnMoneyFormat(this.formData.rechargeMoney)
		},
		factAccount(){
			return  this.formData.rechargeMoney-(this.formData.rechargeMoney*(this.rate/100))
		}
    },
	mounted() {
		this.getGroup()
	},
	methods: {
		getGroup(){
			getWalletList({}).then((res)=>{
				if(res.code == 0){
					this.rate = parseFloat(res.data.walletVos[0].rechargeTaxRate)
				}
			})
			getwallets({}).then((res)=>{
                if(res.code == 0){
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
		},
		// 结算
		submit(formName){
			// 结算提交
			this.$refs[formName].validate((valid) => {
				if (valid) {
				rechargeApply(this.formData).then((res)=>{
					if(res.code == 0){
					this.$message.success('提交成功')
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
<style lang="scss" scoped>
.remember{
	color: rgba(0,0,0,0.55);
}
.details{
	height: 60px;
	text-align: right;
	line-height: 60px;
	font-size: 14px;
	color: #4365AC;
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
		margin: 10px 0;
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
.formModal{
	margin-left: 40px;
}
.formModal p{
	text-indent: 38px;
	color: #606266;
	font-weight: 600;
	margin: 0;
	height: 50px;
	line-height: 50px;
}
.formModal p span{
	display: inline-block;
	text-indent: 15px;
}
</style>
