import request from './request';

export function getCourseList(data) {
	return request({
		url: '/itembank/course/page',
		method: 'get',
		params: data,
	});
}
export function onCourseCreate(data) {
	return request({
		url: '/itembank/course/save',
		method: 'post',
		data: data,
	});
}
export function onCourseUpdate(data) {
	return request({
		url: '/itembank/course/update',
		method: 'post',
		data: data,
	});
}
export function onCourseUpdatePart(data) {
	return request({
		url: '/itembank/course/updatePart',
		method: 'post',
		data: data,
	});
}
// 技能下拉菜单列表
export function userWorkSkillList(data) {
	return request({
		url: '/user/work-skill/page',
		method: 'post',
		data: data,
	});
}
export function getCourseInfo(data) {
	return request({
		url: '/itembank/course/detail',
		method: 'get',
		params: data,
	});
}
export function courseUpdateStatus(data) {
	return request({
		url: '/itembank/course/updateStatus',
		method: 'get',
		params: data,
	});
}
export function courseCheck(data) {
	return request({
		url: '/itembank/course/check?',
		method: 'get',
		params: data,
	});
}
// 删除课程
export function courseDelete(data) {
    return request({
        url: "/itembank/course/" + data,
        method: "delete",
    });
}
