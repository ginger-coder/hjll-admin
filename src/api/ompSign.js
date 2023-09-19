import request from './request'

// handle
export function signManager(opt, data, post) {
    opt.method = opt.method || 'get'
    let json
    if (opt.method === 'get') {
        json = {
            url: `/user/sign-info/${opt.name}`, method: 'get', params: data
        }
    } else {
        json = {
            url: `/user/sign-info/${opt.name}`, method: opt.method, params: data, data: post
        }
    }
    return request(json)
}

const page = (opt, data, post) => {
    return signManager({name: "page"}, data, post);
};

const create = async (post) => {
    const {code} = await signManager({name: "save", method: 'post'}, {}, post);
    return code;
};
const saveSign = async (post) => {
    const {code} = await signManager({name: "saveSign", method: 'post'}, {}, post);
    return code;
};

const update = async (post) => {
    const {code} = await signManager({name: "update", method: 'post'}, {}, post);
    return code;
};

const info = async (post) => {
    const {data: detail} = await signManager({name: "detail", method: 'post'}, {}, post);
    return detail;
};

const getUmsInfo = async (post) => {
    const {data: detail} = await signManager({name: "getUmsInfo", method: 'post'}, {}, post);
    return detail;
};

export function aggress(data) {
    return request({
      url: `/user/ums-member/updateById`,
      method: "get",
      params:data,
    });
  }
export {page, info, create, update, getUmsInfo, saveSign}
