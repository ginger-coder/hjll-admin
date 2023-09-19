import request from "./request";
import qs from 'qs'
// 基站列表查询
export function getStation(data) {
  return request({
    url: "/resource/station/pages",
    method: "GET",
    params: data,
  });
}
// 账单列表详情
export function getDetail(data) {
  return request({
    url: "/user/billing-details/detail",
    method: "GET",
    params: data,
  });
}


