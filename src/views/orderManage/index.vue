<!--
  功能：工单管理
  作者：bianxiaokai
  时间：2023年08月27日 16:05:44
-->
<template>
	<div class="orderManager">
		<router-view></router-view>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）

export default {
	/**注册组件*/
	components: {},
	/**接受父组件传值*/
	props: {},
	name: '该组件名称',
	data() {
		return {};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {},
	/**所有方法*/
	methods: {},
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
</style>
