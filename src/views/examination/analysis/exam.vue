<!--
  功能：试题分析
  作者：bianxiaokai
  时间：2023年07月27日 11:32:50
-->
<template>
	<div class="exam-container">
		<mTable
			ref="mTable"
			height="500px"
			:loading.sync="loading"
			stripe
			:columns="columns"
			:request="exerciseAnalysis"
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
		</mTable>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import mTable from '@c/business/table';
import { exerciseAnalysis } from '@/api/exam';

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
	name: 'analysis-exam',
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
					label: '题型',
					prop: 'themeTypeName',
				},
				{
					label: '难度',
					prop: 'questionsDifficultyName',
				},
				{
					label: '分类',
					prop: 'questionsTypeName',
				},
				{
					label: '题目',
					prop: 'themeName',
				},
				{
					label: '答案',
					prop: 'rightAnswerString',
				},
				{
					label: '错误次数',
					prop: 'errorCount',
				},
				{
					label: '错误率',
					prop: 'errorRate',
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
		exerciseAnalysis,
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
	created() {},
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
.exam-container {
	height: 91%;
}
</style>
