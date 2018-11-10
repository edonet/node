/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-07-12 10:29:20
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('./fs'),
    path = require('./path'),
    archiver = require('archiver'),
    unarchiver = require('unzip'),
    isString = str => typeof str === 'string';


/**
 *****************************************
 * 打包文件夹
 *****************************************
 */
function zip(src, dist, options = {}) {

    // 重载函数
    switch (arguments.length) {
        case 1:
            return zip(src, src + '.zip', {});
        case 2:
            if (typeof dist === 'object') {
                return zip(src, src + '.zip', dist);
            } else {
                return zip(src, dist, {});
            }
        default:
            break;
    }

    // 校验参数
    if (isString(src) && isString(dist)) {
        return fs.stat(src, (err, stats) => {

            // 处理错误
            if (err) {
                return false;
            }

            // 启动打包
            return new Promise((resolve, reject) => {
                let archive = archiver('zip', { zlib: { level: 9 }, ...options }),
                    output = fs.createWriteStream(dist);


                // 监听事件
                archive.on('error', reject);
                output.on('error', reject);
                output.on('close', resolve);

                // 设置管道输出
                archive.pipe(output);

                // 添加文件
                if (stats.isDirectory()) {
                    archive.directory(src, false);
                } else {
                    archive.file(src, { name: path.basename(src) });
                }

                // 结束添加
                archive.finalize();
            });
        });
    }
}


/**
 *****************************************
 * 解压文件
 *****************************************
 */
function unzip(src, dist) {
    if (isString(src)) {

        // 获取输出目录
        if (arguments.length === 1) {
            dist = src.replace(/\.zip$/, '');
        }

        // 校验参数
        if (isString(dist)) {
            return new Promise((resolve, reject) => {
                let archive = fs.createReadStream(src),
                    output = unarchiver.Extract({ path: dist });

                // 监听回调
                archive.on('error', reject);
                output.on('error', reject);
                output.on('close', resolve);

                // 设置管道输出
                archive.pipe(output);
            });
        }
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { zip, unzip, archiver };
