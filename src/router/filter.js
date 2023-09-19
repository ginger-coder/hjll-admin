import { deepClone } from '@/utils'
import _routes from './routes'
import path from 'path'

// 获取所有路由中的key
export function getRoutesAllKeys () {
    const arr=[]

    let funPn;

    funPn=(children) => {
        for (let i=0;i<children.length;i++){
            let item=children[i]
            if(item.nodeKey) arr.push(item.nodeKey)
            if(item.children && item.children.length>0) {
                funPn(item.children)
            }
        }
    }

    funPn(_routes)

    return arr
}

// 获取选中完整路由
export function generateTree (routes, basePath = '/', checkedKeys) {
    const res = []

    for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        const routeNodekey = route.nodeKey

        // console.log('route',route)
        if (route.children) {
            route.children = generateTree(route.children, routePath, checkedKeys)
        }

        // console.log('checkedKeys.includes(routeNodekey)',routeNodekey,checkedKeys.includes(routeNodekey))
        if (checkedKeys.includes(routeNodekey) || (route.children && route.children.length >= 1)) {
            res.push(route)
        }

    }
    return res
}