import request from './request'

// 角色
export function emRole(opt, data, post) {
    opt.method = opt.method || 'get'
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/em/role/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/em/role/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    if (opt.name == 'modify') {
        json.url += `?roleId=${post.id}`
    }
    return request(json)
}