/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-07-05 14:55:32
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('fs'),
    glob = require('glob'),
    path = require('./path'),
    promisify = require('./promisify'),
    origin = {
        stat: promisify(fs.lstat),
        rmdir: promisify(fs.rmdir)
    },
    proxy = {
        stat,
        resolve,
        mkdir: promisify(fs.mkdir),
        readdir: promisify(fs.readdir),
        copy: promisify(copy),
        rmdir: promisify(rmdir),
        readFile: promisify(fs.readFile),
        writeFile: promisify(fs.writeFile),
        copyFile: promisify(copyFile),
        unlink: promisify(fs.unlink),
        glob: promisify(glob),
        createReadStream: fs.createReadStream,
        createWriteStream: fs.createWriteStream,
        FSWatcher: fs.FSWatcher,
        ReadStream: fs.ReadStream,
        WriteStream: fs.WriteStream,
        Stats: fs.Stats
    };


/**
 *****************************************
 * 获取文件状态
 *****************************************
 */
function stat(dir, callback) {
    return new Promise(resolve => {
        fs.lstat(dir, (err, stats = null) => {
            let result = callback && callback(err, stats);

            // 处理异步
            if (result && result instanceof Promise) {
                result.then(() => resolve(stats));
            } else {
                resolve(stats);
            }
        });
    });
}


/**
 *****************************************
 * 加载并解析模块
 *****************************************
 */
function resolve(dir, model = null) {

    // 解析模块
    try {
        let data = require(path.cwd(dir));
        return model && data ? { ...model, ...data } : data;
    } catch (err) {
        // do nothing;
    }

    // 执行回调
    return model;
}


/**
 *****************************************
 * 复制文件
 *****************************************
 */
function copyFile(src, dist, callback) {
    let rs = fs.createReadStream(src),
        ws = fs.createWriteStream(dist);

    // 监听事件
    rs.on('error', callback);
    ws.on('error', callback);
    ws.on('close', callback);

    // 传输文件
    rs.pipe(ws);
}


/**
 *****************************************
 * 复制文件夹
 *****************************************
 */
function copy(src, dist, options = {}, callback = null) {
    let deferred = Promise.all([stat(src), stat(dist)]);

    // 处理参数
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    // 异步处理
    deferred.then(async stats => {

        // 判断源文件是否存在
        if (!stats[0]) {
            return callback(new Error(`Error: '${src}' is not exists!`));
        }

        // 判断目标文件是否存在
        if (stats[1]) {
            return callback(new Error(`Error: '${dist}' is exists!`));
        }

        // 复制文件夹
        try {
            if (stats[0].isDirectory()) {
                let files = await proxy.readdir(src);

                // 创建目标文件夹
                await proxy.mkdir(dist);

                // 拷贝下级文件
                await Promise.all(files.map(file => {
                    let dir = path.join(src, file);

                    // 处理排队文件
                    if (options.exclude && options.exclude.test(dir)) {
                        return Promise.resolve();
                    }

                    // 复制文件
                    return proxy.copy(dir, path.join(dist, file), options);
                }));

            } else {
                await proxy.copyFile(src, dist);
            }
        } catch (err) {
            return callback(err);
        }

        // 执行回调
        callback();
    });
}


/**
 *****************************************
 * 删除文件夹
 *****************************************
 */
function rmdir(src, callback) {
    stat(src).then(async stats => {

        // 判断是否存在文件夹
        if (stats) {
            try {
                if (stats.isDirectory()) {
                    let files = await proxy.readdir(src);

                    // 移除下级目录
                    await Promise.all(
                        files.map(file => proxy.rmdir(path.join(src, file)))
                    );

                    // 移除文件夹
                    await origin.rmdir(src);
                } else {
                    await proxy.unlink(src);
                }
            } catch (err) {
                return callback(err);
            }
        }

        // 执行回调
        callback();
    });
}


/**
 *****************************************
 * 创建代理
 *****************************************
 */
module.exports = new Proxy(fs, {
    get(target, prop) {

        // 生成代码函数
        if (!proxy.hasOwnProperty(prop)) {
            if (typeof prop === 'string' && typeof target[prop] === 'function') {
                proxy[prop] = /^[a-z]/.test(String(prop)) ? promisify(target[prop]) : target[prop];
            } else {
                proxy[prop] = null;
            }
        }

        // 返回代码函数
        return proxy[prop] || target[prop];
    }
});
