/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-07-07 09:40:22
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    os = require('os'),
    path = require('path'),
    cwd = process.cwd(),
    homedir = os.homedir();


/**
 *****************************************
 * 使用目录作为基础目录
 *****************************************
 */
function usedir(root) {
    return function dir(...args) {
        return path.resolve(root, ...args);
    };
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = Object.assign(Object.create(path), {
    cwd: usedir(cwd),
    homedir: usedir(homedir),
    resolve: path.resolve,
    usedir
});
