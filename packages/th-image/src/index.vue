<!-- 按钮组件 -->
<template>
   <img :src="url" alt="">
</template>

<script>
export default {
  name: 'ThImage', // name必须，在给组件命名时会用到
  props:{
    url:null
  },
  data() {
    return {

    };
  }
}
</script>

<style lang='scss' scoped>
img{
  width:100%;
  height: 100%;
}
</style>