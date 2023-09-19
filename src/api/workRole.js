import request from './request'

// handle
function workRoleManager(opt, data, post) {
    opt.method = opt.method || 'get'
    let json
    if (opt.method === 'get') {
        json = {
            url: `/user/work-role/${opt.name}`, method: 'get', params: data
        }
    } else {
        json = {
            url: `/user/work-role/${opt.name}`, method: opt.method, params: data, data: post
        }
    }
    return request(json)
}

const page = (opt, data, post) => {
    return workRoleManager({name: "page"}, data, post);
};

const update = async (post) => {
    const {code} = await workRoleManager({name: "update", method: 'post'}, {}, post);
    return code;
};

const detail = (data) => {
    return workRoleManager({name: "detail"}, data, {});
};

export {page, update, detail,workRoleManager}
