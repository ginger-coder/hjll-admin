<template>
	<div class="navbar disp_flex ali_cen ju_bet">
		<!-- <hamburger v-if="isShowHamburger" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
		<div class="leftBox disp_flex ali_cen">
			<img src="@/assets/logo.png" />
			{{ title }}
		</div>
		<div class="right-menu">
			<template>
				<screenfull v-if="needScreenfull" id="screenfull" class="right-menu-item hover-effect" />
				<!-- <notice id="notice" class="right-menu-item" /> -->
			</template>
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<avatar-box :text="name" :scale="1.125" :path="avatar"></avatar-box>
					<div class="user-names">{{ name }}</div>
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/">
						<el-dropdown-item> 首页 </el-dropdown-item>
					</router-link>
					<!-- <router-link to="/resetPwd">
						<el-dropdown-item> 修改密码 </el-dropdown-item>
					</router-link> -->
					<el-dropdown-item divided @click.native="logout">
						<span style="display: block">退出登录</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import refresh from "@/components/refresh";
// import Search from '@/components/HeaderSearch'
// import notice from '@/components/notice'
// import theme from '@/components/theme'
// import Setting from '@/components/Setting'

import { serverMock, setTheme, title } from "@/settings";
import avatarBox from "@/components/avatarBox";
import { getUserInfo } from "@/utils/auth";
import store from "@/store";
export default {
	components: {
		Hamburger,
		Screenfull,
		refresh,
		avatarBox,
		// Search,
		// notice,
		// Setting,
		// theme,
	},
	data() {
		return {
			title: title,
			name: "",
		};
	},
	computed: {
		...mapGetters(["sidebar", "hamburger", "avatar"]),
		isShowHamburger() {
			return this.hamburger.show;
		},
		needSetTheme() {
			return setTheme;
		},
		needSearch() {
			return this.$store.state.settings.openSearch;
		},
		needScreenfull() {
			return this.$store.state.settings.screenfull;
		},
		needRefresh() {
			return this.$store.state.settings.openRefresh;
		},
	},
	mounted() {
		this.name = getUserInfo("systemName");
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch("app/toggleSideBar");
		},
		async logout() {
			await store.dispatch("user/authLogout").then((res) => {
				// this.$router.push(`/login?redirect=${this.$route.fullPath}`)
			});
		},
	},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.navbar {
	height: #{$topBarHeight};
	overflow: hidden;
	position: relative;
	z-index: 1;
	background-color: #fff;
	.leftBox {
		height: 100%;
		padding-left: 20px;
		font-size: 24px;
		font-weight: 400;
		img {
			width: 32px;
			height: 32px;
			vertical-align: middle;
			margin-right: 12px;
		}
	}

	.hamburger-container {
		line-height: #{$topBarHeight};
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}

		& + .breadcrumb-container {
			margin-left: 8px;
		}
	}

	.breadcrumb-container {
		float: left;
		margin-left: 15px;
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: #{$topBarHeight};

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-flex;
			align-items: center;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #333;
			margin-right: 0;
			vertical-align: top;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;
			display: inline-flex;
			align-items: center;
			margin-left: 10px;
			height: $topBarHeight;
			cursor: pointer;
			vertical-align: top;

			.avatar-wrapper {
				position: relative;
				display: flex;
				align-items: center;

				.user-names {
					color: #333;
					font-weight: bold;
					margin-left: 10px;
					display: inline-block;
					line-height: 36px;
					vertical-align: top;
				}

				.user-avatar {
					width: 36px;
					height: 36px;
					border-radius: 36px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					font-size: 12px;
					color: #333;
				}
			}
		}
	}
}
</style>
