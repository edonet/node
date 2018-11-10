/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-07-06 15:43:36
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 【Promise】化
 *****************************************
 */
module.exports = function promisify(handler) {
    return function promised(...args) {
        return new Promise((resolve, reject) => {
            let callback = null,
                flag = true;

            // 获取回调函数
            if (typeof args[args.length - 1] === 'function') {
                callback = args.pop();
            }

            // 执行函数
            handler(...args, (err, ...res) => {
                if (flag) {

                    // 更新标识
                    flag = false;

                    // 处理错误
                    if (err) {
                        return reject(err);
                    }

                    // 执行回调
                    try {
                        let result = callback && callback(err, ...res);

                        // 异步处理
                        if (result && typeof result === 'object' && 'then' in result) {
                            result.then(
                                () => resolve(res.length < 2 ? res[0] : res),
                                reject
                            );
                        } else {
                            resolve(res.length < 2 ? res[0] : res);
                        }
                    } catch (err) {
                        reject(err);
                    }
                }
            });
        });
    };
};
