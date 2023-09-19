<template>
	<section v-if="refreshView" class="app-main">
		<transition name="fade-transform" mode="out-in">
			<router-view :key="key" />
		</transition>
	</section>
</template>
<script>
export default {
	name: "AppMain",
	computed: {
		key() {
			return this.$route.path;
		},
		refreshView() {
			return this.$store.state.app.refreshView;
		},
	},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-main {
	@include scrollbar;
	width: 100%;
	position: relative;
	overflow: auto;
	height: 100vh;
	padding-left: 20px;
	padding-right: 20px;
	padding-bottom: 20px;
	background: #F2F5FA;
}
</style>
<style lang="scss">
@import "~@/styles/variables.scss";
</style>
