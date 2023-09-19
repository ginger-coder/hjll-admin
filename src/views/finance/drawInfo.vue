<template>
	<div class="formPage" ref="rmInfo">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box">
                <el-button v-if="detailData.cashOutStatus==0" v-hold-click type="" @click="operationList(1)">通过</el-button>
                <el-button  v-if="detailData.cashOutStatus==0" v-hold-click type="" @click="operationList(2)">驳回</el-button>
                <el-button v-hold-click type="" @click="back">返回</el-button>
            </div>
		</div>
		<div class="form_box scrllbar">
            <div style="margin-bottom:20px">提现信息</div>
            <el-divider></el-divider>
			<el-form  label-width="120px">
                <el-form-item label="提现单号：">
                    {{detailData.cashOutNumber || '-'}}
                </el-form-item>
                <el-form-item label="提现金额：">
                    {{'￥'+detailData.money || '-'}}
                </el-form-item>
                <el-form-item label="提取时间：">
					{{dateFormat("YYYY-mm-dd HH:MM:SS", new Date(detailData.createTime)) || '-'}}
                </el-form-item>
                <el-form-item label="提现方类型：">
                    {{detailData.source || '-'}}
                </el-form-item>
                <el-form-item label="提现方：">
                    <span style="color:#2879FF">{{detailData.name || '-'}}</span>
                </el-form-item>
                <el-form-item label="提现状态：">
                    {{detailData.cashOutStatusLabel || '-'}}
                </el-form-item>
                
			</el-form>
		</div>
        <div class="form_box scrllbar" style="margin-top:20px">
            <div style="margin-bottom:20px">提现进度</div>
            <el-divider></el-divider>
            <el-steps :active="detailData.divider" align-center style="margin-top:30px">
                <el-step title="提现申请" :description="detailData.createTime"></el-step>
                <el-step title="等待审核" description=""></el-step>
				<el-step title="完成" description=""></el-step>
            </el-steps>
        </div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { cashDetail,cashStatus } from "@/api/finance"
import {statusList} from '@/utils/finance'
import { parseTime,dateFormat } from "@/utils";
import areaSelect from "@/components/custom/areaSelect";
export default {
	components: {
		areaSelect,
	},
	data() {
		return {
			title: "详情",
			statusList,
			dateFormat,
			detailData:{},
			id: "",
			pageFun:null,
		};
	},
	mixins: [basic],
	created() {
		var that = this
		const { id } = this.$route.query;
		this.id = id;

		this.title = '提现详情'
		that.pageFun = ''

		if (id) {
			this.loader_info();
		}
	},
	mounted() {
		let that = this;
	},
	methods: {
		operationList(val){
            cashStatus({
                ids:[this.detailData.id],
                status:val,
            }).then((res)=>{
                if(res.code == 0){
                    this.$message.success('操作成功')
                    this.loader_info()
                }
            })
        },
		initer: function () {
			let that = this;
		},
		back() {
			this.$router.go(-1);
		},
		loader_info: function () {
			cashDetail({
				id:this.id
			}).then((res)=>{
				if(res.code === 0){
					this.detailData = res.data || {}
					if(this.detailData.cashOutStatus == 0){
						this.detailData.divider = 2
					}else{
						this.detailData.divider = 3
					}
					statusList.forEach((item)=>{
						if(item.value == this.detailData.cashOutStatus){
							this.detailData.cashOutStatusLabel = item.label
						}
					})
					
				}
			})
		},
        audit_change:function(command,row){
            let text = ''
            switch (command) {
				case "audit":
					// 通过审核
					text = '确定通过审核吗？'
                    break;
				case "disable":
					// 拒绝通过审核
                    text = '确定拒绝通过审核吗？'
                    break;

            }
            var that = this
            that.$confirm(text, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					// that.pageFun(
					// 	{ name: "setBatch", method: "post" },
					// 	{},
					// 	{
					// 		key: "state",
					// 		value: oState,
					// 		ids: ids,
					// 	}
					// )
					// 	.then((res) => {
					// 		that.$message.success("设置成功");
					// 		that.paging_change(that.currentPage);
					// 		that.handleSelectionClear();
					// 	})
					// 	.catch((err) => {});
				})
				.catch(() => {});
        },
	},
};
</script>
<style lang="scss">
.feedbackDrawerBox {
	.el-drawer__body {
		padding: 20px;
	}
}
</style>
<style lang="scss" scoped>
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
	margin-top: 40px;
	padding:20px;
	background: #ffffff;
	.el-form-item{
		width: 33.3%;
		min-width: 360px;
		display: inline-block;
		vertical-align: top;
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
</style>
