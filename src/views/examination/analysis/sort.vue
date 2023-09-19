<!--
  功能：排行榜
  作者：bianxiaokai
  时间：2023年07月27日 11:32:50
-->
<template>
	<div class="sort-container">
		<el-form
			ref="form"
			:inline="true"
			:model="queryParams"
			class="demo-form-inline"
		>
			<el-form-item label="姓名">
				<el-input placeholder="请输入" v-model="queryParams.memberName">
				</el-input>
			</el-form-item>
			<el-form-item label="提交时间">
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
				<el-button @click="onSearch" type="primary">查 询</el-button>
				<el-button @click="resetField">重 置</el-button>
			</el-form-item>
		</el-form>
		<mTable
			ref="mTable"
			height="500px"
			:loading.sync="loading"
			stripe
			:columns="columns"
			:request="getRankingPage"
			:payload="queryParams"
		>
			<el-table-column slot="index" label="排名">
				<template slot-scope="scope">
					{{
						scope.$index +
						1 +
						($refs.mTable.current - 1) * $refs.mTable.size
					}}
				</template>
			</el-table-column>
			<el-table-column slot="area" label="区域">
				<template slot-scope="scope">
					{{
						(scope.row.provinceName || '') + (scope.row.cityName || '') + (scope.row.areaName || '') ||
						'-'
					}}
				</template>
			</el-table-column>
		</mTable>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import mTable from '@c/business/table';
import { getRankingPage } from '@/api/exam';

export default {
	/**注册组件*/
	components: {
		mTable,
	},
	/**接受父组件传值*/
	props: {
		examId: {
			type: Number | String,
			default: '',
		},
	},
	name: 'analysis-sort',
	data() {
		return {
			loading: false,
			queryParams: {},
			examTime: [],
			columns: [
				{
					slot: 'index',
				},
				{
					label: '姓名',
					prop: 'memberName',
				},
				{
					slot: 'area',
				},
				{
					label: '角色',
					prop: 'workRoleName',
				},
				{
					label: '答对/总数',
					prop: 'accuracyRate',
				},
				{
					label: '成绩',
					prop: 'userScore',
				},
				{
					label: '用时',
					prop: 'durationString',
				},
				{
					label: '提交时间',
					prop: 'submissionTime',
				},
			],
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {
		examId: {
			immediate: true,
			handler(newVal, oldVal) {
				this.queryParams.examId = newVal;
				setTimeout(() => {
					this.onSearch();
				}, 500);
			},
		},
	},
	/**所有方法*/
	methods: {
		getRankingPage,
		onExamTimeChange(timeArr) {
			this.queryParams.submissionTimeStart = timeArr[0];
			this.queryParams.submissionTimeEnd = timeArr[1];
		},
		onSearch() {
			this.$refs.mTable?.resetInit && this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams.memberName = '';
            this.examTime = [];
			this.onSearch();
		},
	},
	/**创建组件时执行(有VM对象this)*/
	created() {
		// this.queryParams.examId = ;
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
    height: 91%;
}
</style>
