<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <th-button @click="test">我是猪</th-button>
    <button @click="test">消息提示</button>
    <!-- <th-image :url='url'></th-image> -->
    <th-table 
      :loading="loading"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"></th-table>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data(){
    return{
      url:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      tableData:[{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      // --分页 start--
      total: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageSize: 10, // 每页10条数据
      // --分页 end--
      tableColumn: [
        { prop: 'date', label: '时间' },
        { prop: 'name', label: '姓名' },
        { prop: 'address', label: '地址' }
      ], // 表头数据
      operate: [], // 表格按键操作区;
      loading: true
    }
  },
  methods:{
    test() {
      this.$toast({
        message: 'wwwwwwwwwwww',
        onClose() {
          alert('ooooooooooooo')
        }
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
