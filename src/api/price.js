import request from "./request";
export function gzpricelist(data) {
  return request({
    url: "/pricing/fault/template/list",
    method: "get",
    params:data
  });
}
export function gzpricexq(id) {
  return request({
    url: `/pricing/fault/template/detail/${id}`,
    method: "get",
  });
}
// 批量获取数据项
export function batch(data) {
  return request({
    url: `system/dict/types/items/batch`,
    method: "post",
    data
  });
}
// 新增故障定价
export function gzadd(data) {
  return request({
    url: `pricing/fault/template/save`,
    method: "post",
    data,
  });
}
// 修改故障定价
export function gzxg(data) {
  return request({
    url: `pricing/fault/template/update`,
    method: "post",
    data,
  });
}
// 删除故障定价
export function gzdel(data) {
  return request({
    url: `pricing/fault/template/${data}`,
    method: "delete",
  });
}
// 获取巡检定价列表
export function xjpricelist(data) {
  return request({
    url: "/pricing/inspection/template/list",
    method: "get",
    params: data,
  });
}
// 获取发电定价列表
export function fdpricelist(data) {
  return request({
    url: "/pricing/power/template/list",
    method: "get",
    params: data,
  });
}
// 获取运营商列表
export function yyslist() {
  return request({
    url: "/user/company-info/lookOverList",
    method: "get",
  });
}
// 巡检定价新增
export function xjadd(data) {
  return request({
    url: "pricing/inspection/template/save",
    method: "post",
    data
  });
}
// 获取巡检定价详情
export function xjpricexq(id) {
  return request({
    url: `/pricing/inspection/template/detail/${id}`,
    method: "get",
  });
}
// 获取发电定价详情
export function fdpricexq(id) {
  return request({
    url: `/pricing/power/template/detail/${id}`,
    method: "get",
  });
}
// 删除巡检定价模板
export function xjdel(data) {
  return request({
    url: `pricing/inspection/template/${data}`,
    method: "delete",
  });
}
// 删除发电定价
export function fddel(data) {
  return request({
    url: `pricing/power/template/${data}`,
    method: "delete",
  });
}
// 新增发电定价
export function fdadd(data) {
  return request({
    url: `pricing/power/template/save`,
    method: "post",
    data,
  });
}
// 定价默认值
export function defaultprice(data) {
  return request({
    url: `/pricing/default/ratio/default`,
    method: "get",
    params: data,
  });
}
// 修改巡检状态
export function xjstatus(data) {
  return request({
    url: `/pricing/inspection/template/update/status`,
    method: "post",
    data,
  });
}
// 修改发电状态
export function fdstatus(data) {
  return request({
    url: `/pricing/power/template/update/status`,
    method: "post",
    data,
  });
}
// 修改巡检定价
export function xjxg(data) {
  return request({
    url: `pricing/inspection/template/update`,
    method: "post",
    data,
  });
}
