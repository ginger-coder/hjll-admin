import request from "./request";

// 工单
export function workOrder(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/order/work-order/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/order/work-order/${opt.name}`,
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
// 站点
export function workOrderArea(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	json = {
		url: `/order/work-order/${opt.name}`,
		method: opt.method,
		data,
	};
	return request(json);
}
// 模块
export function getModuleList(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/order/order-module/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/order/order-module/${opt.name}`,
			method: opt.method,
			data,
		};
	}
	return request(json);
}
// 工单
export function workOrderList(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/work-order/list`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/work-order/list`,
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
// 工单类型
export function workOrderType(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/order/work-order-type/${opt.name}`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/order/work-order-type/${opt.name}`,
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
// 巡检类型
export function xjType(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/order/work-order-type-details/${opt.name}`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/order/work-order-type-details/${opt.name}`,
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
// 设备
export function sbType(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/work-order/device`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/user/work-order/device`,
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
// 故障类型
export function gzType(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/work-order/deviceFaultInfo`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/user/work-order/deviceFaultInfo`,
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
// 站点详情
export function gztSiteDetail(opt, data) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/basestation/tSite/detail`,
			method: opt.method,
			params: data,
		};
	}
	return request(json);
}

// 历史工单 /recondition-history/page
export function reconditionHistory(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/recondition-history/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/recondition-history/${opt.name}`,
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
export function deviceList(params) {
	return request({
		url: `/basestation/device-info/deviceList`,
		method: "get",
		params,
	});
}
// 发电模板
export function fdList(params) {
	return request({
		url: `/user/dynamo-template/page`,
		method: "get",
		params,
	});
}
// 指派人列表
export function zpList(params) {
	return request({
		url: `/user/ums-member/list/for/area`,
		method: "get",
		params,
	});
}
// 运营商下拉
export function getAuthRecord(params) {
	return request({
		url: `/system/enterprise/auth/record`,
		method: "get",
		params,
	});
}
// 指派给人
export function assignTask(data) {
	return request({
		url: `/user/work-order/update`,
		method: "post",
		data,
	});
}
// 指派给人
export function dispatcherOrder(data) {
	return request({
		url: `/order/order-examine/dispatcherOrder`,
		method: "post",
		data,
	});
}
// 获取服务类型
export function getServiceType(data) {
	return request({
		url: `/system/dict/types/getItemByCode`,
		method: "get",
		params:data,
	});
}
// 工单详情
export function orderdetail(data) {
	return request({
		url: `/order/work-order-type/detail`,
		method: "post",
		params:data,
	});
}
// 工单编辑详情
export function getcreateinfo(data) {
	return request({
		url: `/order/work-order-type/update`,
		method: "post",
		params:data,
	});
}
// 巡检新增下拉框
export function getpollingseleect(data) {
	return request({
		url: `/order/work-order-type/page`,
		method: "get",
		params:data,
	});
}
// 巡检编辑详情
export function pollinginfo(data) {
	return request({
		url: `/order/work-order-type-details/detail`,
		method: "post",
		params:data,
	});
}
// 巡检编辑保存
export function pollingupdate(data) {
	return request({
		url: `/order/work-order-type-details/update`,
		method: "post",
		data,
	});
}
// 获取证书列表
export function getListForOrder(data) {
	return request({
		url: `/user/certificate/getListForOrder`,
		method: "get",
	});
}

// 获取工单价格分页列表
export function getOrderPriceList(data) {
	return request({
		url: `/order/workOrderPriceConfig/workerOrderPriceConfigPager`,
		method: "get",
        params: data
	});
}
// 获取工单价格详情
export function getOrderPriceDetail(data) {
	return request({
		url: `/order/workOrderPriceConfig/workerOrderPriceConfigDetail`,
		method: "get",
        params: data
	});
}
// 获取工单编辑
export function getOrderPriceEdit(data) {
	return request({
		url: `/order/workOrderPriceConfig/workOrderPriceConfig`,
		method: "post",
        data
	});
}
// 获取工单状态
export function orderChangeStatus(data) {
	return request({
		url: `/order/workOrderPriceConfig/updateGdPrieceConfigUseStatus`,
		method: "post",
        data
	});
}
// 退回运营商
export function returnToOperator(data) {
	return request({
		url: `/order/exception-order/returnToOperator`,
		method: "post",
        data
	});
}