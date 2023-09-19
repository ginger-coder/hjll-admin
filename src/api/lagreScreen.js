import request from "./request";
import qs from 'qs'
export function resourceOverview(data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/resourceOverview",
        method: "post",
        data,
    });
}

export function analyzeFsu(data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/analyzeFsu",
        method: "post",
        data,
    });
}

export function analyzeSkillTypeRatioInCodeList(data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/analyzeSkillTypeRatioInCodeList",
        method: "post",
        data,
    });
}

export function analyzeWorkOrderTrend(target,data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/analyzeWorkOrderTrend/"+target,
        method: "post",

        data,
    });
}

export function nationalHot(last,data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/nationalHot/"+last,
        method: "post",
        data,
    });
}

export function queryRecentlyWorkOrder(last,data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/queryRecentlyWorkOrder/"+last,
        method: "post",
        data,
    });
}

export function realActiveAlarm(last,data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/realActiveAlarm/"+last,
        method: "post",
        data,
    });
}

export function analyzeAlertLevelRatio(last,data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/analyzeAlertLevelRatio/"+last,
        method: "post",
        data,
    });
}

export function analyzeStationTypeRatioInCodeList(data) {
    data=qs.stringify(data)
    return request({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/admin/lagreScreen/analyzeStationTypeRatioInCodeList",
        method: "post",
        data,
    });
}
// 基站监控
export function getStationMonitoring(params) {
    return request({
        url: "/admin/monitoring/platform/stationMonitoring",
        method: "get",
        params,
    });
}
// 工单监控
export function getOrderMonitoring(params) {
    return request({
        url: "/admin/monitoring/platform/oderMonitoring",
        method: "get",
        params,
    });
}
// 人员监控
export function getMemberMonitoring(params) {
    return request({
        url: "/admin/monitoring/platform/memberMonitoring",
        method: "get",
        params,
    });
}
