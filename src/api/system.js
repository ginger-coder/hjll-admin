import request from './request'

// 账号
export function systemManager(opt, data, post) {
    opt.method = opt.method || 'get'
    let json = {}
    if (opt.method == 'get') {
        json = {
            url: `/manager/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/manager/${opt.name}`,
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
// 字典接口
export function getBatch(data) {
    return request({
      url: "/admin/dict/types/items/batch",
      method: "POST",
      data,
    });
  }
// 字典接口
export function getBatchSystem(data) {
    return request({
      url: "/system/dict/types/items/batch",
      method: "POST",
      data,
    });
  }
// 首页图表接口
export function getStatisticalData(data) {
    return request({
      url: "/admin/home/statisticalData",
      method: "GET",
      params:data,
    });
  }
// 首页统计接口
export function getBase(data) {
    return request({
      url: "/admin/home/base",
      method: "GET",
      params:data,
    });
  }
  export function getEnterprise(data) {
    return request({
      url: "/system/enterprise/pages",
      method: "GET",
      params:data,
    });
  }    
  