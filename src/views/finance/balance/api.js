import request from '../../../api/request'

export function getTableData(params) {
    return request({
        url: '/user/cash-out/page',
        method: 'get',
        params
    })
}

export function details(id) {
    return request({
        url: '/user/cash-out/detail',
        method: 'get',
        params: {id}
    })
}export function cashStatus(data) {
    return request({
        url: '/user/cash-out/update/cash/status',
        method: 'post',
        data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}