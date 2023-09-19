<template>
	<div class="navbar">
		<hamburger v-if="isShowHamburger" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
		<breadcrumb class="breadcrumb-container" />
		<div class="right-menu">
			<template>
				 <div style="display: inline-flex;align-items: center;height: 100%;"><i class="el-icon-ice-cream-screen" @click="backNewIndex" style="cursor: pointer;font-size: 26px;margin-right: 8px;"></i></div>
				<screenfull id="screenfull" class="right-menu-item hover-effect" />
				<refresh id="header-refresh" class="right-menu-item hover-effect" />
			</template>
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<img v-if="avatar" :src="avatar" class="user-avatar" />
					<img v-else src="@/assets/avatar.png" class="user-avatar" />
					<div class="user-names">{{ name }}</div>
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/personal/personal">
						<el-dropdown-item> 个人中心 </el-dropdown-item>
					</router-link>
					<el-dropdown-item @click.native="logout">
						<span style="display: block">退出登录</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import refresh from "@/components/refresh";
import { getUserInfo } from "@/utils/auth";
import store from "@/store";
import { serverMock, setTheme } from "@/settings";
import {usersMeAdmin} from "@/api/users"

export default {
	components: {
		Breadcrumb,
		Hamburger,
		Screenfull,
		refresh,
	},
	data() {
		return {
		};
	},
	computed: {
		...mapGetters(["sidebar", "hamburger", "avatar", 'name']),
		isShowHamburger() {
			return this.hamburger.show;
		},
		needScreenfull() {
			return this.$store.state.settings.screenfull;
		},
		needRefresh() {
			return this.$store.state.settings.openRefresh;
		},
		name() {
			console.log(this.$store.getters);
			
			return this.$store.getters.user.name;
		}
	},
	mounted() {

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
		backNewIndex(){
			// this.$router.push({
			// 	path: "/newIndex#",
			// });
			this.$router.push({
				path: "/china",
			});
		}
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
					top: 14px;
					font-size: 12px;
					color: #333;
				}
			}
		}
	}
}
</style>
