import request from "./request";

export function menusPages(opt, data, post) {
	let json = {
		url: `/system/menus`,
		method: "get",
		params: {...data,source:1},
		data: post,
	}
	return request(json);
}
export function menusRemove(opt, data, post) {
	let json = {
		url: `/system/menus/${post.id}`,
		method: 'delete',
	}
	return request(json);
}
export function menusCreate(opt, data, post) {
	var json = {
		url: `/system/menus`,
		method: 'post',
		params: data,
		data: post,
	};
	return request(json);
}
export function menusUpdate(opt, data, post) {
	var json = {
		url: `/system/menus/${post.id}`,
		method: 'put',
		params: data,
		data: post,
	};
	return request(json);
}
export function menusStateUpdate(opt, data, post) {
	var json = {
		url: `/system/menus/company/${post.id}`,
		method: 'patch',
		params: data,
		data: post,
	};
	return request(json);
}
export function menusInfo(opt, data, post) {
	var json = {
		url: `/system/menus/${data.id}`,
		method: "get",
	};
	return request(json);
}
export function menusQuery(opt, data, post) {
	var json = {
		url: `/system/menus/options`,
		method: "get",
	};
	return request(json);
}
// 获取当前账号的路由
export function menusResources(opt, data, post) {
	var json = {
		url: `/system/menus/resources`,
		method: "get",
	};
	return request(json);
}
// 获取当前账号的路由
export function menusRoutes(opt, data, post) {
	var json = {
		url: `/system/menus/routes`,
		method: "get",
	};
	return request(json);
}
