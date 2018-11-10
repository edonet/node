/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-08-06 16:42:30
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    vm = require('vm'),
    babel = require('babel-core'),
    fs = require('./fs'),
    path = require('./path'),
    babelOptions = {
        ast: false,
        babelrc: false,
        env: process.env,
        plugins: [
            require.resolve('babel-plugin-transform-object-rest-spread'),
            require.resolve('babel-plugin-transform-es2015-modules-commonjs')
        ]
    };


/**
 *****************************************
 * 执行代码
 *****************************************
 */
function runCode(code, options = {}) {
    let res = babel.transform(code, babelOptions),
        scope = { exports: {} },
        dirname = options.__dirname || process.cwd(),
        filename = options.__filename || dirname + '/index.js',
        resolve = file => file.startsWith('.') ? path.resolve(dirname, file) : file,
        loader = file => require(resolve(file)),
        script = new vm.Script(res.code, { filename });

    // 设置解析函数
    loader.resolve = resolve;

    // 解析数据
    return script.runInNewContext({
        process,
        ...options,
        module: scope,
        exports: scope.exports,
        require: loader,
        __dirname: dirname,
        __filename: filename
    });
}


/**
 *****************************************
 * 执行文件
 *****************************************
 */
async function runFile(src, options) {
    return runCode(await fs.readFile(src, 'utf-8'), {
        __dirname: path.dirname(src),
        __filename: src,
        ...options
    });
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { runCode, runFile };
