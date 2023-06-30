// 导入组件，组件必须声明 name
import ThTable from './src/index.vue'

// 为组件提供 install 安装方法，供按需引入
ThTable.install = function(Vue) {
  Vue.component(ThTable.name, ThTable)
}

// 导出组件
export default ThTable