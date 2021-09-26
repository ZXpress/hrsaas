import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(), // 设置token为共享状态  一初始化先从缓存中读取
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 数据设置给state
    setToken(token) // vuex和缓存同步
  },
  removeToken(state) {
    state.token = null // 删除vuextoken
    removeToken() // 再清空缓存中的tken
  },
  setUserInfo(state, result) {
    state.userInfo = result
    // state.userInfo = {...result} 这样属于浅拷贝
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 登录成功存时间戳
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情数据(头像)
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo } // 合并结果
    context.commit('setUserInfo', baseResult)
    return result // 这里是给我们后期做权限留下伏笔
  },
  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由为静态路由
    resetRouter() // 重置路由
    // 去设置权限管理模块下的路由为初始状态
    // Vuex子模块怎么调用子模块的actions ： 都没加锁的情况下可以随意调用
    // 因为不加命名空间的情况下所有的mutations和actions都是挂载在全局上的 可以随意地调用
    // 加了命名空间的子模块如何调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context
    // 需要用第三个参数{root：true} 调用根级别的mutations和actions
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
