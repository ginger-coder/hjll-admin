import request from "./request";

// 练习列表
export function getExerciseList(data) {
    return request({
        url: "/itembank/exercise/page",
        method: "get",
        params: data,
    });
}
// 创建练习
export function createExercise(data) {
    return request({
        url: "/itembank/exercise/save",
        method: "post",
        data: data,
    });
}
// 练习详情
export function getExerciseInfo(data) {
    return request({
        url: "/itembank/exercise/detail",
        method: "get",
        params: data,
    });
}

// 更新练习状态
export function exerciseStatusUpdate(data) {
    return request({
        url: "/itembank/exercise/update/status",
        method: "get",
        params: data,
    });
}
// 更新练习编辑
export function exerciseUpdate(data) {
    return request({
        url: "/itembank/exercise/update",
        method: "post",
        data: data,
    });
}
// 删除练习
export function exerciseDelete(data) {
    return request({
        url: "/itembank/exercise/" + data,
        method: "delete",
    });
}
// 练习分析
export function exerciseAnalysis(params) {
    return request({
        url: "/itembank/exercise/exerciseAnalysis",
        method: "get",
        params,
    });
}
// 练习分析，未参加
export function noAnsweredPerson(params) {
    return request({
        url: "/itembank/exercise/noAnsweredPerson/page",
        method: "get",
        params,
    });
}
// 练习分析，已参加
export function answeredPerson(params) {
    return request({
        url: "/itembank/exercise/answeredPerson/page",
        method: "get",
        params,
    });
}
