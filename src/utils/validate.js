
export function isHttp(path) {
  return /^(https?:)/.test(path)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 身份证正则
export function validIdCard(str) {
  return /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dX]$/.test(str)
}

// 身份证简单正则
export function validIdCard2(str) {
  return /^\d{17}(\d{1}|[X])$/.test(str)
}

// 手机号正则
export function validMobile(str) {
    return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(str)
}

// 邮箱正则
export function validEmail(str) {
  return /^\w+@[a-zA-Z0-9]+((\.[a-z0-9A-Z]{1,})+)$/.test(str)
}

// 密码正则 8-16位数字字母
export function validPass(str) {
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(str)
}
var reg=/[a-z]{4}|[0-9]{4}|\_{4}|\*{4}/gi;
// 2-4位英文大写字母
export function validNum(str) {
  return /[A-Z]{2,4}/.test(str)
}