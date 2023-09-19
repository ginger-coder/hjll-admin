import request from "./request";

// 课件列表
export function getCoursewareList(data) {
    return request({
        url: "/itembank/courseware/page",
        method: "get",
        params: data,
    });
}
// 创建课件
export function createCourseBook(data) {
    return request({
        url: "/itembank/courseware/save",
        method: "post",
        data: data,
    });
}
// 课件详情
export function getBookInfo(data) {
    return request({
        url: "/itembank/courseware/detail",
        method: "get",
        params: data,
    });
}
// 课件使用记录
export function getBookHistory(data) {
    return request({
        url: "/itembank/courseware/usageRecordPage",
        method: "get",
        params: data,
    });
}
// 删除课件校验
export function delCoursewareCheck(data) {
    return request({
        url: "/itembank/courseware/check",
        method: "get",
        params: data,
    });
}
// 更新课件
export function coursewareUpdate(data) {
    return request({
        url: "/itembank/courseware/update",
        method: "post",
        data: data,
    });
}
// 删除课件
export function coursewareDelete(data) {
    return request({
        url: "/itembank/courseware/" + data,
        method: "delete",
    });
}
