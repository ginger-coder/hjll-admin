import request from "./request";

// 模板
export function mbConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-template/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-template/${opt.name}`,
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
// 模块
export function mkConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-module/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-module/${opt.name}`,
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
			url: `/order/order-item/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/order/order-item/${opt.name}`,
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
// 维修项目批量保存维修要求
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
export function getTableData(params) {
    return request({
        url: '/order/order-module/modulePage',
        method: 'get',
        params:{...params,orderType:'WX-TYPE-369'}
    })
}
//获取对应的维修项目列表
export function getPollingItemPage(params) {
    return request({
        url: '/order/order-item/pollingItemPage',
        method: 'get',
        params:{...params,orderType:'WX-TYPE-369'}
    })
}

export function getPollingType(opt, data, post) {
    return request({
        url: '/order/work-order-type-details/getPollingType',
        method: 'get',
		params: data,
		data: post,
    })
}
export function updatePollingModule(opt, data, post) {
    return request({
        url: '/order/order-module/updatePollingModule',
        method: 'post',
		params: data,
		data: post,
    })
}
export function savePollingModule(opt, data, post) {
    return request({
        url: '/order/order-module/savePollingModule',
        method: 'post',
		params: data,
		data: post,
    })
}
//获取对应的维修项目详情
export function getPollingItemDetail(params) {
    return request({
        url: '/order/order-module/detail',
        method: 'get',
        params:params
    })
}
export function removePollingModule(opt, data, post) {
    return request({
        url: '/order/order-module/remove',
        method: 'post',
		params: data,
		data: post,
    })
}

//获取配置维修要求的四项参数
export function getItemByCode(params) {
    return request({
        url: '/system/dict/types/getItemByCode',
        method: 'get',
        params:params
    })
}

//获取当前项目下已存在的要求配置
export function getRequire(opt, data, post) {
    return request({
        url: '/order/order-item/getRequire',
		method: 'get',
		params: data,
    })
}


