import Vue from 'vue'
import App from './App.vue'
import ThUI from '../packages/index.js'
import 'element-ui/lib/theme-chalk/index.css';
import{
  Pagination,
  Table,
  TableColumn,
} from 'element-ui'

Vue.use(ThUI)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.config.productionTip = false
 

new Vue({
  render: h => h(App),
}).$mount('#app')
