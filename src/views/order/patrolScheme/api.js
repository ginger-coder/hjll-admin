import request from "@/utils/request";
import { deepClone } from "@/utils";
export function getTableData(params,post) {
    let data=deepClone(params);
    delete data.current;
    delete data.size;
    return request({
        url: '/order/polling-plan/page?current='+params.current+'&size='+params.size,
        method: 'post',
        data:data,
        
    })
}
export function getApproveTableData(params,post) {
    let data=deepClone(params);
    delete data.current;
    delete data.size;
    return request({
        url: '/order/polling-plan/approvePage?current='+params.current+'&size='+params.size,
        method: 'post',
        data:data,
        
    })
}
// 删除
export function deletePollingPlan(post) {
    return request({
        url: `/order/polling-plan/${post}`,
        method: 'get',
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
// 提交
export function updateStatusPollingPlan(opt, data, post) {
    return request({
        url: '/order/polling-plan/updateStatus',
        method: opt.method,
        params: data,
        data: post,
    })
}