import request from "@/api/request";
export function gettabledata(data) {
	return request({  //获取列表接口
		url: "resource/vehicle/findPage",
		method: "get",
		params:data,
	});
}
export function getphotoinfo(data) {
	return request({  //行驶证正本接口
		url: "basic/Staff/vehicleLicense/front",
		method: "post",
		params:data,
	});
}
export function getphotoinfo2(data) {
	return request({  //行驶证副本接口
		url: "basic/Staff/vehicleLicense/back",
		method: "post",
		params:data,
	});
}
export function getbelselect() {
	return request({  //获取资产所属方下拉
		url: "system/dict/types/property_belong/items",
		method: "get",
	});
}
export function tabledataadd(data) {
	return request({  //车辆管理新增更新接口
		url: "resource/vehicle/saveOrUpdate",
		method: "post",
		data
	});
}
export function insurancetype(data) {
	return request({  //车辆管理保险类型下拉框
		url: "system/dict/types/insurance_type/items",
		method: "get",
	});
}
export function insuraneinfo(data) {
	return request({  //车辆管理详情接口
		url: "resource/vehicle/detail",
		method: "get",
		params:data
	});
}
export function insuranedelete(data) {
	return request({  //车辆管理删除
		url: "resource/vehicle/delete",
		method: "get",
		params:data
	});
}
export function cartype() {
	return request({  //车辆型号下拉
		url: "resource/vehicle/getVehicleModels",
		method: "get",
	});
}
export function monytype(data) {
	return request({  //资产归属下拉
		url: "system/dict/types/property_belong/items",
		method: "get",
	});
}