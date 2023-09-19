import request from "./request";
import qs from 'qs'
// 系统消息分页
export function messagePage(data) {
  return request({
    url: "/message/system-message/page",
    method: "POST",
    data
  });
  
}
// 工单消息分页
export function orderMessagePage(data) {
  return request({
    url: "/message/msgController/queryMessagePager",
    method: "GET",
    params:data
  });
}
// 工单消息已读
export function msgMarkAsRead(data) {
  return request({
    url: "/message/msgController/msgMarkAsRead",
    method: "POST",
    data
  });
}
// 工单消息删除
export function msgDel(data) {
  return request({
    url: "/message/msgController/msgDel",
    method: "POST",
    data
  });
}
// 工单消息pc轮询弹框
export function queryMessagePCPop(data) {
  return request({
    url: "/message/msgController/queryMessagePCPop",
    method: "GET",
    params:data
  });
}
// 创建消息
export function messageSave(data) {
  return request({
    url: "/message/system-message/save",
    method: "POST",
    data
  });
}
// 修改消息
export function messageUpdate(data) {
  return request({
    url: "/message/system-message/update",
    method: "POST",
    data
  });
}
// 发送消息
export function messageSend(data) {
  return request({
    url: "/message/system-message/send",
    method: "GET",
    params: data,
  });
}
// 消息详情
export function messageDetail(data) {
  return request({
    url: "/message/system-message/detail",
    method: "GET",
    params: data,
  });
}
// 下拉分类
export function messageItem(data) {
  return request({
    url: "/system/dict/items/pages",
    method: "GET",
    params: data,
  });
}
// 删除消息
export function messageDellete(data) {
  return request({
    url: "/message/system-message/"+data,
    method: "DELETE",
  });
}
// 人员列表
export function getRoList(data) {
  return request({
    url: "/itembank/exam/crowd2",
    method: "post",
    data,
});
}
// 人员类型下拉
export function getTypeList(data) {
  return request({
    url: "/system/dict/types/user_type/items",
    method: "GET",
    params:data,
});
}
// 平台内部用户分页
export function getInterior(data) {
  return request({
    url: "/admin/users/pages",
    method: "GET",
    params:data,
});
}
// 平台部门
export function getDept(data) {
  return request({
    url: "/admin/dept",
    method: "GET",
    params:data,
});
}
// 消息接收列表
export function receivePage(data) {
  return request({
    url: "/message/system-message/platform/receive/page",
    method: "GET",
    params:data,
});
}

// 修改接收列表未读消息
export function updateReceive(data) {
  return request({
    url: "/message/system-message/platform/update/status",
    method: "GET",
    params:data,
});
}
// 角色列表
export function getOptions(data) {
  return request({
    url: "/admin/roles/options",
    method: "GET",
    params:data,
});
}
// 接收列表删除接口
export function founDelete(data) {
  return request({
    url: "/message/system-message-user/receive/delete",
    method: "DELETE",
    params:data,
});
}

