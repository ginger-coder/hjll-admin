import request from "./request";

export function getProjectList(params) {
    return request({
        url: "/user/group/projectPages",
        method: "get",
        params,
    });
}

export function getProjectInfo(id) {
    return request({
        url: `/user/group/project/detail/${id}`,
        method: "get",
        params: {
            id
        }
    });
}

export function updateProject(data) {
    return request({
        url: `/user/group/createOrUpdate`,
        method: "post",
        data
    });
}

export function deleteProject(id) {
    return request({
        url: `/user/group/delete/project/${id}`,
        method: "delete",
    });
}

export function getGroupList(params) {
    return request({
        url: "/user/group/groupPages",
        method: "get",
        params,
    });
}

export function createGroup(data) {
    return request({
        url: `/user/group/createGroup`,
        method: "post",
        data
    });
}

export function getAllProjectList() {
    return request({
        url: `/user/group/project/list`,
        method: "get",
    });
}

export function getGroupInfo(id) {
    return request({
        url: `/user/group/work/detail/${id}`,
        method: "get",
        params: {
            id
        }
    });
}
export function deleteGroup(id) {
    return request({
        url: `/user/group/delete/group/${id}`,
        method: "delete",
    });
}
export function getHeaderUserList() {
    return request({
        url: `/admin/users/list`,
        method: "get",
    });
}
