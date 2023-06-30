// 导入组件，组件必须声明 name
import ThImage from './src/index.vue'

// 为组件提供 install 安装方法，供按需引入
ThImage.install = function(Vue) {
  Vue.component(ThImage.name, ThImage)
}

// 导出组件
export default ThImage