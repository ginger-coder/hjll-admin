import request from "./request";
export function personalcenter() {
    return request({
      url: "user/PersonalCenter/user",
      method:'get'
    });
}
export function verifypwd(data) {
  return request({
    url: "user/api/users/verifyPassWord",
    method: "get",
    params:data
  });
}
// 修改用户名 邮箱
export function namechange(data) {
  return request({
    url: `user/api/users/updateUser`,
    method: "get",
    params: data,
  });
}