<!--
  功能：学习记录
  作者：bianxiaokai
  时间：2023年07月29日 09:47:51
-->
<template>
	<div class="studeyHistory">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane
				label="学员数据"
				name="/testTrain/history/study"
                v-if="perms.includes('sys:studeyHistory:study')"
			></el-tab-pane>
			<el-tab-pane
				label="课程数据"
				name="/testTrain/history/lesson"
                v-if="perms.includes('sys:studeyHistory:lesson')"
			></el-tab-pane>
		</el-tabs>
        <div class="history-box">
            <router-view />
        </div>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）

export default {
	/**注册组件*/
	components: {},
	/**接受父组件传值*/
	props: {},
	name: 'studyHistory',
	data() {
		return {
			activeName: '/testTrain/history/study',
			roleUserList: [],
            perms: [],
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {
		$route: {
			handler: function (val, oldVal) {
				this.activeName = val.path;
				if (val.path == '/testTrain/history') {
					this.$router.replace('/testTrain/history/study');
				}
			},
			// 深度观察监听
			deep: true,
			immediate: true,
		},
	},
	/**所有方法*/
	methods: {
		handleClick(route) {
			this.$router.push(route.name);
		},
	},
	/**创建组件时执行(有VM对象this)*/
	created() {},
	/**加载完组件时执行(主要预处理数据)*/
    mounted() {
        this.perms = this.$store.getters.user.perms;
    },
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
.studeyHistory {
    height: 100%;
    display: flex;
    flex-direction: column;
    .history-box {
        flex: 1;
    }
}
</style>
