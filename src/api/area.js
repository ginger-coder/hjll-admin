import request from "./request";

// 工单
export function areaAll(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/resource/station/area/${opt.name}`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/resource/station/area/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	if (opt.name == "update") {
		json.url += `?workOrder=${post.id}`;
	}
	return request(json);
}
export function area(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/blade-region/${opt.name}`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/admin/blade-region/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	if (opt.name == "update") {
		json.url += `?workOrder=${post.id}`;
	}
	return request(json);
}

// 根据区域查询区域下全部基站
export function getStationList(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	json = {
		url: `/resource/station/list/${opt.name}`,
		method: "get",
		params: data,
	};
	return request(json);
}
// 工单
export function areaOrder(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/blade-region/RegionList/${opt.name}`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/admin/blade-region/RegionList/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	if (opt.name == "update") {
		json.url += `?workOrder=${post.id}`;
	}
	return request(json);
}

