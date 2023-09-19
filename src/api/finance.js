import request from "./request";
import qs from 'qs'
// 账单管理列表
export function getBillData(data) {
  return request({
    url: "/user/billing-details/page",
    method: "GET",
    params: data,
  });
}
// 账单列表详情
export function getDetail(data) {
  return request({
    url: "/user/billing-details/detail",
    method: "GET",
    params: data,
  });
}
// 提现列表
export function cashList(data) {
  return request({
    url: "/user/cash-out/page",
    method: "GET",
    params: data,
  });
}
// 提现详情
export function cashDetail(data) {
  return request({
    url: "/user/cash-out/detail",
    method: "GET",
    params: data,
  });
}
// 审核-驳回，线下发放
export function cashStatus(data) {
  return request({
    url: "/user/cash-out/update/cash/status",
    method: "POST",
    data
  });
}
// 账户余额
export function getWalletList(data) {
  return request({
    url: "/admin/platform/wallet/getWalletList",
    method: "GET",
    params:data
  });
}
// 充值申请
export function rechargeApply(data) {
  return request({
    url: "/admin/platform/wallet/rechargeApply",
    method: "POST",
    data
  });
}
// 充值记录
export function PlatformBillRecord(data) {
  return request({
    url: "/admin/PlatformBillRecord/getRechargeRecord",
    method: "GET",
    params:data
  });
}
// 开票申请
export function invoiceApplyFor(data) {
  return request({
    url: "/admin/invoiceIssueRecord/invoiceApplyFor",
    method: "POST",
    data
  });
}
// 开票记录
export function invoiceIssueRecord(data) {
  return request({
    url: "/admin/invoiceIssueRecord/getRechargeRecord",
    method: "GET",
    params:data
  });
}
// 发票详情
export function getInvoiceDetail(data) {
  return request({
    url: "/admin/invoiceIssueRecord/detail",
    method: "GET",
    params:data
  });
}
// 每日对账列表
export function getDayReconciliation(data) {
  return request({
    url: "/admin/WalletReconciliation/getDayReconciliation",
    method: "GET",
    params:data
  });
}
// 提现分页列表
export function getWithDraw(data) {
  return request({
    url: "/admin/PlatformBillRecord/getWithDraw",
    method: "GET",
    params:data
  });
}
// 流水账单分页列表
export function getPlatformBill(data) {
  return request({
    url: "/admin/PlatformBillRecord/getPlatformBill",
    method: "GET",
    params:data
  });
}
//开票信息查询接口
export function getCompanyInfo(data) {
  return request({
    url: "/admin/invoiceIssueRecord/getCompanyInfo",
    method: "GET",
    params:data
  });
}
//钱包下拉框
export function getwallets(data) {
  return request({
    url: "/admin/platform/wallet/wallets",
    method: "GET",
    params:data
  });
}

// 用户结算列表
export function getSettlement(data) {
  return request({
    url: "/admin/userSettlementExamine/queryUserSettlementPager",
    method: "GET",
    params:data
  });
}
// 详情发起结算 
export function queryInitiateSettlementDetail(data) {
  return request({
    url: "/admin/userSettlementExamine/queryInitiateSettlementDetail",
    method: "GET",
    params:data
  });
}
// 直接发起结算 
export function postInitiateSettlement(data) {
  return request({
    url: "/admin/userSettlement/initiateSettlement",
    method: "POST",
    data
  });
}
// 分页查询已结算-结算待审批 用户列表(详情)
export function querySettlementUserPager(data) {
  return request({
    url: "/admin/userSettlementExamine/querySettlementUserPager",
    method: "GET",
    params:data
  });
}
// 结算审核
export function postSettlementExamine(data) {
  return request({
    url: "/admin/userSettlementExamine/settlementExamine",
    method: "POST",
    data
  });
}
// 单用户结算审核驳回
export function updateSettlementDetail(data) {
  return request({
    url: "/admin/userSettlementExamine/updateSettlementDetail",
    method: "GET",
    params:data
  });
}
//分页查询单用户待结算工单列表 
export function querySingleUserWorkers(data) {
  return request({
    url: "/admin/userSettlement/querySingleUserWorkers",
    method: "GET",
    params:data
  });
}
//查询待结算用户列表
export function queryTreatSettlementUserList(data) {
  return request({
    url: "/admin/userSettlement/queryTreatSettlementUserList",
    method: "GET",
    params:data
  });
}
//查询用户所属项目、组列表
export function queryUmsProjectGroupList(data) {
  return request({
    url: "/admin/userSettlement/queryUmsProjectGroupList",
    method: "GET",
    params:data
  });
}
// 分页查询待结算用户列表
export function queryUnSettledUserPager(data) {
  return request({
    url: "/admin/userSettlement/queryUnSettledUserPager",
    method: "GET",
    params:data
  });
}
// 分页查询用户结算列表
export function queryUserSettlementPager(data) {
  return request({
    url: "/admin/userSettlement/queryUserSettlementPager",
    method: "GET",
    params:data
  });
}
// 查询审核人员列表
export function queryUsersByRole(data) {
  return request({
    url: "/admin/userSettlement/queryUsersByGroupId",
    method: "GET",
    params:data
  });
}
// 查询钱包可用余额 
export function queryWalletBalance(data) {
  return request({
    url: "/admin/userSettlement/queryWalletBalance",
    method: "GET",
    params:data
  });
}
//单用户删除
export function singleUserDel(data) {
  return request({
    url: "/admin/userSettlement/singleUserDel",
    method: "GET",
    params:data
  });
}
//用户选中确定操作
export function userCheckedDetermine(data) {
  return request({
    url: "/admin/userSettlement/userCheckedDetermine",
    method: "POST",
    data
    // paramsSerializer: params => {
    //   return qs.stringify(params, { indices: false })
    // },
  });
}




