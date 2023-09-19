import request from './request'

// data
export function upsData(opt, data, post) {
    opt.method = opt.method || 'get'
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/ups/data/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/ups/data/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?dataId=${post.id}`
    }
    return request(json)
}


// check
export function upsCheck(opt, data, post) {
    opt.method = opt.method || 'get'
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/ups/check/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/ups/check/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?checkId=${post.id}`
    }
    return request(json)
}