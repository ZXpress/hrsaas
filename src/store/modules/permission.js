// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router' // 静态路由

const state = {
    // 一开始就拥有静态路由权限
    routes: [] // 表示当前用户所拥有的的所有路由数组
}
const mutations = {
    // 定义修改routes
    // payload就是登陆成功需要添加的新路由
    setRoutes(state, newRoutes) {
        state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上添加新的路由
    }
}
const actions = {
    // 筛选权限路由
    // 第二个参数为当前用户的所拥有的的菜单权限
    // asyncRoutes所有的动态路由数组，里面是一个个对象
    filterRoutes(context, menus) {
        const routes = []
        // 筛选出动态路由中和menus中能够对应上的路由
        menus.forEach(key => {
            routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
        })
        // 得到的routes就是用户所拥有的的动态路由权限
        context.commit('setRoutes', routes) // 提交给mutations更改state
        return routes // return是给路由addRoutes用的
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}