import request from './request'

// zz
export function zz(opt, data, post) {
    opt.method = opt.method || 'get'
    delete data.url;
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/basestation/tSite/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/basestation/tSite/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?adminId=${post.id}`
    }
    return request(json)
}
// zzExport
export function zzExport(post) {
    let json = {
        url:'basestation/tSite/export',
        method:'post',
        data:post
    }

    return request(json)
}

// tt
export function tt(opt, data, post) {
    opt.method = opt.method || 'get'
    delete data.url;
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/basestation/towerInfo/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/basestation/towerInfo/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?adminId=${post.id}`
    }
    return request(json)
}

// tt
export function jf(opt, data, post) {
    opt.method = opt.method || 'get'
    delete data.url;
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/basestation/machine-room-info/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/basestation/machine-room-info/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?adminId=${post.id}`
    }
    return request(json)
}

export function device(opt, data, post) {
    opt.method = opt.method || 'get'
    let {url} = data
    delete data.url;
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/basestation/${url}/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/basestation/${url}/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?adminId=${post.id}`
    }
    return request(json)
}

// 获取所有设备分类及名称
export function allDeviceType(opt, data, post) {
    opt.method = opt.method || "get";
    let json = {};
    if (opt.method == "get") {
        json = {
            url: `/basestation/device-type-info/getAllDeviceType`,
            method: "get",
            params: data,
            data: post,
        };
    } else {
        json = {
            url: `/basestation/device-type-info/getAllDeviceType`,
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

// 根据巡检类型获取所有设备信息
export function allDevice(opt, data, post) {
    opt.method = opt.method || "get";
    let json = {};
    if (opt.method == "get") {
        json = {
            url: `/basestation/device-info/getAllDevice`,
            method: "get",
            params: data,
            data: post,
        };
    } else {
        json = {
            url: `/basestation/device-info/getAllDevice`,
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

// 根据巡检类型Id,设备Id,获取所有对应的故障信息
export function allDeviceFault(opt, data, post) {
    opt.method = opt.method || "get";
    let json = {};
    if (opt.method == "get") {
        json = {
            url: `/basestation/device-fault-info/getAllDeviceFault`,
            method: "get",
            params: data,
            data: post,
        };
    } else {
        json = {
            url: `/basestation/device-fault-info/getAllDeviceFault`,
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

export function workOrderType(params = {}) {
    return request({
        method: 'get',
        url: '/user/work-order-type-details/page',
        params: {
            size: 9999,
            current: 1,
            ...params
        }
    })
}

export function configurePage(params = {}) {
    return request({
        method: 'get',
        url: '/user/module-configure/page',
        params: {
            size: 9999,
            current: 1,
            ...params
        }
    })
}export function itemsPage(params = {}) {
    return request({
        method: 'get',
        url: '/system/dict/items/pages',
        params: {
            typeCode: 'require_type'
        }
    })
}
// 设备管理新接口

export function newsebei() {
	return request({
		url: "/basestation/device-info/getMiddleDevice",
		method: "get",
	});
}
export function newsebeiList(data) {
	return request({
		url: "/basestation/device-info/getDeviceList",
		method: "get",
        params:data
	});
}
// 导出接口
export function searexportDevice(data) {
	return request({
		url: "/basestation/device-info/exportDevice",
		method: "get",
        params:data,
        responseType: "blob",
	});
}
// 站址审核
export function shenge(data) {
	return request({
		url: "/basestation/site-examine-info/page",
		method: "get",
        params:data,
	});
}
// 站址详情
export function shengeinfo(data) {
	return request({
		url: "/basestation/site-examine-info/detail",
		method: "post",
         params:data,
	});
}

export function refus(data) {
	return request({
		url: "/basestation/site-examine-info/updateBatch",
		method: "post",
         data,
	});
}
