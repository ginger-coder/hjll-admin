const _package = require('../package.json')

let keys = [];
let name = _package.name || '';
if (name) keys.push(name)
let node = '';
switch (process.env.NODE_ENV) {
    case 'development':
        node = 'dev'
        break;
    case 'production':
        node = 'prod'
        break;
        case 'test':
        node = 'test'
        break;
}
if (node) keys.push(node)
let proxy = process.env.proxy || '';
if (proxy) keys.push(proxy)


module.exports = {
    title: '海久六灵数字维护共享平台',
    layout: 'vertical', //布局
    sTheme: 'LH', //主题
    serverMock: false, //固定 Header
    allowRegister: true, //固定 Header
    fixedHeader: true, //固定 Header
    sidebarLogo: true, // 导航栏显示logo
    loginWhite: false, // 登录 页面风格是否使用左侧图右侧白色
    prefix: keys.join('_'), //定义变量前缀
    tagsView: true, //开启 Tags-View
}
