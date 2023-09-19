import request from '../../../api/request'

export function getTableData(params) {
    return request({
        url: '/user/billing-details/page',
        method: 'get',
        params
    })
}

export function details(id) {
    return request({
        url: '/user/billing-details/detail',
        method: 'get',
        params: {id}
    })
}