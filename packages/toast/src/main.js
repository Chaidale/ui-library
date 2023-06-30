import Vue from 'vue'
// 引入组件
import Index from './index.vue'

// 创建toast构造器
let ToastConstructor = Vue.extend(Index)

let instance;

// 定义toast函数
const Toast = function(options) {
  options = options || {} // 添加options默认值
  if (typeof options === 'string') { // options为字符串，放入展示内容中
    options = {
      message: options
    }
  }

  instance = new ToastConstructor({ // 创建toast实例，替换data中与options键值相同的项
    data: options
  })
  instance.$mount() // 挂载空dom，生成$el对象
  document.body.appendChild(instance.$el) // 将dom放至body下
  instance.show = true // 显示组件
}

export default Toast