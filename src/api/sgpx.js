import request from "./request";
export function ldtpage(data) {
  return request({
    url: "/user/line-down-train/page",
    method: "get",
    data
  });
}
export function tepage(data) {
  return request({
    url: "user/theory-exam/page",
    method: "get",
    data,
  });
}
export function scpage(data) {
  return request({
    url: "user/theory-exam/page",
    method: "get",
    data,
  });
}
export function addressset(data) {
  return request({
    url: "user/train-address/page",
    method: "get",
    data,
  });
}
// 删除培训地址
export function deladdress(data) {
  return request({
    url: "user/train-address/remove",
    method: "post",
    params:data,
  });
}
// 新增培训地址
export function address(data) {
  return request({
    url: "user/train-address/save",
    method: "post",
    data,
  });
}
// 修改培训地址
export function updateaddress(data) {
  return request({
    url: "user/train-address/update",
    method: "post",
    data,
  });
}