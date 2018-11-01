/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-01 10:40:20
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 创建延时对象
 *****************************************
 */
module.exports = function defer() {
    let deferred = {};

    // 生成【promise】
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    // 返回对象
    return deferred;
};
