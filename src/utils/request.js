// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
}) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器
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
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch捕获错误
}) // 响应拦截器
export default service // 导出axios实例
