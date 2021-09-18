import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken() // 设置token为共享状态  一初始化先从缓存中读取
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
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
