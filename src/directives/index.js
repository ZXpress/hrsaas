// 负责管理所有的自定义指令
export const imageerror = {
    // 指令对象
    inserted(dom, options) {
        // options是指令中变量的解释 有一个属性为value
        // dom 表示当前指令作用的dom对象
        dom.src = dom.src || options.value
        // 当图片有地址 没有加载成功会报错 会触发一个事件 onerror
        dom.onerror = function () {
            // dom注册error事件
            dom.src = options.value // 当图片异常时会将指令配置的默认图片设置为该图片的内容
        }
    },
    update(dom, options) {
        dom.src = dom.src || options.value
    }
}
