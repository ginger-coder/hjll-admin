// 权限路由
import Layout from "@/layout/index.vue";
import emptyLayout from "@/layout/emptyLayout";

let financeRouters = [
    {
        path: "/finance",
        hidden: true,
        component: Layout,
        meta: {title: "财务中心", icon: "isp"},
        redirect: "noRedirect",
        children: [
            {
                path: '/finance/demo',
                name: 'financeTest',
                component: emptyLayout,
                meta: {title: '账户管理'},
                children: [
                    {
                        path: "",
                        component: (resolve) => require(["@/views/finance/demo/list"], resolve),
                        meta: {
                            title: "账户管理",
                            breadcrumb: false,
                            icon: "isp",
                        },
                    },
                    {
                        path: "details/:id",
                        component: (resolve) => require(["@/views/finance/demo/details"], resolve),
                        hidden: true,
                        meta: {
                            title: "账单详情",
                            activeMenu: "/finance/bill/",
                        },
                    }
                ]
            },
            {
                path: "/finance/bill/",
                redirect: '/finance/bill/',
                component: emptyLayout,
                meta: {title: '账单管理'},
                children: [
                    {
                        path: "",
                        component: (resolve) => require(["@/views/finance/bill/list"], resolve),
                        meta: {
                            title: "账单管理",
                            breadcrumb: false,
                            icon: "isp",
                        },
                    },
                    {
                        path: "details/:id",
                        component: (resolve) => require(["@/views/finance/bill/details"], resolve),
                        hidden: true,
                        meta: {
                            title: "账单详情",
                            activeMenu: "/finance/bill/",
                        },
                    }
                ]
            },
            {
                path: "/finance/award/",
                redirect: '/finance/award/',
                component: emptyLayout,
                meta: {title: '奖励管理'},
                children: [
                    {
                        path: "",
                        component: (resolve) => require(["@/views/finance/award/list"], resolve),
                        meta: {
                            title: "奖励管理",
                            breadcrumb: false,
                            icon: "isp",
                        },
                    },
                    {
                        path: "details",
                        component: (resolve) => require(["@/views/finance/award/details"], resolve),
                        hidden: true,
                        meta: {
                            title: "奖励详情",
                            activeMenu: "/finance/award/",
                        },
                    }
                ]
            },
            {
                path: '/finance/invoice',
                name: 'financeTest',
                component: emptyLayout,
                meta: {title: '发票管理'},
                children: [
                    {
                        path: "",
                        component: (resolve) => require(["@/views/finance/demo/list"], resolve),
                        meta: {
                            title: "发票管理",
                            breadcrumb: false,
                            icon: "isp",
                        },
                    },
                    {
                        path: "details/:id",
                        component: (resolve) => require(["@/views/finance/demo/details"], resolve),
                        hidden: true,
                        meta: {
                            title: "账单详情",
                            activeMenu: "/finance/bill/",
                        },
                    }
                ]
            },
            {
                path: "/finance/balance/",
                redirect: '/finance/balance/',
                component: emptyLayout,
                meta: {title: '余额管理'},
                children: [
                    {
                        path: "",
                        component: (resolve) => require(["@/views/finance/balance/list"], resolve),
                        name: 'finance-balance',
                        meta: {
                            title: "余额管理",
                            breadcrumb: false,
                            icon: "isp",
                        },
                    },
                    {
                        path: "details/:id",
                        component: (resolve) => require(["@/views/finance/balance/details"], resolve),
                        hidden: true,
                        meta: {
                            title: "余额详情",
                            activeMenu: "/finance/balance/",
                        },
                    }
                ]
            },
        ]
    }

];

export default financeRouters;

