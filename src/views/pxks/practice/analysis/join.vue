<!--
  功能：已答人员
  作者：bianxiaokai
  时间：2023年07月27日 11:32:50
-->
<template>
	<div class="exam-container">
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
			:request="request"
			:payload="queryParams"
		>
		</mTable>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import mTable from '@c/business/table';
const columns = [
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
		label: '已做题数',
		prop: 'answeredCount',
	},
	{
		label: '上次练习时间',
		prop: 'lastPracticeTime',
	},
];
const noColumns = [
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
		prop: 'userScore',
	},
];

export default {
	/**注册组件*/
	components: {
		mTable,
	},
	/**接受父组件传值*/
	props: {
		exerciseId: {
			type: Number | String,
			default: '',
		},
		isJoin: {
			type: Number | String,
			default: 0,
		},
		request: Function,
	},
	name: 'analysisJoin',
	data() {
		return {
			loading: false,
			queryParams: {},
			columns: [],
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {
		exerciseId: {
			immediate: true,
			handler(newVal, oldVal) {
				this.queryParams.exerciseId = newVal;
				setTimeout(() => {
					this.onSearch();
				}, 500);
			},
		},
	},
	/**所有方法*/
	methods: {
		onSearch() {
			this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams.memberName = '';
			this.onSearch();
		},
	},
	/**创建组件时执行(有VM对象this)*/
	created() {
		if (this.isJoin) {
			this.columns = columns;
		} else {
			this.columns = noColumns;
		}
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
.exam-container {
	height: 91%;
}
</style>
