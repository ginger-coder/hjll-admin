import request from '../../api/request'

export function getTableData(params) {
    return request({
        url: '/order/order-examine/page',
        method: 'get',
        params
    })
}
export function getWorkOrderData(params) {
    return request({
        url: '/order/work-order/admin/getAdminPage',
        method: 'get',
        params
    })
}
// 工单分页详情
export function getWorkOrderTypeData(params) {
    return request({
        url: '/order/work-order-type-details/page',
        method: 'get',
        params
    })
}
// 异常工单列表
export function getExceptionOrderPage(params) {
	return request({
		url: '/order/exception-order/admin/page',
		method: 'get',
		params,
	});
}

export function details(id) {
    return request({
        url: '/order/order-examine/detail',
        method: 'post',
        params: {id}
    })
}
export function update(params) {
    return request({
        url: '/order/order-examine/update',
        method: 'post',
        data: params
    })
}
export function getReceiptTableData(params) {
    return request({
        url: '/order/order-confirm/page',
        method: 'get',
        params
    })
}

export function getReceiptDetails(id) {
    return request({
        url: '/order/order-confirm/confirmDetail',
        method: 'get',
        params: {id}
    })
}
// 回单确认
export function updateConfirmOrder(params) {
    return request({
        url: '/order/order-confirm/updateConfirmOrder',
        method: 'post',
        data: params
    })
}
// 巡检计划新增
export function savePollingPlan(opt, data, post) {
    return request({
        url: '/order/polling-plan/save',
        method: opt.method,
        params: data,
        data: post,
    })
}
// 巡检计划修改
export function updatePollingPlan(opt, data, post) {
    return request({
        url: '/order/polling-plan/update',
        method: opt.method,
        params: data,
        data: post,
    })
}
// 巡检计划详情
export function getPollingPlanDetail(id) {
    return request({
        url: '/order/polling-plan/detail',
        method: 'get',
        params: {id}
    })
}
// 审批
export function processPollingPlan(opt, data, post) {
    return request({
        url: '/order/polling-plan/process',
        method: opt.method,
        params: data,
        data: post,
    })
}