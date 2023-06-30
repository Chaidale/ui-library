/* 渲染dom节点 */
// 函数化组件
// 自定义内容的组件——函数化组件
// 就可以让组件变为无状态、无实例的函数化组件。
// 因为只是函数，所以渲染的开销相对来说，较小。
const exSlot = {
    functional: true,
    props: {
      row: Object,
      render: Function,
      index: Number,
      column: {
        type: Object,
        default: null
      }
    },
    /**
     * context 作为上下文，
     * data、props、slots、children 以及 parent 都可以通过 context 来访问。
     */
    render: (createElement, context) => {
      const params = {
        row: context.props.row,
        index: context.props.index
      }
      if (context.props.column) params.column = context.props.column
      // 执行传递过来的render，并把参数传过去
      return context.props.render(createElement, params)
    }
  }
  
  export default exSlot
  