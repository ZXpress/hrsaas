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
router.beforeEach((to, from, next) => {
    nprogress.start() // 开启进度条
    if (store.getters.token) {
        // 如果有token
        if (to.path === '/login') {
            // 如果访问的是登录页
            next('/') // 跳到主页
        } else {
            next()
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
