<template>
    <div
      :class="[
        'common-table',
        currentData.length === 0 && isShowBorder
          ? 'no-list-common-table'
          : 'has-list-common-table'
      ]"
    >
      <el-table
        ref="commonTable"
        v-loading="loading"
        :stripe="isShowStripe"
        :default-expand-all="isExpandAll"
        :height="tableHeight"
        :max-height="tableMaxHeight"
        :row-key="rowKey ? rowKey : ''"
        :border="isShowBorder"
        :data="currentData"
        :show-summary="showSummary"
        :header-cell-style="tableHeaderColor"
        :highlight-current-row="highlightCurrentRow ? true : false"
        :element-loading-text="loadingText"
        :element-loading-spinner="loadingIcon"
        :element-loading-background="loadingBG"
        :row-class-name="tableRowClassName"
        :expand-row-keys="expandRowKeys"
        :indent="24"
        :span-method="arraySpanMethod ? arraySpanMethod : null"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        @select-all="selectAll"
        @select="selectSingle"
        @row-click="rowClick"
        @cell-click="cellClick"
        @expand-change="expandChange"
      >
        <template slot="empty">{{ dataTipText }}</template>
        <el-table-column
          v-if="showSelection"
          :type="showSelection ? 'selection' : null"
          width="55"
          :selectable="selectable"
        />
        <el-table-column
          v-if="showIndex"
          :type="showIndex ? 'index' : null"
          label="序号"
          :index="currentIndex"
          width="55"
        />
        <!-- 展开某行展示的内容 -->
        <el-table-column v-if="showExpand" type="expand">
          <template slot-scope="scope">
            <slot name="defineExpand" :scope="scope" />
          </template>
        </el-table-column>
        <!-- 展开某行展示的内容 -->
        <el-table-column
          v-for="item in filterTableColumn"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="
            item.showOverflowTooltip ? item.showOverflowTooltip : false
          "
          :filters="item.filters ? item.filters : null"
          :filter-method="item.filterMethod ? item.filterMethod : null"
          :column-key="item.filterMethod ? item.prop : null"
          :formatter="item.formatter ? item.formatter : null"
          :sortable="item.sortable ? item.sortable : false"
          :fixed="item.fixed ? item.fixed : false"
          :width="item.width ? item.width : ''"
        >
          <template slot-scope="scope">
            <ex-slot
              v-if="item.render"
              :render="item.render"
              :row="scope.row"
              :index="scope.$index"
              :column="item"
            />
            <span v-else-if="item.formatter">{{
              item.formatter(scope.row, item, scope.$index)
            }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
            <!-- 列添加icon 并添加点击事件 -->
            <el-button
              style="padding: 0"
              v-if="item.showIcons && item.showIcons(scope)"
              type="text"
              icon="el-icon-warning"
              size="small"
              circle
              @click.native.prevent.stop="
                buttonIcons(item.func, scope.$index, scope.row, item.params)
              "
              :scope="scope"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="operate && operate.data.length > 0"
          label="操作"
          fixed="right"
          class-name="operate-column-style"
          :width="operate.width"
        >
          <!-- align="center" -->
          <template slot-scope="scope">
            <el-button
              v-for="(item, index) in operate.data"
              v-show="
                ((item.isShow && item.isShow(scope)) || !item.isShow) &&
                  ((item.authString && isAuth(item.authString)) ||
                  !item.authString)
              "
              :key="index"
              :disabled="item.isDisabled && item.isDisabled(scope)"
              :type="item.type"
              size="mini"
              :class="item.className || ''"
              @click.native.prevent.stop="
                buttonMethods(item.func, scope.$index, scope.row, item.params)
              "
              >{{ item.name }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-show="showPagination" class="pagination">
        <el-pagination
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :small="small"
          :pager-count="pagerCount"
          :page-sizes="pageSizes"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="paginationCurrentChange"
          @size-change="paginationSizeChange"
        />
      </div>
    </div>
  </template>
  
  <script>
  // @link 参考链接 https://www.cnblogs.com/linsx/p/9882303.html
  // import {
  //   setSelectedTable,
  //   getSelectedTable,
  //   cleanSelectedTable
  // } from '@/utils/storage'
  // import FileSaver from 'file-saver'
  import exSlot from './exslot' // 函数化组件
  // 获取加载时的背景颜色
  import variables from '../styles/variables.scss'
  
  export default {
    name: 'th-table',
    components: {
      'ex-slot': exSlot
    },
    props: {
      /* ------- 表格 -------*/
      // 设置表格高度，可以固定表头
      tableHeight: {
        type: String
      },
      // 设置表格最大高度
      tableMaxHeight: {
        type: Number
      },
      // 传的所有列 => [{}, {}]
      tableColumn: {
        type: Array,
        default: () => []
      },
      // 表格数据 => [{}, {}]
      tableData: {
        type: Array,
        default: () => []
      },
      // 自定义按键及绑定方法  => {[]}
      operate: {
        type: Object,
        default: () => {}
      },
      // 定制要展示的列 => ['label1', 'label2']
      customColumn: {
        type: Array,
        default: () => []
      },
      // 需要固定的列 => ['label1', 'label2']
      fixedColumn: {
        type: Array,
        default: () => []
      },
      // 固定的列的方向
      fixedDirection: {
        type: String,
        default: 'right'
      },
      // 是否开启表格多选
      showSelection: {
        type: Boolean,
        default: false
      },
      selectable: {
        type: Function,
        default: () => true
      },
      // 是否显示索引
      showIndex: {
        type: Boolean,
        default: false
      },
      // 是否开启表格单选
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      // 动画加载
      loading: {
        type: Boolean,
        default: false
      },
      // 动画提示
      loadingText: {
        type: String,
        default: '加载中'
      },
      // 动画图标
      loadingIcon: {
        type: String,
        default: ''
      },
      // 动画背景色
      loadingBG: {
        type: String,
        default: variables.tableLoadingBg
      },
      // 是否显示边框
      isShowBorder: {
        type: Boolean,
        default: true
      },
      // 是否显示斑马纹
      isShowStripe: {
        type: Boolean,
        default: true
      },
      // 选中时的字段名
      selectFieldUnique: {
        type: String,
        default: 'id'
      },
      // 树形结构需要的rowKey（字段名）
      rowKey: {
        type: String,
        default: ''
      },
      // 设置展开的行
      expandRowKeys: {
        type: Array
      },
      // 是否展开所有行
      isExpandAll: {
        type: Boolean,
        default: false
      },
      /* ------- 表格 -------*/
      /* ------- 分页 -------*/
      showPagination: {
        type: Boolean,
        default: true
      },
      // 是否使用小型分页样式
      small: {
        type: Boolean,
        default: false
      },
      // 页码按钮的数量，当总页数超过该值时会折叠 =>可选值：大于等于 5 且小于等于 21 的奇数
      pagerCount: {
        type: Number,
        default: 7
      },
      // 分组页数
      pageSizes: {
        type: Array,
        default: () => [10, 20, 50, 100]
      },
      // 如果有分页，下面三个参数必须传
      // 默认每页数值
      pageSize: {
        type: Number
      },
      // 当前是哪一页
      currentPage: {
        type: Number
      },
      // 总数
      total: {
        type: Number
      },
      // 是否有展开数据
      showExpand: {
        type: Boolean,
        default: false
      },
      // 计算和
      showSummary: {
        type: Boolean,
        default: false
      },
      // 合并
      arraySpanMethod: {
        type: Function
      },
      /* ------- 分页 -------*/
      // 是否可点击表格
      isCanCellClick: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        filterTableColumn: [], // 表格要展示的列
        currentData: [], // 表格数据
        currentIndex: 1, // 当前索引，切换页面的时候需要重新计算
        dataTipText: '', // table有无数据时的提示
        selectedDataMap: {} // 需要存储到缓存中的数据
      }
    },
    watch: {
      // 传过来展示的所有的列
      tableColumn: {
        handler() {
          // 如果一开始没有传定制展示的列，就默认全展示
          if (this.customColumn.length > 1) {
            this.filterTableColumn = this.tableColumn.filter(
              v => this.customColumn.indexOf(v.label) > -1
            )
          } else {
            this.filterTableColumn = this.tableColumn
          }
        },
        deep: true,
        immediate: true
      },
      // 固定的列 => ['label1', 'label2']
      fixedColumn: {
        handler(val, oldVal) {
          this.filterTableColumn.map((item, index) => {
            if (this.fixedColumn.indexOf(item.label) > -1) {
              this.$set(item, 'fixed', this.fixedDirection)
            }
            return
          })
        },
        deep: true,
        immediate: true
      },
      // 表格数据
      tableData: {
        handler() {
          this.currentData = this.tableData
          if (this.currentData.length === 0 && !this.loading) {
            this.dataTipText = '暂无数据'
          }
          // 如果开启多选，才去显示回选数据
          if (this.showSelection) {
            this.returnSelectData()
          }
        },
        deep: true,
        immediate: true
      },
      // 定制要展示的某几列 => ['label1', 'label2']
      customColumn: {
        handler(val) {
          if (val.length > 1) {
            this.filterTableColumn = this.tableColumn.filter(
              v => val.indexOf(v.label) > -1
            )
          }
        },
        deep: true
      }
    },
    created() {},
    beforeMount() {},
    methods: {
      /**
       * 行内操作方法,具体方法在调用的模块定义
       * func {String}
       */
      buttonMethods(func, index, row, params) {
        this.$emit(func, { index, row, params })
      },
  
      /**
       * 行内图标操作方法,具体方法在调用的模块定义
       * func {String}
       */
      buttonIcons(func, index, row, params) {
        this.$emit(func, { index, row, params })
      },
  
      // 设置表格行的样式
      tableRowClassName({ row, rowIndex }) {
        return ''
      },
  
      // 表头单元格的style回调方法
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        return `color: ${variables.tableHeadFontColor}; background-color: ${
          variables.tableHeadBgColor
        }`
      },
  
      // 对某一行展开或者关闭的时候触发该事件
      expandChange(row) {
        this.$emit('expand-change', row)
      },
  
      // 第一次点击当前行会被触发，再次点击当前行不会被触发。除非再次点击与当前行不同的行才会触发
      handleCurrentChange(currentRow, oldCurrentRow) {},
  
      // 当某行被点击时会触发该事件
      rowClick(row, column, event) {},
  
      // checkbox触发函数，当选择项发生变化时会触发事件(点击全选select也会触发，翻页时也会触发)
      handleSelectionChange(selection) {
        this.$emit('handle-selection-change', selection)
      },
  
      /**
       * 当用户手动勾选数据行的 Checkbox 时触发的事件(点击全选select不会触发)——单选
       * selection：已选中的数据，row：当前点击的行
       * selection中有当前row,说明是选中状态；selection中没有当前row，说明时是未选中状态
       */
      selectSingle(selection, row) {
        // 处理需要存入缓存中的数据
        this.handleSelectTable(selection)
        // 获取数组列表
        const selectedDataArr = this.transSelectListArr()
        // 触发事件
        this.$emit('select-single-change', selectedDataArr)
      },
      // 全选-取消全选
      selectAll(selection) {
        // 处理选中的数据 this.selectedDataMap Map
        this.handleSelectTable(selection)
        // 获取数组列表
        const selectedDataArr = this.transSelectListArr()
        // 触发事件
        this.$emit('select-all-change', selectedDataArr)
      },
  
      // 回显选中的数据
      returnSelectData() {
        // 获取数组列表
        const selectedDataArr = this.transSelectListArr()
        if (selectedDataArr.length == 0) {
          return
        }
        this.$nextTick(() => {
          this.toggleSelection(selectedDataArr, true)
        })
      },
  
      // 多选-选中checkbox
      toggleSelection(rows, flag) {
        if (rows && rows.length > 0) {
          rows.forEach(row => {
            const currentIndex = this.currentData.findIndex(
              item => item[this.selectFieldUnique] == row[this.selectFieldUnique]
            )
            if (currentIndex != -1) {
              // 这个回显必须是this.tableData[index]这种数据
              this.$refs.commonTable.toggleRowSelection(
                this.currentData[currentIndex],
                flag
              )
            }
          })
        }
      },
  
      // 处理选中的数据，存储到 this.selectedDataMap中{page: selection}
      handleSelectTable(selection = []) {
        // 空数据也要塞入当前页对应的，如果不存空数组，数据中还存留的上一次的数据。所以此步骤不需要
        /* if (selection.length === 0) {
          return
        } */
        // 新增{page: selectList}
        this.selectedDataMap = Object.assign({}, this.selectedDataMap, {
          [this.currentPage]: selection
        })
      },
  
      // 转换成数组，并且返回数据，this.selectedDataMap => selectedDataArr，
      transSelectListArr() {
        // 处理map数据
        const dataMap = this.selectedDataMap || {}
        let selectedDataArr = []
        if (
          // 判读缓存中数据是否存在
          dataMap &&
          Object.keys(dataMap).length > 0
        ) {
          Object.keys(dataMap).forEach(key => {
            selectedDataArr = [...selectedDataArr, ...dataMap[key]]
          })
        }
        return selectedDataArr
      },
  
      // 清除选中
      handleClearSelection() {
        this.$refs.commonTable.clearSelection()
      },
  
      /* 分页 */
      // 翻页
      paginationCurrentChange(val) {
        // 重新计算索引起始值
        if (this.showIndex) {
          // = 每页的数值 * (点击的页数 - 1) + 1
          this.currentIndex = this.pageSize * (val - 1) + 1
        }
        this.$emit('pagination-current-change', val)
      },
  
      // 切换每页的长度
      paginationSizeChange(val) {
        this.$emit('pagination-size-change', val)
      },
  
      // 点击某个单元格触发事件
      cellClick(row, column, cell, event) {
        if (!this.isCanCellClick) {
          return
        }
        this.$emit('cell-click', { row, column })
      },
  
      // 组件外部 通过 ref 调用此方法获取表格选中的数据
      getSelectedDataMap() {
        return this.selectedDataMap
      },
  
      // 组件外部 通过 ref 调用此方法更新表格选中的数据
      // 注：因本组件 tableData watch 中已调用 returnSelectData，故建议组件外 tableData的赋值 写到 此方法调用 之后，这样组件外就无需再次调用 returnSelectData
      setSelectedDataMap(newVal) {
        if (Object.prototype.toString.call(newVal) === '[object Object]') {
          this.selectedDataMap = newVal
        }
      }
    }
  }
  </script>
  
  <style lang="scss">
  @import '../styles/variables.scss';
  /* 表格样式 start */
  .common-table .rowClassName {
    cursor: move !important;
  }
  // 有数据时的表格的边框
  .has-list-common-table {
    .el-table--border,
    .el-table--group {
      border-top: 1px solid $tableBorderColor;
      border-left: 1px solid $tableBorderColor;
    }
  }
  // 没有数据时的表格的边框
  .no-list-common-table {
    border: 1px solid $tableBorderColor;
  }
  .common-table {
    position: relative;
    .el-table {
      th.gutter {
        display: table-cell !important;
      }
      tr {
        color: $tableFontColor;
        background-color: $tableTrBgColor;
      }
    }
    .operate-column-style {
      .el-button {
        margin-left: 0;
        margin-right: 10px;
        margin-bottom: 5px;
      }
    }
    .el-table__row--striped {
      td {
        background: $tableStripedTdBgColor !important;
      }
    }
    // 还没有展开时的table背景色
    .el-table__body-wrapper {
      background-color: $tableNoWrapperBgColor !important;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      height: 0px !important;
      background-color: none !important;
    }
    .el-table__fixed-right::before,
    .el-table__fixed::before {
      height: 0px !important;
      background-color: none !important;
    }
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid $tableBorderColor;
      border-right: 1px solid $tableBorderColor;
      box-sizing: border-box;
    }
    /* 鼠标悬浮 */
    .common-table .el-table__body tr.hover-row > td {
      background: $tableTrHoverBgColor !important;
    }
    .el-table__empty-block {
      background: $tableTrBgColor;
    }
    .el-table__empty-text {
      color: $tableFontColor;
    }
    // 表格table折叠展开的icon
    .el-table__expand-icon {
      .el-icon-arrow-right:before {
        content: '\E791' !important;
      }
      .el-icon-arrow-right {
        font-size: 17px;
        // color: #fff;
      }
    }
    /* 表格样式 end */
    .active-row {
      color: red;
    }
  
    /* 分页 start*/
    .el-pagination .el-input__inner {
      border: 1px solid $pagInputInnerBorderColor;
      color: $pagFontColor;
    }
    .el-pagination li,
    .el-pagination .btn-next,
    .el-pagination .btn-prev {
      background: $pagLiNextPrevBgColor !important;
      color: $pagFontColor;
    }
    .el-pagination li.active {
      background: $pagLiActiveBgColor !important;
    }
    .el-pagination .el-pagination__total,
    .el-pagination .el-pagination__jump {
      color: $pagFontColor;
    }
    /* 分页 end*/
  }
  </style>
  