import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import Component from '@/components'

import * as directives from '@/directives'

import * as filters from '@/filters' // 引入工具类 

import i18n from '@/lang'

import '@/icons' // icon
import '@/permission' // permission control

import Print from 'vue-print-nb' // 打印插件

import CheckPermission from '@/mixin/checkPermission'

Vue.use(Print);

Vue.use(Component) // 注册自定义组件

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  // element本身支持i18n
  // 此时i18n就会根据当前lang语言组件的locale属性去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key, value)
})

// 全局混入检查对象  表示所有的组件都拥有了检查的方法
Vue.use(CheckPermission)

// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册全局的过滤器
// console.log(Object.keys(filters));
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({ // 实例化Vue
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
