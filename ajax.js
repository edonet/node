/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-01 10:40:20
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const request = require('request');
const defer = require('./defer');


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = createAjax();


/**
 *****************************************
 * 创建请求
 *****************************************
 */
function createAjax(settings) {

    // 创建请求方法
    function ajax(options, callback) {
        let { promise, resolve, reject } = defer(),
            xhr;

        // 生成配置
        options = createOptions({ ...settings, ...options });

        // 创建请求
        xhr = request(options, (err, response, body) => {

            // 解析数据
            if (!err) {
                try {
                    response.result = JSON.parse(body);
                } catch (err) {
                    // do nothings;
                }

                // 解析返回
                return resolve(response);
            }

            // 抛出错误
            reject(err);
        });

        // 执行就绪回调
        callback && callback(xhr);

        // 返回结果
        return promise;
    }

    // 【GET】请求
    ajax.get = (url, params) => ajax({ url, qs: params });

    // 【POST】请求
    ajax.post = (url, data) => ajax({
        url,
        json: data,
        headers: { 'Content-type': 'application/json' }
    });

    // 创建实例
    ajax.create = options => {
        return createAjax({ ...settings, ...options });
    };

    // 返回方法
    return ajax;
}


/**
 *****************************************
 * 创建配置
 *****************************************
 */
function createOptions({ params: qs, data: json, ...options }) {
    return { qs, json, ...options };
}
