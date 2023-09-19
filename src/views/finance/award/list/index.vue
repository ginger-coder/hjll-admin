


































import moment from "moment";

export const globalFormat = "yyyy-MM-dd HH:mm:ss"


export function dataMaps(data = []) {
    return data.reduce((pre, cur) => {
        pre[`${cur.value}`] = cur.label
        return pre;
    }, {})
}


export const moneyType = [
    {label: '收入', value: 1},
    {label: '支出', value: 2},
]
/**
 * 审核状态
 * */
export const cashOutStatus = [
    {label: '待审核', value: 0, type: 'info'},
    {label: '通过', value: 1, type: 'success'},
    {label: '拒绝', value: 2, type: 'danger'},
]

/**
 * 提现方类型
 * */
export const personnelType = [
    {label: '平台人员', value: '平台人员'},
    {label: '运维人员', value: '运维人员'},
    {label: '运营人员', value: '运营人员'},
]

export function filterTime(date, format = 'yyyy-MM-DD HH:mm:ss', text = '-') {
    if (!date) return text

    console.log(date, 'date');
    return moment(date).format(format) || text;
}

export function moneyText(Money = 0, unit = '￥') {
    if (!Money && Money !== 0) return '-'
    return `${unit}${Money}`;
}

/**
 * 默认禁用当天之后
 * */
export const pickerOptions = {
    disabledDate(time) {
        return time.getTime() > Date.now();
    },
}