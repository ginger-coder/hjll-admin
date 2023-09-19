<template>
	<div style="height: 100%">
		<div v-loading="loading" class="formPage" ref="gzCreate">
			<div class="header_box disp_flex ju_bet ali_cen">
				<div>
					<div class="title">{{ title }}</div>
				</div>
				<div class="back_box"><el-button v-hold-click type="" @click="back">返回</el-button></div>
			</div>
			<div class="form_box scrllbar">
				<el-form ref="form" :model="info" :rules="rules" label-width="130px">
					<el-form-item label="故障名称：" prop="faultName">
						{{info.faultName || "-"}}
					</el-form-item>
					<el-form-item label="故障类型：" prop="faultType">
						{{info.faultTypeName || "-"}}
					</el-form-item>
					<el-form-item label="设备类型：" prop="deviceTypeId" >
						{{info.deviceTypeName || "-"}}
					</el-form-item>
					<el-form-item label="设备：" prop="deviceId">
						{{info.deviceName || "-"}}
					</el-form-item>
					<el-form-item label="开启状态：" prop="deviceId">
						<el-tag v-if="info.status === 0 " size="small" type="">开启</el-tag>
						<el-tag v-else-if="info.status === 1 " size="small" type="info">关闭</el-tag>
						<span v-else>-</span>
					</el-form-item>
					<el-form-item label="创建时间：" prop="deviceId">
						{{info.createTime_ || "-"}}
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						{{info.remark || "-"}}
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { gz } from "@/api/maintain";
import {} from "@/utils/dict";
import { parseTime } from "@/utils";
import { device} from "@/api/device";

import store from "@/store";
export default {
	components: {
	},
	data() {
		return {
			title: "故障详情",
			loading: false,
			id:'',

			info: {},

		};
	},
	mixins: [basic],
	created() {
		let _query = this.$route.query;
		if (_query.id) {
			this.id = _query.id
		} 
	},
	mounted() {
		let that = this;
		that.$nextTick(() => {
			that.$refs.gzCreate.scrollTop = 0;
		});
		that.initer();
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		initer: function () {
			let that = this;
			this.loader_info()
		},
		loader_info: function () {
			let that = this;
			gz({ method: "get", name: "detail" }, { id: that.id })
				.then((res) => {
					that.$nextTick(()=>{
						that.info = that.filter_info(res.data) || {}
					})
				})
				.catch((error) => {});
		},
		filter_info:function(row){
			var that = this
			row.createdAt = row.createTime || row.tim;
			row.createTime_ = parseTime(new Date(row.createdAt).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";

			// 更新时间
			row.updatedAt = row.updateTime || row.tim_up;
			row.updateTime_ = parseTime(new Date(row.updatedAt).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";
			return row
		},
	},
};
</script>
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
.form_box {
	background-color: #ffffff;
	margin-top: 40px;
	border-radius: 4px;
	.el-form {
		width: 50%;
		min-width: 450px;
		min-height: 800px;
		margin: 0 auto;
		padding-top: 40px;
	}
}
</style>
