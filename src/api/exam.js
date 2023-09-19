import request from "./request";

// 考试列表
export function getExamPageList(data) {
    return request({
        url: "/itembank/exam/page",
        method: "get",
        params: data,
    });
}

// 结束考试
export function examUpdateStatus(data) {
    return request({
        url: "/itembank/exam/update/status",
        method: "get",
        params: data,
    });
}

// 考试人员list
export function examPeopleList(data) {
    return request({
        url: "/itembank/exam/crowd",
        method: "get",
        params: data,
    });
}

export function examPeopleListV2(data) {
    return request({
        url: "/itembank/exam/crowd2",
        method: "post",
        data,
    });
}


// 考试列表删除
export function examDelete(data) {
    return request({
        url: "/itembank/exam/" + data,
        method: "delete",
    });
}

// 考试保存
export function examSave(data) {
    return request({
        url: "/itembank/exam/save",
        method: "post",
        data
    });
}
// 考试详情
export function getExamDetail(data) {
    return request({
        url: "/itembank/exam/detail",
        method: "get",
        params: data
    });
}

// 结束考试校验
export function examEndCheck(data) {
    return request({
        url: "/itembank/exam/check",
        method: "get",
        params: data
    });
}

// 考试详情更新
export function examUpdate(data) {
    return request({
        url: "/itembank/exam/update",
        method: "post",
        data
    });
}
