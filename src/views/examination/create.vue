<template>
	<div
		class="full-height testpaper has-page-header disp_flex flex flex_column"
	>
		<div class="disp_flex ju_bet ali_cen page-header">
			<span class="title">创建考试</span>
			<div class="btn-box">
				<el-button @click="onClose">取消</el-button>
				<el-button type="primary" @click="onSubmit"
					>使用当前试卷&下一步</el-button
				>
			</div>
		</div>
		<div class="flex page-main full-height">
			<div class="full-height disp_flex">
				<el-card shadow="hover" class="full-height flex b-el-card">
					<div class="header-one">1. 从已有试卷选择</div>
					<el-divider></el-divider>
					<div class="testPager-container">
						<el-form
							ref="form"
							:inline="true"
							:model="queryParams"
							class="demo-form-inline"
						>
							<el-form-item label="名称">
								<el-input
									placeholder="请输入"
									v-model="queryParams.testPaperName"
								>
								</el-input>
							</el-form-item>
							<el-form-item label="分类">
								<el-select
									v-model="testPaperTypeData"
									style="width: 240px"
									clearable
									multiple
									collapse-tags
									@change="onChangeTestPaperType"
									placeholder="请选择"
								>
									<el-option
										:label="item.name"
										:value="item.id"
										v-for="item in testPaperYypeOptions"
										:key="item.id"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button @click="onSearch" type="primary"
									>查 询</el-button
								>
								<el-button @click="resetField">重 置</el-button>
							</el-form-item>
						</el-form>
						<mTable
							ref="mTable"
							height="100%"
							:loading.sync="loading"
							:columns="columns"
							:request="testpaper"
							:payload="queryParams"
						>
							<el-table-column slot="index" label="序号">
								<template slot-scope="scope">
									{{
										scope.$index +
										1 +
										($refs.mTable.current - 1) *
											$refs.mTable.size
									}}
								</template>
							</el-table-column>
							<template slot="radio">
								<el-table-column label="" width="35">
									<template slot-scope="scope">
										<el-radio
											class="radio"
											v-model="testPagerId"
											:label="scope.row.id"
											@change.native="
												getCurrentGateway(scope.row)
											"
											><i></i>
										</el-radio>
									</template>
								</el-table-column>
							</template>
						</mTable>
					</div>
				</el-card>
				<div class="right-box">
					<el-card
						shadow="hover"
						style="margin-bottom: 20px; height: 140px"
					>
						<el-steps direction="vertical" :active="1">
							<el-step title="选择试卷"></el-step>
							<el-step title="设置信息"></el-step>
						</el-steps>
					</el-card>
					<el-card shadow="hover">
						<div class="title">2. 想在目前试卷基础上调整修改？</div>
						<el-button type="text" @click="editTestPaper"
							>去编辑试卷副本</el-button
						>
						<el-divider></el-divider>
						<div class="title">3. 找不到合适的试卷？</div>
						<el-button type="text" @click="goTestPaper"
							>去创建一个新试卷</el-button
						>
					</el-card>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import { testpaper } from '@/api/pxks';
import mTable from '@c/business/table';

