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
function server({ port, router } = {}) {
    let app = express();

    // 加载中间件
    app.use(express.static('public'));
    app.use(express.static('static'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // 加载路由
    router && app.use(router);

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

    // 启动监听
    port && app.listen(port, () => {
        console.log(`Server running at http://${ app.address().address }:${ app.address().port }/`);
    });

    // 返回结果
    return app;
}


/**
 *****************************************
 * 绑定路由生成器
 *****************************************
 */
server.Router = express.Router;


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = server;
