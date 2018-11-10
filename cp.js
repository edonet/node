/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-07-10 10:21:12
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    cp = require('child_process'),
    promisify = require('./promisify');


/**
 *****************************************
 * 执行命令
 *****************************************
 */
function spawn(cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
        let data = '',
            error = '',
            commander = cp.spawn(cmd, args, {
                cwd: process.cwd(),
                env: process.env,
                ...options
            });

        // 监听标准输出
        if (commander.stdout) {
            commander.stdout.on('data', val => data += val);
        }

        // 监听错误输出
        if (commander.stderr) {
            commander.stderr.on('data', val => error += val);
        }

        // 添加监听事件
        commander.on('error', reject);
        commander.on('close', () => resolve([data, error]));
    });
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = Object.assign(Object.create(cp), {
    spawn,
    exec: promisify(cp.exec)
});
