import request from "./request";
// 证书列表
export function Certificatelist(data) {
    return request({
      url: "/user/certificate/page",
      method: "GET",
      params:data
    });
 }
//  证书详情
export function Certificatelistinfor(data) {
    return request({
      url: "/user/certificate/getDetail",
      method: "GET",
      params:data
    });
 }
 export function Certificatelistinfortwo(data) {
    return request({
      url: "/user/ums-member/getUmsByCertificate",
      method: "GET",
      params:data
    });
 }
//  证书新增
export function Certificatelistadd(data) {
    return request({
      url: "/user/certificate/saveOrModify",
      method: "POST",
      data
    });
 }
 //  证书删除
export function Certificatelistdelete(data) {
    return request({
      url: "/user/certificate/deleteById",
      method: "GET",
      params:data
    });
 }
//  证书详情
export function Certificatelistcomplice(data) {
    return request({
      url: "/user/certificate/getDetail",
      method: "GET",
      params:data
    });
 }
//  工单列表
export function ordercreatelist() {
    return request({
      url: "/user/certificate/getListForOrder",
      method: "GET",
    });
 }
//  状态开启关闭
export function statusopen(data) {
    return request({
      url: "/user/certificate/openOrClose",
      method: "GET",
      params:data
    });
 }
//  状态开启关闭
export function statusaddeas(data) {
    return request({
      url: "/user/certificate/saveRoleCertificate",
      method: "POST",
      data
    });
 }
 //  关联证书回显
export function zscreated(data) {
  return request({
    url: "/user/certificate/getRoleCertificate",
    method: "GET",
    params:data
  });
}