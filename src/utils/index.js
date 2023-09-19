import {BASE_API, BASE_URL} from "@/config";

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null;
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string") {
            if (/^[0-9]+$/.test(time)) {
                time = parseInt(time);
            } else {
                // support safari
                time = time.replace(new RegExp(/-/gm), "/");
            }
        }

        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
    });
    return time_str;
}
export function parseTime2(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null;
    }
    const format = cFormat || "{y}-{m}-{d}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string") {
            if (/^[0-9]+$/.test(time)) {
                time = parseInt(time);
            } else {
                // support safari
                time = time.replace(new RegExp(/-/gm), "/");
            }
        }

        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
    });
    return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (("" + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分";
    }
}

// 获取当前时间区间
export function getTimeState() {
    // 获取当前时间
    let timeNow = new Date();
    // 获取当前小时
    let hour = timeNow.getHours();
    // 设置默认文字
    let text = ``;
    // 判断当前时间段
    if (hour < 6) {
        text = "凌晨好";
    } else if (hour < 9) {
        text = "早上好";
    } else if (hour < 12) {
        text = "上午好";
    } else if (hour < 14) {
        text = "中午好";
    } else if (hour < 17) {
        text = "下午好";
    } else if (hour < 19) {
        text = "傍晚好";
    } else if (hour < 22) {
        text = "晚上好";
    }
    // 返回当前时间段对应的状态
    return text;
}

export function dateFormat(fmt, date) {
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
        ;
    }
    ;
    return fmt;
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
    if (!search) {
        return {};
    }
    const obj = {};
    const searchArr = search.split("&");
    searchArr.forEach((v) => {
        const index = v.indexOf("=");
        if (index !== -1) {
            const name = v.substring(0, index);
            const val = v.substring(index + 1, v.length);
            obj[name] = val;
        }
    });
    return obj;
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments", "deepClone");
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

// 转unicode
export function encodeUnicode(str) {
    str = "" + str;
    var res = [];
    for (var i = 0; i < str.length; i++) {
        res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return res.join("");
}

// 解码
export function decodeUnicode(str) {
    var re = new RegExp("(.{4})", "g");
    var ma = str.match(re);
    var str1 = "\\u" + ma.join("\\u");
    str = str1.replace(/\\/g, "%");
    return unescape(str);
}

// 下载
export function fileDownload(url, filename) {
    if (!url) return;

    var arry_url = url.split("/"),
        arry_url_length = arry_url.length;
    var a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = filename || arry_url[arry_url_length - 1];
    document.body.appendChild(a);
    a.click();
}

//价格格式化
export function amount_format(val) {
    val = String(val);
    val = val.replace(/,/g, "");
    let num = val * 1 || 0;

    num.toFixed(3);
    num = num * 1;
    num = num.toFixed(2);

    let s = num.split(".");
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + "," + "$2");
    }
    num = s[0] + "." + s[1];

    return num;
}

// 价格输入(正的)
export function priceInput(value) {
    value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
    if (value.indexOf(".") < 0 && value != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        value = parseFloat(value);
    }

    return value;
}

