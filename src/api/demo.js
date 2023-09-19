import request from './request'

export function tableList(opt, params, post) {
    let json = {
        url: `/vue-admin-template/table/list`,
        method: 'get',
        params: params
    }
    return request(json)
}

export function tableQuery(opt, params, post) {
    let json = {
        url: `/vue-admin-template/table/query`,
        method: 'get',
        params: params
    }
    return request(json)
}

export function orderList(opt, params, post) {
    let json = {
        url: `/vue-admin-template/order/list`,
        method: 'get',
        params: params
    }
    return request(json)
}

export function logList(opt, params, post) {
    let json = {
        url: `/vue-admin-template/log/list`,
        method: 'get',
        params: params
    }
    return request(json)
}

// 账号
export function accountList(opt, params, post) {
    let json = {
        url: `/vue-admin-template/account/list`,
        method: 'get',
        params: params
    }
    return request(json)
}