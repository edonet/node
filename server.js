/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-01 10:35:15
 *****************************************
 */
'use strict';


/**
 *****************************************
 *  加载依赖
 *****************************************
 */
const express = require('express');
const bodyParser = require('body-parser');


/**
 *****************************************
 * 创建服务器
 *****************************************
 */
function server({ router } = {}) {
    let app = express(),
        listen = app.listen;

    // 加载中间件
    app.use(express.static('public'));
    app.use(express.static('static'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // 加载路由
    if (router) {
        app.use(router);
    }

    // 启动监听
    app.listen = (port, host, callback) => {

        // 重载参数
        if (typeof host === 'function') {
            return app.listen(port, 'localhost', host);
        }

        // 监听错误信息
        app.use(function (err, req, res, next) {

            // 打印错误
            console.error(err.stack);

            // 返回错误信息
            if (req.xhr) {
                res.status(500).send({ error: 'Something failed!' });
            } else {
                next(err);
            }
        });

        // 启动服务
        listen(port, host, function() {
            let { address, port } = this.address();

            // 设置本地地址
            if (!address || address === '::') {
                address = 'localhost';
            }

            // 打印信息
            console.log('-'.repeat(60));
            console.log(`Server running at: http://${ address }:${ port || '80' }/`);
            console.log('-'.repeat(60));

            // 执行回调
            callback && callback(app);
        });
    };

    // 返回结果
    return app;
}


/**
 *****************************************
 * 绑定路由生成器
 *****************************************
 */
server.router = express.Router;


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = server;