// 价格输入(正负)
export function priceInputLoss(values) {
    let newValue;
    values = values.toString();
    if (!/[^0-9.-]/g.test(values)) {
        newValue = values
            .replace(/[^\-\d.]/g, "")
            .replace(/\-{2,}/g, "-")
            .replace(/\-{2,}/g, "-")
            .replace(/^\./g, "")
            .replace(/\.{2,}/g, ".")
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
        if (newValue.toString().indexOf(".") > 0 && Number(newValue.toString().split(".")[1].length) > 2) {
            newValue = parseInt(parseFloat(newValue) * 100) / 100;
        }
        if (newValue.toString().split("-").length - 1 > 1) {
            newValue = parseFloat(newValue) || "";
        }
        if (newValue.toString().split("-").length > 1 && newValue.toString().split("-")[0].length > 0) {
            newValue = parseFloat(newValue) || "";
        }
        if (newValue.toString().length > 1 && (newValue.toString().charAt(0) === "0" || (newValue.toString().length > 2 && newValue.toString().charAt(0) === "-" && newValue.toString().charAt(1) === "0" && newValue.toString().charAt(2) !== ".")) && newValue.toString().indexOf(".") < 1) {
            newValue = parseFloat(newValue) || "";
        }
        // 判断整数位最多为9位
        // if (newValue.toString().indexOf('.') > 0 && Number(newValue.toString().split('.')[0].length) > 9) {
        //     newValue = `${newValue.toString().substring(0, 9)}.${newValue.toString().split('.')[1]}`;
        // } else if (newValue.toString().indexOf('.') < 0 && Number(newValue.toString().split('.')[0].length) > 9) {
        //     newValue = newValue.toString().substring(0, 9);
        // }
    } else {
        newValue = values.replace(/[^0-9.-]/g, "");
    }
    return newValue;
}

// baseUrl
export function baseUrl(value) {
    value = BASE_URL + value;
    return value;
}

//手机号隐私 138****1212
export function mobile_hide(value) {
    value = value.substr(0, 3) + "****" + value.substr(7);
    return value;
}

//身份证号号隐私 350103********2222
export function idcard_hide(value) {
    value = value.substr(0, 6) + "********" + value.substr(14);
    return value;
}

// 输入:汉字、数字
export function hanziNumInput(value) {
    value = value.replace(/[^\d\u4E00-\u9FA5]/g, "");

    return value;
}

// 输入:数字、字母
export function numAzInput(value) {
    value = value.replace(/[^\da-zA-Z]/g, "");

    return value;
}

// 输入:汉字
export function hanziInput(value) {
    value = value.replace(/[^\u4E00-\u9FA5]/g, "");

    return value;
}

// 输入:数字
export function numInput(value) {
    value = value.replace(/[^\d]/g, "");

    return value;
}

// 输入:字母
export function azInput(value) {
    value = value.replace(/[^\a-zA-Z]/g, "");

    return value;
}

// a标签下载
export function ADownFIle(href, fileName) {
    const link = document.createElement('a')// 定义一个a标签
    link.href = href;
    link.download = fileName// 下载后的文件名称
    // console.log('fileName', link)
    link.click() // 模拟在按钮上实现一次鼠标点击
    window.URL.revokeObjectURL(link.href) // 释放 URL 对象
}

// 二进制文件
export function downLoadFile(res, name) {
    const blob = new Blob([res], {
        type: 'application/vnd.ms-excel'
    })
    const fileName = name + '.xlsx' // 文件名+后缀
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        // IE
        window.navigator.msSaveOrOpenBlob(res, `${name}.xlsx`)
    } else {
        // 允许用户在客户端上保存文件
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
        } else {
            // 需要生成一个 URL 来实现下载，链接到blob上
            ADownFIle(window.URL.createObjectURL(blob), fileName)
        }
    }
}

/**
 * 字符串脱敏 默认展示前4和后4
 * @param {string} str
 * @param {number} start
 * @param {number} end -4是后4位
 * */
export function desensitization(str, start = 4, end = -4) {
    const len = str?.length;
    if (!len) return str;
    return str.substr(0, start) + str.substring(start, len - Math.abs(end)).replace(/[\s\S]/ig, '*') + str.substr(end);
}

/**
 * 将数字转换为中文的金额
 * @method cnMoneyFormat
 * @param {Number} money 数字
 */
export function cnMoneyFormat(money) {
    var cnMoney = "零元整";
    var strOutput = "";
    var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    money += "00";
    var intPos = money.indexOf('.');
    if (intPos >= 0) {
       money = money.substring(0, intPos) + money.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - money.length);
    for (var i = 0; i < money.length; i++) {
       strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(money.substr(i, 1), 1) + strUnit.substr(i, 1);
    }
    cnMoney = strOutput.replace(/零角零分$/, '').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    return cnMoney;
 }

