<template>
	<div class="formPage" ref="rmInfo">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box">
                <el-button v-hold-click type="" @click="back">返回</el-button>
            </div>
		</div>
		<div class="form_box scrllbar">
			<el-form  label-width="120px">
                <el-form-item label="账单类型：">
                    {{ detailData.digest || '-' }}
                </el-form-item>
                <el-form-item label="账单金额：">
                    ￥{{ detailData.money || '-'}}
                </el-form-item>
                <el-form-item label="账户余额：">
					{{ detailData.amount ||'-' }} 
                </el-form-item>
                <el-form-item label="账单方：">
                    <span style="color:#2879FF">{{detailData.name|| '-'}}</span>
                </el-form-item>
                <el-form-item label="账单时间：">
                    {{dateFormat("YYYY-mm-dd HH:MM:SS", new Date(detailData.createTime))|| '-'}}
                </el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { parseTime,dateFormat } from "@/utils";
import { getDetail } from "@/api/finance"
import areaSelect from "@/components/custom/areaSelect";
export default {
	components: {
		areaSelect,
	},
	data() {
		return {
			title: "详情",
			id: "",
			dateFormat,
			detailData:{},
			pageFun:null,
		};
	},
	mixins: [basic],
	created() {
		var that = this
		const { id } = this.$route.query;
		this.id = id;

		this.title = '奖励提现详情'

		if (id) {
			this.loader_info();
		}
	},
	mounted() {
		
	},
	methods: {
		initer: function () {
			let that = this;
		},
		back() {
			this.$router.go(-1);
		},
		loader_info: function () {
			getDetail({
				id:this.id
			}).then((res)=>{
				if(res.code === 0){
					this.detailData = res.data
				}
			})
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
