// 导入组件
import ThButton from './th-button/index.js'
import ThImage from './th-image/index.js'
import ThTable from './th-table/index.js'
import Toast from './toast/index.js'

// 需要全局注册的组件放在此
const components = [
  ThButton,
  ThImage,
  ThTable
]

const install = function(Vue) {
  if (install.installed) return
  // 全局注册组件
  components.map(component => Vue.component(component.name, component))

  // 声明vue全局函数
  Vue.prototype.$toast = Toast
}

if (typeof window !== undefined && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ThButton,
  ThImage,
  ThTable,
  Toast
}