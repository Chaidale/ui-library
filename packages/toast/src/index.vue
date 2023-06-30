<!-- 消息提示组件 -->
<template>
    <!-- 添加过渡动画 -->
    <transition name="toast-from-top" appear @after-leave="handleAfterLeave">
      <div class="my-toast" v-show="show">
        <div class="my-toast-content">
          {{ message }}
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: "MyToast",
    data() {
      return {
        time: 2000, // toast 展示时长
        timer: null, // 存储延时器id
        show: false, // toast 是否展示
        message: "", // 消息内容
        onClose: null // 关闭后的回调
      };
    },
    watch: {
      show(val) { // 监听显示，设置延时器自动消失
        if (val) {
          this.timer = setTimeout(() => {
            this.show = false;
            this.timer = null;
            // 消失后执行onClose
            if (typeof this.onClose === 'function') {
              this.onClose(this);
            }
          }, this.time);
        }
      },
    },
    methods: {
      // 销毁组件
      handleAfterLeave() {
        this.$destroy() // 销毁组件
        this.$el.remove() // 移除页面dom
      },
    },
  };
  </script>
  
  <style lang="scss">
    .my-toast {
        position: fixed;
        top: 25%;
        width: 100%;
        text-align: center;
    }
    
    .my-toast-content {
        display: inline-block;
        text-align: center;
        max-width: 80%;
        box-sizing: border-box;
        padding: 10px;
        background-color: hsla(0, 0%, 7%, 0.7);
        color: #fff;
        border-radius: 3px;
    }
    .toast-from-top-enter-active,
    .toast-from-top-leave-active{
        transition: all 0.5s;
    }
    .toast-from-top-enter,
    .toast-from-top-leave-active {
        opacity: 0;
        transform: translateY(-10px);
    }
  </style>