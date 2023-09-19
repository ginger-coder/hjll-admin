import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken, getUserInfo } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

import { constantRoutes } from "@/router";
import { routerPhasII } from "@/router/routerPhasII";  //权限管第二期

import routes from "@/router/routes";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/register", "/dict", "/401", "/404", "/500", "/registerPass", "/passwordReset", "/yhxy", "/ystk"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
	// start progress bar
	NProgress.start();

	// set page title
	document.title = getPageTitle(to.meta.title);

	// determine whether the user has logged in
	const hasToken = getToken();
	if (hasToken) {
		if (to.path === "/login") {
			next({ path: "/" });
			NProgress.done();
		} else {
			const hasGetUserInfo = store.getters.user.roles.length > 0;
			if (hasGetUserInfo) {
				if (to.matched.length === 0) {
				  from.name ? next({ name: from.name }) : next('/401');
				} else {
				  next();
				}
				} else {
					try {
						let { roles } = await store.dispatch("user/authInfo");
						store.dispatch("permission/generateRoutes", roles)
							.then((res) => {
								let _routers = routerPhasII.concat(res);
								_routers.push({ path: "*", redirect: "/404", hidden: true });
								router.options.routes = _routers;
								router.selfaddRoutes(_routers);

								next({ ...to, replace: true });
						})
						.catch((err) => {
							console.log("permission/generateRoutes.err", err);
						});
				} catch (error) {
					await store.dispatch("user/authLogout");
					Message.error(error || "Has Error");
					next(`/login?redirect=${to.path}`);
					NProgress.done();
				}
			}
		}
	} else {
		/* has no token*/

		if (whiteList.indexOf(to.path) !== -1) {
			// in the free login whitelist, go directly
			next();
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next(`/login?redirect=${to.path}`);
			NProgress.done();
		}
	}
});

router.afterEach(() => {
	// finish progress bar
	NProgress.done();
});
