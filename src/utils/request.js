// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600 // 定义超时时间

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
}) // 创建一个axios的实例

// 请求拦截器
service.interceptors.request.use(config => {
    // config 请求的配置信息
    if (store.getters.token) {
        // 有token时检查时间戳是否超时
        if (IsCheckTimeOut()) {
            // 超时过期了
            // 删除token
            store.dispatch('user/logout') // 登出操作
            // 跳转登录页
            router.push('/login')
            return Promise.reject(new Error('token超时了'))
        }
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须要返回
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    // 根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        Message.error(message) // 提示错误消息 然后进到登录页面的的catch里面 最后finally
        return Promise.reject(new Error(message))
    }
}, error => {
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 当等于10002的时候 表示 后端告诉我token超时了
        store.dispatch('user/logout') // 登出action 删除token
        router.push('/login')
    } else {
        Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch捕获错误
})

// 是否超时
function IsCheckTimeOut() {
    var currentTime = Date.now() // 当前时间戳
    var timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service // 导出axios实例
