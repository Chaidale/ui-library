const path = require('path')
const join = path.join; // 拼接路径
const fs = require('fs');

function resolve(dir) { //获取绝对路径
  return path.resolve(__dirname, dir)
}
// 获取文件夹下所有index.js的绝对路径
function getEntries(path) {
  let files = fs.readdirSync(resolve(path)); // 获取文件夹下所有文件名称数组
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item) // 获取每个文件路径
    const isDir = fs.statSync(itemPath).isDirectory(); // 判断是否为文件夹
    if (isDir) { // 文件夹
      ret[item] = resolve(join(itemPath, 'index.js')) // 获取index.js的绝对路径
    } else { // 不是文件夹
      const [name] = item.split('.') // key值
      ret[name] = resolve(`${itemPath}`) // 获取path文件夹跟目录下的index.js绝对路径
    }
    return ret
  }, {})
  return entries
}

const devConfig = { // 开发配置
  lintOnSave: false,
  pages: {
    index: {
      entry: 'examples/main.js', // 入口文件
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: { // 别名
        "@": resolve('packages'),
        "assets": resolve('examples/assets'),
        "views": resolve("examples/views")
      }
    }
  },
  chainWebpack: config => {
    // 将新增的packages文件夹加入babel编译
    config.module
      .rule('js')
      .include
      .add('/packages') 
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
  }
}

const buildConfig = { // 打包配置
  lintOnSave: false,
  outputDir: 'lib', // 输出文件夹名
  productionSourceMap: false, // 禁止打包生成源码映射
  // 在css.extract.filename上配置样式打包路径和文件名称
  css: {
    sourceMap: true,
    extract: {
      filename: 'style/[name].css' // 在lib文件夹中建立style文件夹中，生成对应的css文件。
    }
  },
  configureWebpack: {
    entry: {
      ...getEntries('packages') // 入口文件
    },
    output: { // 出口文件
      filename: '[name]/index.js', // 文件名
      libraryTarget: 'commonjs2',
    }
  },
  chainWebpack: config => {
    // 在生产环境下也要将新增的packages文件夹加入babel转码编译
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
    // 删除Vue CLI3原先打包编译的一些无用功能
    config.optimization.delete('splitChunks') // 删除splitChunks，因为每个组件是独立打包，不需要抽离每个组件的公共js出来
    config.plugins.delete('copy') // 删除copy，不要复制public文件夹内容到lib文件夹中。
    config.plugins.delete('html') // 删除html，只打包组件，不生成html页面。
    config.plugins.delete('preload') 
    config.plugins.delete('prefetch') // 删除preload以及prefetch，因为不生成html页面，所以这两个也没用。
    config.plugins.delete('hmr') // 删除hmr，删除热更新。
    config.entryPoints.delete('app') // 删除自动加上的入口App。
    // 配置字体的loader
    config.module
      .rule('fonts')
      .use('url-loader')
      .tap(option => {
        option.fallback.options.name = 'static/fonts/[name].[hash:8].[ext]'
        return option
      })
  }
}

module.exports = process.env.NODE_ENV === 'development' ? devConfig : buildConfig // 判断环境变量使用相应的配置