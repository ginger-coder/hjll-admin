import request from './request'

// handle
function workSkillManager(opt, data, post) {
    opt.method = opt.method || 'get'
    let json
    if (opt.method === 'get') {
        json = {
            url: `/user/work-skill/${opt.name}`,
            method: 'get',
            params: data
        }
    } else {
        json = {
            url: `/user/work-skill/${opt.name}`,
            method: opt.method,
            params: data,
            data: post
        }
    }
    return request(json)
}

const page = (opt, data, post) => {
    return workSkillManager({name: "page"}, data, post);
};


const update = async (post) => {
    const {code} = await workSkillManager({name: "update", method: 'post'}, {}, post);
    return code;
};


export {page, update}
