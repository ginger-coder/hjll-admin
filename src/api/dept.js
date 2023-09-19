import request from "./request";

export function deptPage(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/dept`,
			method: "get",
			params: data,
			// data: post,
		};
	} 
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}

export function deptCreate(opt, data, post) {
	var json = {
		url: `/admin/dept`,
		method: 'post',
		params: data,
		data: post,
	};
	return request(json);
}
export function deptUpdate(opt, data, post) {
	var json = {
		url: `/admin/dept/updateDept`,
		method: 'post',
		params: data,
		data: post,
	};
	return request(json);
}

export function dept(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/dept/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else if(opt.method=='patch'){
		json = {
			url: `/admin/dept/${data.id}/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}else if(opt.name=='update'){
		json = {
			url: `/admin/dept/${post.id}`,
			method: 'put',
			data: post,
		};
	}else if(opt.name=='remove'){
		json = {
			url: `/admin/dept/${post.id}`,
			method: 'delete',
		};
	} else {
		json = {
			url: `/admin/dept/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}
// 部门详情
export function deptInfo(opt, data, post) {
	let json = {};
	json = {
		url: `/admin/dept/${data.userId}/form`,
		method: "get",
	};
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}
// 负责人下拉
export function getUsersList(opt, data, post) {
	let json = {
		url: `/admin/users/list`,
		method: "get",
		params: data,
	}
	return request(json);
}
// 全部地区
export function getAllRegionList(opt, data, post) {
	let json = {
		url: `/admin/blade-region/allRegion`,
		method: "get",
		params: data,
	}
	return request(json);
}
// 上级部门地区范围
export function getAllBranchRegionList(opt, data, post) {
	let json = {
		url: `/admin/blade-region/allBranchRegion`,
		method: "get",
		params: data,
	}
	return request(json);
}
// 删除校验
export function checkDept(opt, data, post) {
	var json = {
		url: `/admin/dept/check/${data.id}`,
		method: 'get',
	};
	return request(json);
}
// 删除校验
export function deleteDepartments(opt, data, post) {
	var json = {
		url: `/admin/dept/deleteDepartments`,
		method: 'get',
		params: data
	};
	return request(json);
}