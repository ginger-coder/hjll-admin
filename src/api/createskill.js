import request from "./request";
export function saveskill(data){
    return request({
        url:'user/work-skill/save',
        method:'post',
        data
    })
}
export function updateskill(data){
    return request({
        url:'user/work-skill/update',
        method:'post',
        data
    })
}
export function delskill(data) {
  return request({
    url: "user/work-skill/delete",
    method: "post",
    params:data,
  });
}
// 技能查重
export function skillcode(data) {
  return request({
    url: "user/work-skill/verifyCode",
    method: "post",
    params: data,
  });
}
// 角色接口
export function saverole(data) {
    return request({
        url:'/user/work-role/save',
        method:'post',
        data
    })
}
// 删除角色
export function delrole(data) {
  return request({
    url: "user/work-role/delete",
    method: "post",
    params: data,
  });
}
// 编辑角色
export function updaterole(data) {
  return request({
    url: "user/work-role/update",
    method: "post",
    data,
  });
}
// 角色查重
export function rolecode(data) {
  return request({
    url: "user/work-role/verifyCode",
    method: "post",
    params: data,
  });
}