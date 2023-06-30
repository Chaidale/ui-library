<!-- 按钮组件 -->
<template>
    <button @click="click" class="th-button">
      <slot></slot>
    </button>
</template>

<script>
export default {
  name: 'ThButton', // name必须，在给组件命名时会用到
  data() {
    return {

    };
  },
  methods:{
    click(){
        this.$emit('click')
    }
  }
}
</script>

<style lang='scss' scoped>
// @import "./css/index.scss";
.th-button{
    color: red;
}
</style>