export default {
	components: {
		mTable,
	},
	data() {
		return {
			testPagerId: '',
			activeRow: null,
			testPaperYypeOptions: [],
			testPaperTypeData: [],
			id: '',
			queryParams: {
				status: 0,
			},
			loading: false,
			columns: [
				{
					slot: 'radio',
				},
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'testPaperName',
				},
				{
					label: '分类',
					prop: 'testPaperTypeName',
				},
				{
					label: '题数',
					prop: 'testPaperThemeCount',
				},
				{
					label: '总分',
					prop: 'totalScore',
				},
				{
					label: '已应用考试',
					prop: 'examNames',
				},
				{
					label: '创建人',
					prop: 'createUserName',
				},
				{
					label: '创建时间',
					prop: 'createTime',
				},
			],
		};
	},
	watch: {
		'$route.query': {
			immediate: true,
			handler(newValue, oldValue) {
				// if (!newValue.id) {
				// 	this.$router.go(-1);
				// }
				this.id = newValue.id || '';
			},
		},
	},
	methods: {
		testpaper,
		onChangeTestPaperType(val) {
			this.queryParams.testPaperTypeCodeString = val.join(',');
		},
		getCurrentGateway(row) {
			this.activeRow = row;
		},
		onClose() {
			this.$router.go(-1);
		},
		onSubmit() {
			if (!this.activeRow?.id) {
				this.$message.warning('请选择试卷');
				return;
			}
			// 跳转
			this.editExam();
		},
		editExam() {
			this.$router.push({
				path: '/testTrain/examinationEdit',
				query: {
					testPagerId: this.activeRow.id,
					testPagerName: this.activeRow.testPaperName,
                    score: this.activeRow.totalScore
				},
			});
		},
		editTestPaper() {
			if (!this.testPagerId) {
				this.$message.warning('请选择试卷');
				return;
			}
			this.$router.push({
				path: '/testTrain/TestList/testpaper',
				query: {
					id: this.testPagerId,
				},
			});
		},
		goTestPaper() {
			this.$router.push(`/testTrain/TestList`);
		},
		singleElection(row) {
			this.templateSelection = this.tableData.indexOf(row);
			this.templateRadio = row.id;
		},
		resetField() {
			this.queryParams = {
				status: 0,
			};
			this.testPaperTypeData = [];
			this.onSearch();
		},
		onSearch() {
			this.$refs.mTable.resetInit();
		},
	},
	computed: {},
	async created() {
		this.testPaperYypeOptions = await this.$dict('test_paper_type');
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
	height: 100%;
}
.full-height {
	height: 100%;
	overflow: hidden;
}
.testPager-container {
	height: calc(100% - 100px);
}
.type-title {
	h3 {
		display: inline;
	}
	.desc {
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.45);
	}
}
.question-tag-list {
	.q_tag {
		margin-left: 10px;
		margin-bottom: 10px;
	}
}
.testPagerName {
	.nickName {
		.name {
			margin-right: 15px;
		}
		.icon-btn {
			cursor: pointer;
		}
	}
}
.test-title-left {
	.title-type {
		margin-right: 16px;
	}
	.desc {
		padding-left: 15px;
		border-radius: 2px;
		border: 1px solid #d9d9d9;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.65);
		padding: 0 8px;
		align-items: center;
		.line {
			border-right: 1px solid #eee;
			width: 2px;
			height: 70%;
		}
		.level {
			.title {
				box-sizing: border-box;
				padding-top: 4px;
			}
		}
		.q_title {
			display: flex;
			align-items: center;
			padding-left: 8px;
		}
	}
}

.has-page-header {
	margin: -20px;

	.page-header {
		background-color: #fff;
		margin-bottom: 24px;
		padding: 20px 24px;

		.title {
			font-size: 20px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.85);
			line-height: 28px;
		}
	}

	.page-main {
		padding: 0 20px;
		overflow: hidden;
	}
}

.testpaper {
	--space: 24px;

	.b-el-card {
		margin-right: var(--space);

		.topic {
			padding: 0 20px;
			box-sizing: border-box;
		}

		::v-deep .b-el-scrollbar.el-scrollbar__wrap {
			overflow-x: auto !important;
		}
	}

	.mb-space {
		margin-bottom: var(--space);
	}

	.right-box {
		flex: 0 0 320px;

		h3 {
			margin: 0;
		}

		.grade {
			::v-deep .el-form-item__content {
				margin-left: 0 !important;
			}
		}

		.grade-text {
			color: rgba(0, 0, 0, 0.65);
			line-height: 22px;
		}

		.grade-num {
			color: #5674e5;
			padding: 0 3px;
			display: inline-block;
			width: 40px;
			text-align: center;
		}

		.num-input {
			width: 80px;
			//margin: 0 15px;
		}
	}
}
</style>
