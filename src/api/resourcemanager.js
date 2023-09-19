import request from './request'
export function addstation() {
    return request({
      url: "/basestation/tSite/save",
      method: "post",
      data: {
        name: "demoData",
        province: "demoData",
        city: "demoData",
        county: "demoData",
        companyId: 0,
        resourceCode: "demoData",
        physicsSiteCode: "demoData",
        siteType: 0,
        secondSiteType: 0,
        address: "demoData",
        lng: "demoData",
        lat: "demoData",
        firstPowerWay: 0,
        secondPowerWay: 0,
        backUpPower: 0,
        isPower: 0,
        area: "demoData",
        operator: "demoData",
        nightService: 0,
        powerGenerationWait: 0,
        voltageLines: 0,
        basicElectricity: 0,
        oil: 0,
        additionalType: 0,
        actualElectricity: 0,
        isNightSite: 0,
        fsuBuild: 0,
        isInstallDevice: 0,
        rruNum: 0,
        nightExemption: "demoData",
        oilChargeType: 0,
        disclaimer: 0,
        securityLevel: 0,
        transCode: "demoData",
        upperStation: 0,

        hotAsk: 0,
      },
    });
}
// export function intostation(data) {
//   return request({
//     url: "/basestation/tSite/importSiteInfo",
//     method:'post',
//     data
//   });
// }
export function stamonitor(data) {
  return request({
    url: "user/monitoring/stationMonitoring",
    method:"get",
    params:data
  });
}
export function stamonitorUser(data) {
  return request({
    url: "user/monitoring/userMonitoring",
    method: "get",
    params: data,
  });
}
export function stamonitorOrder(data) {
  return request({
    url: "user/monitoring/orderMonitoring",
    method: "get",
    params: data,
  });
}
export function workOrderPage(data) {
  return request({
    url: "user/work-order/historicalWorkOrder",
    method: "get",
    params: data,
  });
}
