import request from "./request";
import qs from 'qs'
// 机房模块
// 机房列表
export function getRoomData(data) {
  return request({
    url: "/resource/room/pages",
    method: "GET",
    params: data,
  });
}
// 机房详情
export function getRoomDetail(data) {
  return request({
    url: "/resource/room/detail/"+data,
    method: "GET",
  });
}
// 删除机房
export function deleteRoom(data) {
  return request({
    url: "/resource/room/delete/"+data,
    method: "GET",
  });
}
// 新增机房
export function changeRoom(data) {
  return request({
    url: "/resource/room/createOrUpdate",
    method: "POST",
    data
  });
}
// 修改机房
export function getUpRoom(data) {
  return request({
    url: "/resource/room/edit/detail/"+data,
    method: "GET",
  });
}
// 设备模块
// 设备列表
export function getDeviceData(data) {
  return request({
    url: "/resource/device/pages",
    method: "GET",
    params: data,
  });
}
// 设备详情
export function getDeviceDetail(data) {
  return request({
    url: "/resource/device/detail/"+data,
    method: "GET",
  });
}
// 删除设备
export function deleteDevice(data) {
  return request({
    url: "/resource/device/delete/"+data,
    method: "GET",
  });
}
// 新增设备
export function changeDevice(data) {
  return request({
    url: "/resource/device/createOrUpdate",
    method: "POST",
    data
  });
}
// 修改设备
export function getUpDevice(data) {
  return request({
    url: "/resource/device/edit/detail/"+data,
    method: "GET",
  });
}
// 铁塔模块
// 铁塔列表
export function getTowerData(data) {
  return request({
    url: "/resource/tower/pages",
    method: "GET",
    params: data,
  });
}
// 铁塔详情
export function getTowerDetail(data) {
  return request({
    url: "/resource/tower/detail/"+data,
    method: "GET",
  });
}
// 删除铁塔
export function deleteTower(data) {
  return request({
    url: "/resource/tower/delete/"+data,
    method: "GET",
  });
}
// 新增铁塔
export function changeTower(data) {
  return request({
    url: "/resource/tower/createOrUpdate",
    method: "POST",
    data
  });
}
// 修改铁塔
export function getUpTower(data) {
  return request({
    url: "/resource/tower/edit/detail/"+data,
    method: "GET",
  });
}
// 基站模块
// 基站列表
export function getStationData(data) {
  return request({
    url: "/resource/station/pages",
    method: "GET",
    params: data,
  });
}
// 基站详情用id查询
export function getStationDetail(data) {
  return request({
    url: "/resource/station/detail/"+data,
    method: "GET",
  });
}
// 基站详情用code查询
export function getStationDetailCode(data) {
  return request({
    url: "/resource/station/detail/code/"+data,
    method: "GET",
  });
}
// 删除基站
export function deleteStation(data) {
  return request({
    url: "/resource/station/delete/"+data,
    method: "GET",
  });
}
// 新增基站
export function changeStation(data) {
  return request({
    url: "/resource/station/createOrUpdate",
    method: "POST",
    data
  });
}
// 修改基站
export function getUpStation(data) {
  return request({
    url: "/resource/station/edit/detail/"+data,
    method: "GET",
  });
}
//绑定机房，铁塔，设备
export function bindStation(data) {
  return request({
    url: "/resource/station/bind",
    method: "POST",
    data
  });
}

export function getRegionList(data) {
  return request({
    url: "/resource/station/area/list",
    method: "GET",
    params: data,
  });
}
// 树结构
export function getTree(data) {
  return request({
    url: "/resource/station/area/list",
    method: "GET",
    data,
  });
}


