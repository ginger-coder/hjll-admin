import request from "./request";
export function peopleCount(data) {
  return request({
    url: "/user/ums-member/peopleCount",
    method: "post",
    data
  });
}
export function datalistpage(data) {
  return request({
    url: "/user/ums-member/peoplePage",
    method: "post",
    data
  });
}
export function umsmember(data) {
  return request({
    url: "/user/ums-member/rank",
    method: "post",
    data
  });
}
export function newPersonnelTrend(data) {
  return request({
    url: "/user/ums-member/newPersonnelTrend",
    method: "post",
    data
  });
}
// 工单统计接口
export function adminOrderReport(data) {
  return request({
    url: "/order/home/adminOrderReport",
    method: "post",
    data
  });
}