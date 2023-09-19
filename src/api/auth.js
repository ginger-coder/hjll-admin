import request from "./request";

import store from "@/store";
import { resetRouter } from "@/router";

import { setUserInfo, getUserInfo, removeUserInfo } from "@/utils/auth";
import router from "@/router";
export function authLogin(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `auth/oauth/token`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `auth/oauth/token`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	return request(json);
}

// 注册获取邮箱验证码
export function getEmailCode(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `basic/mail/simple`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `basic/mail/simple`,
			method: opt.method,
			data: post,
		};
	}
	return request(json, true);
}

// 注册
export function register(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/api/users/save`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/user/api/users/save`,
			method: opt.method,
			data: post,
		};
	}
	return request(json);
}
// 忘记密码
export function update_password(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/users/update_password`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/admin/users/update_password`,
			method: opt.method,
			data: post,
		};
	}
	return request(json);
}

export function authInfo() {
	// 权限管理第一个版本
	// let userId = getUserInfo('userId');
	// return request({
		// 	url: `/user/api/users/roleKey/${userId}`,
		// 	method: "get",
		// });
	// 权限管理第二个版本
	// let username = store.getters.user.name
	return request({
		url: `/admin/users/me`,
		method: "get",
	});
}

export function authModify(data) {
	return request({
		url: "/auth/info",
		method: "put",
		data,
	});
}

export function authLogout() {
	return request({
		url: "/auth/oauth/logout",
		method: "delete",
	});
	console.log("222");
	store.dispatch("user/resetToken");
	resetRouter();
	store.dispatch("tagsView/delAllViews");
	router.replace({ path: "/login" });
}
