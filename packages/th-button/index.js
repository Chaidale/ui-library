// 导入组件，组件必须声明 name
import ThButton from './src/index.vue'

// 为组件提供 install 安装方法，供按需引入
ThButton.install = function(Vue) {
  Vue.component(ThButton.name, ThButton)
}

// 导出组件
export default ThButton