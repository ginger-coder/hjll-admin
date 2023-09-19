import request from "./request";

// 用户
export function users(opt, data, post) {
	opt.method = opt.method || "get";
	if (data && data.pages) {
		opt.name='pages'
		delete data.pages
	}
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/users/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else if(opt.method=='patch'){
		json = {
			url: `/admin/users/${data.userId}/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	} else if(opt.method=='delete'){
		json = {
			url: `/admin/users/${data.userId}`,
			method: opt.method,
		};
	} else if(opt.method=='leaveOffice'){
		json = {
			url: `/admin/users/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else if(opt.method=='updateStatus'){
		json = {
			url: `/admin/users/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else if(opt.method=='updateDept'){
		json = {
			url: `/admin/users/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	}else if(opt.name == 'create'){
		json = {
			url: `/admin/users`,
			method: opt.method,
			data: post,
		}
	}else if(opt.name == 'update'){
		json = {
			url: `/admin/users/${post.id}`,
			method: 'put',
			data: post,
		}
	}else if(opt.name == '_import'){

		json = {
			url: `/admin/users/_import`,
			method: 'post',
			data: post,
			headers:{
				'Content-Type':'multipart/form-data',
			},
		}
		console.log(json);

	}else if(opt.name == '_export'){
		json = {
			url: `/admin/users/_export?current=&size=&keywords=&status=&deptId=`,
			method: 'get',
			params: data,
			data: post,
		}
		console.log(json);

	}else {
		json = {
			url: `/admin/users/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}
export function usersInfo(opt, data, post) {
	let json = {};
	json = {
		url: `/admin/users/${data.userId}/form`,
		method: "get",
	};
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}
// 获取登录用户信息
export function usersMeAdmin(opt, data, post) {
	let json = {};
	json = {
		url: `/admin/users/me`,
		params:data,
		method: "get",
	};
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}
export function getUserPage(data) {
	let json={
		userTypeCode:'user_type',
		...data
	}
    return request({
        url: "/admin/users/pages",
        method: "get",
        params: json,
    });
}
