<!--
  功能：学习数据
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
				<el-form-item label="姓名">
					<el-input
						placeholder="请输入"
						v-model="queryParams.nickName"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="区域">
					<!-- :value="[form.province, form.city, form.area]" -->
					<areaSelectAll
						ref="areaSelect"
						@change="changeArea"
						:ismultiple="true"
						:isCollapse="true"
					></areaSelectAll>
				</el-form-item>
				<el-form-item label="角色">
					<el-select
						v-model="queryParams.role"
						placeholder="请选择"
						style="width: 200px"
						clearable
					>
						<el-option
							v-for="item in roleUserList"
							:label="item.name"
							:value="item.name"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="签约情况">
					<el-select
						v-model="queryParams.sign"
						placeholder="请选择"
						style="width: 240px"
						clearable
					>
						<el-option label="未签约" :value="0"></el-option>
						<el-option label="已签约" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="评分">
					<el-input
						style="width: 50px"
						v-model="queryParams.scoreStart"
					>
					</el-input>
					<span
						class="h"
						style="margin-left: 10px; margin-right: 10px"
						>-</span
					>
					<el-input
						style="width: 50px"
						v-model="queryParams.scoreEnd"
					>
					</el-input>
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
				:request="learnStudyData"
				:payload="queryParams"
			>
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
						<el-button type="text" @click="checkCourse(row.memberId)">课程数据</el-button>
						<el-button type="text" @click="checkExam(row.memberId)">考试数据 </el-button>
						<el-button type="text" @click="checkExerc(row.memberId)">练习数据</el-button>
					</template>
				</el-table-column>
			</mTable>
		</el-card>
        <courseDataDialog :visible.sync="courseVisible" :id="memberId"/>
        <examDataDialog :visible.sync="examVisible" :id="memberId"/>
        <exerDataDialog :visible.sync="exerVisible" :id="memberId"/>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import mTable from '@c/business/table';
import areaSelectAll from '@/components/custom/areaSelectAll';
import courseDataDialog from './comp/corseDataDialog.vue';
import examDataDialog from './comp/examDataDialog.vue';
import exerDataDialog from './comp/pracDataDialog.vue';
import {
	work_role_page,
	learnStudyData,
	learnStudyCourseData,
	learnStudyExamData,
	learnStudyExerciseData,
} from '@/api/pxks';

export default {
	/**注册组件*/
	components: {
		mTable,
		areaSelectAll,
        courseDataDialog,
        examDataDialog,
        exerDataDialog,
	},
	/**接受父组件传值*/
	props: {},
	name: 'study-data',
	data() {
		return {
            memberId: '',
            courseVisible: false,
            examVisible: false,
            exerVisible: false,
			loading: false,
			queryParams: {},
			examTime: [],
			courseTypeCode: [],
			classTypeOptions: [],
			roleUserList: [],
			columns: [
				{
					slot: 'index',
				},
				{
					label: '姓名',
					prop: 'memberName',
				},
				{
					label: '区域',
					prop: 'areaFullName',
				},
				{
					label: '角色',
					prop: 'workRoleName',
				},
				{
					label: '签约情况',
					prop: 'sign',
				},
				{
					label: '评分',
					prop: 'score',
				},
				{
					label: '应参与课程数',
					prop: 'courseCount',
				},
				{
					label: '应参与考试数',
					prop: 'examCount',
				},
				{
					label: '应参与练习数',
					prop: 'exeriseCount',
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
		learnStudyData,
        checkExerc(memberId) {
            this.memberId = memberId;
            this.exerVisible = true;
        },
        checkCourse(memberId) {
            this.memberId = memberId;
            this.courseVisible = true;
        },
        checkExam(memberId) {
            this.memberId = memberId;
            this.examVisible = true;
        },
		changeArea(val) {
			console.log('ara', val);
			this.queryParams.areaList = val.map((el) => el[2]);
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
		work_role_page({
			size: 100,
			current: 1,
		}).then((res) => {
			// console.log('res', res);
			this.roleUserList = res.data.records;
		});
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
