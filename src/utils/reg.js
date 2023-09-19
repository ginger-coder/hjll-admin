export const password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,16}$/;
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
export const phone = /^1[3456789]\d{9}$/; // /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
export const idCard = /^[1-9]\d{5}(19|20)\d{2}(0\d|1[012])(0\d|[12]\d|3[01])\d{3}[\dX]$/;
export const url = /^((https?|ftp):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const integer = /^-?\d+$/; // 匹配整数
export const float = /^-?\d+$/; // 匹配浮点数
export const htmlTag = /<\/?[\w\s="/.':;#-\/?]+>/gi; // 匹配 HTML 标签
export const ip = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)){3}$/
export default {
    email,
    phone,
    idCard,
    url,
    integer,
    float,
    htmlTag,
    ip
}
