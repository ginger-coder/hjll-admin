import request from './request'
import qs from 'qs'


export function commUpload(post) {
  return request({
    url: '/comm/upload',
    method: 'post',
    data:post
  })
}

// storage
export function commStorage(opt, data,post) {
    opt.method = opt.method || 'get'
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/comm/storage/${opt.name}`,
            method: 'get',
            params:data
        }
    } else {
        json = {
            url: `/comm/storage/${opt.name}`,
            method: opt.method,
            params:data,
            data:post
        }
    }
    if(opt.name=='modify') json.url+=`?storageId=${post.id}`
    return request(json)
}

// tag
export function commTag(opt, data,post) {
    opt.method = opt.method || 'get'
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/comm/tag/${opt.name}`,
            method: 'get',
            params:data
        }
    } else {
        json = {
            url: `/comm/tag/${opt.name}`,
            method: opt.method,
            params:data,
            data:post
        }
    }
    if(opt.name=='modify') json.url+=`?tagId=${post.id}`
    return request(json)
}
