import request from "./request";

export function rolesPages(opt, data, post) {
	let json = {
		url: `/admin/roles/pages`,
		method: "get",
		params: data,
		data: post,
	}
	return request(json);
}
export function rolesOptions(opt, data, post) {
	let json = {
		url: `/admin/roles/options`,
		method: "get",
		params: data,
	}
	return request(json);
}
export function rolesRemove(opt, data, post) {
	let json = {
		url: `/admin/roles/${post.id}`,
		method: 'delete',
	}
	return request(json);
}
export function rolesCreate(opt, data, post) {
	var json = {
		url: `/admin/roles`,
		method: 'post',
		params: data,
		data: post,
	};
	return request(json);
}
export function rolesUpdate(opt, data, post) {
	var json = {
		url: `/admin/roles`,
		method: 'put',
		params: data,
		data: post,
	};
	return request(json);
}
export function rolesInfo(opt, data, post) {
	var json = {
		url: `/admin/roles/${data.id}`,
		method: "get",
	};
	return request(json);
}
// 添加成员
export function addUserRoles(opt, data, post) {
	var json = {
		url: `/admin/roles/addUser/${data.id}`,
		method: "post",
		data: post,
	};
	return request(json);
}
// 分配角色的资源权限
export function updateMenus(opt, data, post) {
	var json = {
		url: `/admin/roles/${data.id}/menus`,
		method: "put",
		data: post,
	};
	return request(json);
}

export function updateMenusForCompany(opt, data, post) {
	var json = {
		url: `/admin/roles/company/${data.id}/menus`,
		method: "put",
		data: post,
	};
	return request(json);
}

// 分配菜单
export function addMenus(opt, data, post) {
	var json = {
		url: `/admin/menus/addMenus`,
		method: "post",
		data: post,
	};
	return request(json);
}
// 获取角色的菜单ID集合
export function getMenuIds(opt, data, post) {
	var json = {
		url: `/admin/roles/${data.id}/menuIds`,
		method: "get",
	};
	return request(json);
}
// 获取企业端菜单集合
export function getMenuIdsForCompany(opt, data, post) {
	var json = {
		url: `/admin/roles/company/${data.id}/menuIds`,
		method: "get",
	};
	return request(json);
}

// 移除
export function removeUserRole(opt, data, post) {
	let json = {
		url: `/admin/roles/userRole`,
		method: "get",
		params: data,
	}
	return request(json);
}
// 菜单权限
export function getMenusResources(opt, data, post) {
	let json = {
		url: `/admin/menus/resources`,
		method: "get",
		params: data,
	}
	return request(json);
}

// 企业端菜单权限
export function getMenusResourcesForCompany(opt, data, post) {
	let json = {
		url: `/admin/menus/company/resources`,
		method: "get",
		params: data,
	}
	return request(json);
}

// 获取角色的权限
export function rolesMenuIds(opt, data, post) {
	var json = {
		url: `/admin/roles/${data.id}/menuIds`,
		method: "get",
	};
	return request(json);
}

// 获取各部门下成员(租户)
export function getDeptUser(opt, data, post) {
	var json = {
		url: `/admin/dept/deptUser`,
		method: "get",
	};
	return request(json);
}
// 设置角色的权限
export function rolesMenu(opt, data, post) {
	var json = {
		url: `/admin/roles/${data.id}/menus`,
		method: "put",
		data: post,
	};
	return request(json);
}
