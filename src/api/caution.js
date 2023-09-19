import request from "./request";
import qs from 'qs'
// 告警列表
export function getCautionPage(data) {
    return request({
      url: "/donghuan/alarm-info/page",
      method: "GET",
      params: data,
    });
  }

// 树结构
export function getTree(data) {
    return request({
      url: "/donghuan/area-info/tree",
      method: "POST",
      data,
    });
  }
// 告警详情
export function getDetail(data) {
  return request({
    url: "/donghuan/alarm-info/detail",
    method: "POST",
    data,
  });
}
// 告警确认
export function confirmAlarm(data) {
  return request({
    url: "/donghuan/alarm-info/confirmAlarm",
    method: "POST",
    data,
  });
}
// 告警消除
export function clearAlarm(data) {
  return request({
    url: "/donghuan/alarm-info/clearAlarm?ids="+data,
    method: "POST",
  });
}
// 告警转工单
export function conversionAlarm(data) {
  return request({
    url: "/donghuan/alarm-info/convertWorkOrder?siteId="+data,
    method: "POST",
  });
}

