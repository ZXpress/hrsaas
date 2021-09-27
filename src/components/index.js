// 该文件负责所有的公共的组件的全局注册   Vue.use

import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import LangSelect from './lang'
import TagsView from './TagsView'

export default {
    install(Vue) {
        //  注册全局的通用栏组件对象
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
        Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
        Vue.component('ThemePicker', ThemePicker)
        Vue.component('LangSelect', LangSelect)
        Vue.component('TagsView', TagsView) // 注册多页签组件
    }
}
