import request from "./request";
export function getCommunication() {
  return request({
    url: "/user/polling-plan/companyList",
    method: "get",
  });
}
export function createliste(data) {
  return request({
    url: "/user/work-order/pollingPlan/save",
    method: "post",
    data,
  });
}
export function gettemplate(data) {
  console.log(data);
  return request({
    url: `/user/polling-template/page?current=1&size=999&orderTypeDetailsId=${data}`,
    method: "get",
  });
}
export function queryList(data){
  return request({
    url: '/user/polling-plan/page',
    method: "get",
    params:data,
  });
}
export function deleteList(id){
  return request({
    url: `/user/polling-plan/${id}`,
    method: "delete",
  });
}
// 详情接口
export function particularsList(data){
  return request({
    url: `/user/polling-plan/detail?id=${data}`,
    method: "get",
  });
}
// 编辑接口
export function setParticularsList(data){
  return request({
    url: '/user/work-order/pollingPlan/z',
    method: "post",
    data
  });
}