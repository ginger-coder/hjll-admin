<!--
  功能：课程数据
  作者：bianxiaokai
  时间：2023年07月27日 11:32:50
-->
<template>
	<div class="sort-container">
		<el-card class="form-card" shadow="hover">
			<el-form
				ref="form"
				:inline="true"
				:model="queryParams"
				class="demo-form-inline"
			>
				<el-form-item label="名称">
					<el-input
						placeholder="请输入"
						v-model="queryParams.courseName"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select
						v-model="courseTypeCode"
						placeholder="请选择"
						multiple
						@change="onTypeCodeChange"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in classTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select
						v-model="queryParams.status"
						placeholder="请选择"
					>
						<el-option label="未发布" :value="0"></el-option>
						<el-option label="已发布" :value="1"> </el-option>
						<el-option label="进行中" :value="2"> </el-option>
						<el-option label="已结束" :value="3"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="课程时间">
					<el-date-picker
						v-model="examTime"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						value-format="yyyy-MM-dd HH:mm:ss"
						end-placeholder="结束日期"
						@change="onExamTimeChange"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button @click="onSearch" type="primary"
						>查 询</el-button
					>
					<el-button @click="resetField">重 置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card-table" shadow="hover">
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				stripe
				:columns="columns"
				:request="learnStudyRecordCourseData"
				:payload="queryParams"
			>
				<el-table-column slot="status" label="课程状态">
					<template slot-scope="scope">
						<el-link
							:underline="false"
							:type="scope.row.status | statusStyle"
							>{{ scope.row.status | filterStatus }}</el-link
						>
					</template>
				</el-table-column>
				<el-table-column slot="index" label="序号">
					<template slot-scope="scope">
						{{
							scope.$index +
							1 +
							($refs.mTable.current - 1) * $refs.mTable.size
						}}
					</template>
				</el-table-column>
				<el-table-column
					slot="action"
					label="操作"
					width="200"
					align="center"
				>
					<template v-slot="{ row }">
						<el-button type="text" @click="checkClassBook(row)">按课件分析</el-button>
						<el-button type="text" @click="checkPeople(row)">按人员分析</el-button>
					</template>
				</el-table-column>
			</mTable>
		</el-card>
        <classBookDataDialog :visible.sync="classBookVisible" :courseId="courseId"/>
        <peopleDataDialog :visible.sync="peopleVisible" :courseId="courseId" />
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import mTable from '@c/business/table';
import classBookDataDialog from './comp/classBookDataDialog.vue';
import peopleDataDialog from './comp/peopleDataDialog.vue';
import { learnStudyRecordCourseData } from '@/api/pxks';

export default {
	/**注册组件*/
	components: {
		mTable,
        classBookDataDialog,
        peopleDataDialog,
	},
	/**接受父组件传值*/
	props: {},
	name: 'lesson-data',
	filters: {
		filterStatus(status) {
			let statusText = '';
			switch (status) {
				case 0:
					statusText = '未发布';
					break;
				case 1:
					statusText = '已发布';
					break;
				case 2:
					statusText = '进行中';
					break;
				case 3:
					statusText = '已结束';
					break;
				default:
					break;
			}
			return statusText;
		},
		statusStyle(status) {
			let type = '';
			switch (status) {
				case 0:
					type = 'warning';
					break;
				case 1:
					type = 'success';
					break;
				case 2:
					type = 'danger';
					break;
				case 3:
					type = 'default';
					break;

				default:
					break;
			}
			return type;
		},
	},
	data() {
		return {
            classBookVisible: false,
            peopleVisible: false,
            memberId: '',
            courseId: '',
			loading: false,
			queryParams: {},
			examTime: [],
			courseTypeCode: [],
			classTypeOptions: [],
			columns: [
				{
					slot: 'index',
				},
				{
					label: '课程名称',
					prop: 'courseName',
				},
				{
					label: '课程分类',
					prop: 'courseTypeName',
				},
				{
					label: '课程状态',
					slot: 'status',
				},
				{
					label: '开始时间',
					prop: 'startTime',
				},
				{
					label: '结束时间',
					prop: 'endTime',
				},
				{
					slot: 'action',
				},
			],
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {},
	/**所有方法*/
	methods: {
		learnStudyRecordCourseData,
        checkClassBook(row) {
            this.courseId = row.courseId;
            this.classBookVisible = true;
        },
        checkPeople(row) {
            this.courseId = row.courseId;
            this.peopleVisible = true;
        },
		onTypeCodeChange(values) {
			this.queryParams.courseTypeCodeString = values.join(',');
		},
		onExamTimeChange(timeArr) {
			this.queryParams.startTime = timeArr[0];
			this.queryParams.endTime = timeArr[1];
		},
		onSearch() {
			this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams = {};
			this.onSearch();
		},
	},
	/**创建组件时执行(有VM对象this)*/
	async created() {
		this.classTypeOptions = await this.$dict('course_type');
	},
	/**加载完组件时执行(主要预处理数据)*/
	mounted() {},
	beforeCreate() {
		/**生命周期 - 创建之前*/
	},
	beforeMount() {
		/**生命周期 - 挂载之前*/
	},
	beforeUpdate() {
		/**生命周期 - 更新之前*/
	},
	updated() {
		/**生命周期 - 更新之后*/
	},
	beforeDestroy() {
		/**生命周期 - 销毁之前*/
	},
	destroyed() {
		/**生命周期 - 销毁完成*/
	},
	activated() {
		/**keep-alive组件激活时调用。仅针对keep-alive组件有效*/
	},
	deactivated() {
		/**keep-alive组件停用时调用。仅针对keep-alive组件有效*/
	},
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.sort-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	.form-card {
		margin-bottom: 15px;
	}
	.card-table {
		flex: 1;
		::v-deep {
			.el-card__body {
				height: 100%;
			}
		}
	}
}
</style>
