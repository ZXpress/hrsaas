// 做一个混入对象

import store from '@/store'

export default {
    methods: {
        // 检查权限  key就是要检查的点
        checkPermission(key) {
            // 去用户的信息里的找point中有没有key  如果有key则有权限  否则没有
            const { userInfo } = store.state.user
            if (userInfo.roles.points && userInfo.roles.points.length) {
                return userInfo.roles.points.some(item => item === key)
            }
            return false
        }
    }
}
