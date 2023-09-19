<template>
	<div>
		<el-card>
			<div class="header_box disp_flex ju_bet ali_cen">
				<div>
					<div class="title">基本信息</div>
				</div>
				<div class="back_box">
					<el-button v-hold-click type="" @click="back"
						>返回</el-button
					>
				</div>
			</div>
			<div class="tworow">
				<div class="zhname">
					证书名称：<span>{{ topedata.certificateName }}</span>
				</div>
				<div class="zhname">
					运维人员：<span>{{ topedata.umsNumber }} 人</span>
				</div>
			</div>
			<el-table :data="tableData" style="width: 100%; margin-top: 24px">
				<el-table-column prop="date" label="序号" type="index">
				</el-table-column>
				<el-table-column prop="umsName" label="姓名"> </el-table-column>
				<el-table-column label="角色" prop="roleNames">
				</el-table-column>
				<el-table-column label="证书" prop="address" width="150">
					<template slot-scope="scope">
						<el-button type="text" @click="lookpic(scope.row)"
							>点击查看</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			title="证书"
			:visible.sync="centerDialogVisible"
			class="el-dialog-unify el-dialog-medium"
			width="1084px"
			center
		>
			<div class="img-box">
				<el-image
					style="height: 500px; margin: 0 auto;"
					:src="picture"
					:preview-src-list="[picture]"
				>
				</el-image>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { Certificatelistinfor, Certificatelistinfortwo } from '@/api/omptwo';
import { BASE_API, BASE_URL, BASE_UPLOAD } from '@/config';
export default {
	data() {
		return {
			topedata: {},
			listform: {
				current: 1,
				size: 10,
				certificateId: '',
			},
			tableData: [],
			centerDialogVisible: false,
			picture: '',
		};
	},
	mounted() {
		console.log(this.$route.query.id);
		this.getconetnt();
	},
	methods: {
		getconetnt() {
			this.listform.certificateId = this.$route.query.id;
			Certificatelistinfor({ id: this.$route.query.id }).then((res) => {
				this.topedata = res.data;
			});
			Certificatelistinfortwo(this.listform).then((res) => {
				this.tableData = res.data.records;
			});
		},
		lookpic(row) {
			console.log(row);
			this.picture = BASE_UPLOAD + row.certificateUrl;
			console.log(this.picture);
			this.centerDialogVisible = true;
		},
		back() {
			this.$router.go(-1);
		},
	},
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 16px;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 800;
	color: rgba(0, 0, 0, 0.85);
}

.img-box {
    width: 100%;
    display: flex;
}
.tworow {
	display: flex;
	font-size: 14px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	margin-top: 16px;
	color: rgba(0, 0, 0, 0.85);
	.zhname {
		margin-right: 61px;
	}
}
</style>
