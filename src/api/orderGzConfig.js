import request from "./request";

// 模板
export function mbConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/fault-template/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/fault-template/${opt.name}`,
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
// 环节
export function hjConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/fault-link/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/fault-link/${opt.name}`,
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
// 环节
export function requireConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/fault-require/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/fault-require/${opt.name}`,
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
// 要求
export function yqConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/fault-content/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/fault-content/${opt.name}`,
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
// 项目
export function xmConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-item/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-item/${opt.name}`,
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
// 巡检项目批量保存巡检要求
export function xmyqConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-require/requireListBatch`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-require/requireListBatch`,
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