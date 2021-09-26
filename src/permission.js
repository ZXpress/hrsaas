// 权限拦截在路由跳转  导航守卫

import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单

// 前置守卫
// next是必须执行的钩子
// next()放过
// next(false)跳转终止
// next(地址)跳转到某个地址
router.beforeEach(async (to, from, next) => {
    nprogress.start() // 开启进度条
    if (store.getters.token) {
        // 如果有token
        if (to.path === '/login') {
            // 如果访问的是登录页
            next('/') // 跳到主页
        } else {
            // 只有放过通行的时候获取用户资料
            // 如果vuex中有用户的id表示已经有资料不要获取
            if (!store.getters.userId) {
                // 如果没有才需要获取
                const { roles } = await store.dispatch('user/getUserInfo') // 异步操作 需要await改为同步
                // 筛选用户的可用权限路由
                // routes就是筛选得到的动态路由
                const routes = await store.dispatch('permission/filterRoutes', roles.menus)
                // console.log(routes);
                // 把动态路由添加到路由表中
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
                // 添加完动态路由之后
                next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
                // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
            } else {
                next()
            }
        }
    } else {
        // 如果没有token
        if (whiteList.indexOf(to.path) > -1) {
            // 表示要去的地址在白名单
            next()
        } else {
            next('/login')
        }
    }
    nprogress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(() => {
    nprogress.done() // 关闭进度条
})
